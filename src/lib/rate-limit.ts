import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

interface RateLimitConfig {
  limit: number;
  window: Duration;
}

export const RATE_LIMITS = {
  login: { limit: 5, window: "15 m" },
  register: { limit: 3, window: "1 h" },
  forgotPassword: { limit: 3, window: "1 h" },
  resetPassword: { limit: 5, window: "15 m" },
} satisfies Record<string, RateLimitConfig>;

export type RateLimitName = keyof typeof RATE_LIMITS;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

const limiters = new Map<RateLimitName, Ratelimit>();

function getLimiter(name: RateLimitName, client: Redis) {
  let limiter = limiters.get(name);
  if (!limiter) {
    const { limit, window } = RATE_LIMITS[name];
    limiter = new Ratelimit({
      redis: client,
      limiter: Ratelimit.slidingWindow(limit, window),
      prefix: `devstash:ratelimit:${name}`,
      // Upstash allows the request through if Redis doesn't answer in time.
      timeout: 2000,
    });
    limiters.set(name, limiter);
  }
  return limiter;
}

// Fails open: if Upstash is unconfigured or errors, the request is allowed.
export async function checkRateLimit(name: RateLimitName, key: string): Promise<RateLimitResult> {
  if (!redis) {
    return { success: true, remaining: RATE_LIMITS[name].limit, reset: Date.now() };
  }

  try {
    const { success, remaining, reset } = await getLimiter(name, redis).limit(key);
    return { success, remaining, reset };
  } catch (error) {
    console.error(`Rate limit check failed for "${name}", allowing request:`, error);
    return { success: true, remaining: RATE_LIMITS[name].limit, reset: Date.now() };
  }
}

// Keyed by IP + email so one attacker can't lock out every account behind a shared IP.
export function checkLoginRateLimit(headers: Headers, email: unknown): Promise<RateLimitResult> {
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  return checkRateLimit("login", `${getClientIp(headers)}:${normalizedEmail}`);
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}

export function getRetryAfterSeconds(reset: number): number {
  return Math.max(1, Math.ceil((reset - Date.now()) / 1000));
}

export function getRetryAfterMinutes(reset: number): number {
  return Math.max(1, Math.ceil((reset - Date.now()) / 60_000));
}

export function formatRateLimitMessage(minutes: number): string {
  return `Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}

export function rateLimitResponse(reset: number) {
  return NextResponse.json(
    { success: false, error: formatRateLimitMessage(getRetryAfterMinutes(reset)) },
    { status: 429, headers: { "Retry-After": String(getRetryAfterSeconds(reset)) } },
  );
}
