import Link from "next/link";

import { signInWithCredentials, signInWithGitHub } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  OAuthAccountNotLinked: "This email is already associated with a different sign-in method.",
};

interface SignInPageProps {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { error, callbackUrl } = await searchParams;
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? "Something went wrong. Please try again.") : null;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in to DevStash</CardTitle>
          <CardDescription>Welcome back — sign in to continue.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {errorMessage && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{errorMessage}</p>
          )}

          <form action={signInWithGitHub}>
            <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />
            <Button type="submit" variant="outline" className="w-full">
              Sign in with GitHub
            </Button>
          </form>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>

          <form action={signInWithCredentials} className="flex flex-col gap-4">
            <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-foreground underline underline-offset-4">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
