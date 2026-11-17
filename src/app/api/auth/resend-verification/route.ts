import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { createVerificationToken, emailVerificationEnabled } from "@/lib/verification-token";
import { sendVerificationEmail } from "@/lib/verification-email";

const resendVerificationSchema = z.object({ email: z.email() });

const GENERIC_MESSAGE = "If an unverified account exists for that email, we've sent a new verification link.";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = resendVerificationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { email } = parsed.data;

  // Keyed by IP + email, so the body has to be parsed before the check (unlike the IP-only routes).
  const rateLimitKey = `${getClientIp(request.headers)}:${email.trim().toLowerCase()}`;
  const rateLimit = await checkRateLimit("resendVerification", rateLimitKey);
  if (!rateLimit.success) {
    return rateLimitResponse(rateLimit.reset);
  }

  if (emailVerificationEnabled) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { password: true, emailVerified: true },
    });

    // Only unverified credentials accounts get a new link. Every other case (no account,
    // GitHub-only, already verified, send failure) returns the same generic message below
    // so the response never reveals account existence or state.
    if (user?.password && !user.emailVerified) {
      const token = await createVerificationToken(email);
      const verifyUrl = new URL(`/api/auth/verify-email?token=${token}`, request.url).toString();

      try {
        await sendVerificationEmail({ to: email, verifyUrl });
      } catch (error) {
        console.error("Failed to resend verification email:", error);
      }
    }
  }

  return NextResponse.json({ success: true, data: { message: GENERIC_MESSAGE } }, { status: 200 });
}
