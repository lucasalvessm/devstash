// Run with `npx tsx scripts/test-db.ts`. Plain `node` can't run this file: the tsconfig "@/*"
// alias only resolves through Next.js's bundler, and Prisma's generated client uses
// extension-less relative imports meant for a bundler too — tsx's resolver handles both.
import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const [userCount, itemTypeCount, collectionCount] = await Promise.all([
    prisma.user.count(),
    prisma.itemType.count(),
    prisma.collection.count(),
  ]);

  console.log("Connected to the database successfully.");
  console.log(`  users: ${userCount}`);
  console.log(`  item types: ${itemTypeCount}`);
  console.log(`  collections: ${collectionCount}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Database connection test failed:", error);
  process.exit(1);
});
