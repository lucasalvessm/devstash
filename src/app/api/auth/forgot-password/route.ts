import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createPasswordResetToken } from "@/lib/password-reset-token";
import { sendPasswordResetEmail } from "@/lib/password-reset-email";

const forgotPasswordSchema = z.object({ email: z.email() });

const GENERIC_MESSAGE = "If an account exists for that email, we've sent a password reset link.";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email }, select: { password: true } });

  // Only credentials accounts (password set) can reset a password. Whether a match was
  // found, or an email was sent, or sending failed, the response is always the same
  // generic message below — any difference would reveal account existence.
  if (user?.password) {
    const token = await createPasswordResetToken(email);
    const resetUrl = new URL(`/reset-password?token=${token}`, request.url).toString();

    try {
      await sendPasswordResetEmail({ to: email, resetUrl });
    } catch (error) {
      console.error("Failed to send password reset email:", error);
    }
  }

  return NextResponse.json({ success: true, data: { message: GENERIC_MESSAGE } }, { status: 200 });
}
