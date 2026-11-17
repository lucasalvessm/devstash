"use server";

import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { checkLoginRateLimit, getRetryAfterMinutes } from "@/lib/rate-limit";

export async function signInWithCredentials(formData: FormData) {
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

  const rateLimit = await checkLoginRateLimit(await headers(), formData.get("email"));
  if (!rateLimit.success) {
    redirect(`/sign-in?error=RateLimited&retryAfter=${getRetryAfterMinutes(rateLimit.reset)}`);
  }

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/sign-in?error=${error.type}`);
    }
    throw error;
  }
}

export async function signInWithGitHub(formData: FormData) {
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

  try {
    await signIn("github", { redirectTo: callbackUrl });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/sign-in?error=${error.type}`);
    }
    throw error;
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/sign-in" });
}
