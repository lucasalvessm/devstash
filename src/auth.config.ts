import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    GitHub,
    Credentials({
      credentials: { email: {}, password: {} },
      // Overridden in auth.ts with real bcrypt validation — this file must
      // stay edge-compatible (no Prisma), so it can't touch the database.
      authorize: () => null,
    }),
  ],
} satisfies NextAuthConfig;
