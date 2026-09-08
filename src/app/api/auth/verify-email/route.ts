import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  const redirect = (params: Record<string, string>) =>
    NextResponse.redirect(new URL(`/sign-in?${new URLSearchParams(params)}`, origin));

  if (!token) {
    return redirect({ error: "InvalidToken" });
  }

  const verificationToken = await prisma.verificationToken.findUnique({ where: { token } });

  if (!verificationToken) {
    return redirect({ error: "InvalidToken" });
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return redirect({ error: "TokenExpired" });
  }

  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  });
  await prisma.verificationToken.delete({ where: { token } });

  return redirect({ verified: "1" });
}
