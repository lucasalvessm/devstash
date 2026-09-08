import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createVerificationToken, emailVerificationEnabled } from "@/lib/verification-token";
import { sendVerificationEmail } from "@/lib/verification-email";

const registerSchema = z
  .object({
    name: z.string().min(1),
    email: z.email(),
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

  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { success: false, error: "An account with this email already exists" },
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      ...(emailVerificationEnabled ? {} : { emailVerified: new Date() }),
    },
    select: { id: true, name: true, email: true },
  });

  if (emailVerificationEnabled) {
    const token = await createVerificationToken(email);
    const verifyUrl = new URL(`/api/auth/verify-email?token=${token}`, request.url).toString();

    try {
      await sendVerificationEmail({ to: email, verifyUrl });
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }
  }

  return NextResponse.json({ success: true, data: user }, { status: 201 });
}
