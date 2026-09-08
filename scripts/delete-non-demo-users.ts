// Deletes every user except the seeded demo user, along with all of their
// content (items, collections, custom item types, accounts, sessions) via
// the schema's cascading foreign keys. Run with `npm run db:delete-non-demo-users`.
import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "../src/generated/prisma/client";

const DEMO_USER_EMAIL = "demo@devstash.io";

async function main() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const usersToDelete = await prisma.user.findMany({
    where: { email: { not: DEMO_USER_EMAIL } },
    select: { id: true, email: true },
  });

  if (usersToDelete.length === 0) {
    console.log("No non-demo users found — nothing to delete.");
    await prisma.$disconnect();
    return;
  }

  console.log(`Deleting ${usersToDelete.length} user(s):`);
  for (const user of usersToDelete) {
    console.log(`  - ${user.email}`);
  }

  const { count } = await prisma.user.deleteMany({
    where: { email: { not: DEMO_USER_EMAIL } },
  });

  // VerificationToken has no FK to User (NextAuth's standard shape), so leftover
  // tokens for deleted users aren't cascaded — clean those up separately.
  const { count: tokenCount } = await prisma.verificationToken.deleteMany({
    where: { identifier: { not: DEMO_USER_EMAIL } },
  });

  console.log(`Deleted ${count} user(s) and their content, plus ${tokenCount} stray verification token(s).`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Failed to delete non-demo users:", error);
  process.exit(1);
});
