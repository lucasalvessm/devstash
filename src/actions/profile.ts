"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
type ActionResult = { success: true } | { success: false; error: string };

export async function changePassword(input: ChangePasswordInput): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user.password) {
      return { success: false, error: "Password sign-in is not enabled for this account" };
    }

    const isValid = await bcrypt.compare(parsed.data.currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: "Current password is incorrect" };
    }

    const hashed = await bcrypt.hash(parsed.data.newPassword, 12);
    await prisma.user.update({ where: { id: session.user.id }, data: { password: hashed } });

    return { success: true };
  } catch (error) {
    console.error("Failed to change password:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  await prisma.user.delete({ where: { id: session.user.id } });
  await signOut({ redirectTo: "/sign-in" });
}
