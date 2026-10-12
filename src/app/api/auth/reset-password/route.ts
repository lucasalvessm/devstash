import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { deletePasswordResetToken, getValidPasswordResetEmail } from "@/lib/password-reset-token";

const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { token, password } = parsed.data;
  const email = await getValidPasswordResetEmail(token);

  if (!email) {
    return NextResponse.json(
      { success: false, error: "That reset link is invalid or has expired." },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({ where: { email }, data: { password: hashedPassword } });
  await deletePasswordResetToken(token);

  return NextResponse.json({ success: true }, { status: 200 });
}
