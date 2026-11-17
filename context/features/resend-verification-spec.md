# Resend Verification Email

## Overview

Let credentials users who never received (or lost) their verification email request a new one. Today the verification email is sent only once, at registration (`src/app/api/auth/register/route.ts`), with no way to request another — a real gap given the Resend sandbox only delivers to the account owner's address.

## Requirements

- Add `POST /api/auth/resend-verification`
  - Body `{ email }`, validated with Zod (`z.email()`); malformed JSON returns 400 (same pattern as `src/app/api/auth/forgot-password/route.ts`)
  - Always return the same generic 200 response — `{ success: true, data: { message: "If an unverified account exists for that email, we've sent a new verification link." } }` — regardless of whether the account exists, is GitHub-only, or is already verified (no account enumeration)
  - Only send when the user exists, has a password (credentials account), and `emailVerified` is null
  - Reuse `createVerificationToken` (`src/lib/verification-token.ts` — already deletes any prior token for that email, so old links are invalidated) and `sendVerificationEmail` (`src/lib/verification-email.ts` — throws on Resend's returned `{ error }`)
  - Build `verifyUrl` the same way as the register route (`/api/auth/verify-email?token=...`)
  - Log send failures without changing the response
  - If `emailVerificationEnabled` is false, the endpoint is a no-op returning the generic message
- Add a `/resend-verification` page: email form posting to the endpoint, inline success/error display (matching `/forgot-password`)
- Link to `/resend-verification` from `/sign-in` — at minimum in the `emailDeliveryFailed` amber banner and the `registered=1` "check your email" banner; hide the link when `emailVerificationEnabled` is false

## Rate Limiting

| Endpoint | Limit | Window | Key By |
|----------|-------|--------|--------|
| `/api/auth/resend-verification` | 3 attempts | 15 min | IP + email |

- Use the `src/lib/rate-limit.ts` utility (Upstash sliding window) from the Rate Limiting for Auth feature
- Over the limit: 429 with `{ error: "Too many attempts. Please try again in X minutes." }` and a `Retry-After` header
- Show the 429 message inline on the `/resend-verification` form
- Fail open (allow the request) if Upstash is unavailable or unconfigured

## Notes

- Depends on Rate Limiting for Auth (`rate-limiting-spec.md`) shipping first, for `rate-limit.ts`
- Same timing side-channel caveat as forgot-password: only real unverified accounts incur the Resend round-trip, even though response bodies are identical
- Resend sandbox only delivers to the account owner's address until a custom domain is verified
- Out of scope: enforcing email verification at sign-in (still tracked, not enforced)
