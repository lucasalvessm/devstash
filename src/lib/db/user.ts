import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export interface ProfileUser {
  name: string;
  email: string;
  image: string | null;
  createdAt: Date;
  hasPassword: boolean;
}

export async function getProfileUser(): Promise<ProfileUser> {
  const userId = await getCurrentUserId();

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { name: true, email: true, image: true, createdAt: true, password: true },
  });

  return {
    name: user.name ?? "Unknown",
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
    hasPassword: user.password !== null,
  };
}
