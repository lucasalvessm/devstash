import type { NextRequest } from "next/server";

import { handlers } from "@/auth";
import { checkLoginRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const { GET } = handlers;

// Direct POSTs to the credentials callback bypass the sign-in server action,
// so they're rate limited here before NextAuth handles them.
export async function POST(request: NextRequest) {
  if (new URL(request.url).pathname.endsWith("/callback/credentials")) {
    const formData = await request.clone().formData().catch(() => null);
    const rateLimit = await checkLoginRateLimit(request.headers, formData?.get("email"));
    if (!rateLimit.success) {
      return rateLimitResponse(rateLimit.reset);
    }
  }

  return handlers.POST(request);
}
