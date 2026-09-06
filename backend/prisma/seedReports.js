import { prisma } from "../../lib/prisma.js";

async function seedReports() {
  // expense accounts
  // expense transactions
  // additional sales
  // additional purchases
  // etc.
}

seedReports()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });