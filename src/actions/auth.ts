"use server";

import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { checkLoginRateLimit, getRetryAfterMinutes } from "@/lib/rate-limit";

// Builds the /sign-in error URL, carrying the submitted email (never the password)
// and callbackUrl so the form can be re-populated after the redirect.
function signInErrorUrl(formData: FormData, params: Record<string, string>): string {
  const search = new URLSearchParams(params);
  const email = formData.get("email");
  const callbackUrl = formData.get("callbackUrl");
  if (typeof email === "string" && email) search.set("email", email);
  if (typeof callbackUrl === "string" && callbackUrl) search.set("callbackUrl", callbackUrl);
  return `/sign-in?${search.toString()}`;
}

export async function signInWithCredentials(formData: FormData) {
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

  const rateLimit = await checkLoginRateLimit(await headers(), formData.get("email"));
  if (!rateLimit.success) {
    redirect(
      signInErrorUrl(formData, {
        error: "RateLimited",
        retryAfter: String(getRetryAfterMinutes(rateLimit.reset)),
      }),
    );
  }

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(signInErrorUrl(formData, { error: error.type }));
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
