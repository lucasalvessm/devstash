import { cache } from "react";

import { prisma } from "@/lib/prisma";

// No auth is wired up yet, so every query is scoped to the seeded demo user for now.
// Swap this for the authenticated user's id (e.g. from the NextAuth session) once auth is in place.
const DEMO_USER_EMAIL = "demo@devstash.io";

// Cached per request (React server-side request memoization) so the many db/*
// helpers that each need the current user's id only trigger one lookup query.
export const getCurrentUserId = cache(async (): Promise<string> => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });

  return user.id;
});
