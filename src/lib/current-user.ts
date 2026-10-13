import { cache } from "react";

import { auth } from "@/auth";

// Cached per request (React server-side request memoization) so the many db/*
// helpers that each need the current user's id only trigger one session lookup.
export const getCurrentUserId = cache(async (): Promise<string> => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("No authenticated user");
  }

  return session.user.id;
});
