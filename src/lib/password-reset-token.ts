import { randomBytes } from "node:crypto";

import { prisma } from "@/lib/prisma";

const TOKEN_TTL_MS = 60 * 60 * 1000;
const IDENTIFIER_PREFIX = "reset:";

export async function createPasswordResetToken(email: string) {
  const identifier = `${IDENTIFIER_PREFIX}${email}`;
  await prisma.verificationToken.deleteMany({ where: { identifier } });

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + TOKEN_TTL_MS);

  await prisma.verificationToken.create({ data: { identifier, token, expires } });

  return token;
}

// Prefixing the identifier keeps reset tokens from colliding with email-verification
// tokens for the same address, since VerificationToken has no "purpose" field and
// createVerificationToken()/createPasswordResetToken() each clear prior tokens by identifier.
export async function getValidPasswordResetEmail(token: string) {
  const verificationToken = await prisma.verificationToken.findUnique({ where: { token } });

  if (!verificationToken || !verificationToken.identifier.startsWith(IDENTIFIER_PREFIX)) {
    return null;
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return null;
  }

  return verificationToken.identifier.slice(IDENTIFIER_PREFIX.length);
}

export async function deletePasswordResetToken(token: string) {
  await prisma.verificationToken.deleteMany({ where: { token } });
}
