import { prisma } from "../lib/prisma.js";

async function seedReports() {
  const rent = await prisma.account.findFirst({
    where: {
      accountName: "Rent Expense",
      accountType: "EXPENSE",
    },
  });

  const salary = await prisma.account.findFirst({
    where: {
      accountName: "Salary Expense",
      accountType: "EXPENSE",
    },
  });

  const electricity = await prisma.account.findFirst({
    where: {
      accountName: "Electricity Expense",
      accountType: "EXPENSE",
    },
  });

  const transport = await prisma.account.findFirst({
    where: {
      accountName: "Transport Expense",
      accountType: "EXPENSE",
    },
  });

  const maintenance = await prisma.account.findFirst({
    where: {
      accountName: "Maintenance Expense",
      accountType: "EXPENSE",
    },
  });

  const marketing = await prisma.account.findFirst({
    where: {
      accountName: "Marketing Expense",
      accountType: "EXPENSE",
    },
  });

  await prisma.expense.createMany({
    data: [
      {
        accountId: rent.id,
        description: "Monthly showroom rent",
        amount: 35000,
      },
      {
        accountId: salary.id,
        description: "Staff salaries",
        amount: 75000,
      },
      {
        accountId: electricity.id,
        description: "Showroom electricity",
        amount: 8500,
      },
      {
        accountId: transport.id,
        description: "Furniture transportation",
        amount: 12000,
      },
      {
        accountId: maintenance.id,
        description: "Showroom maintenance",
        amount: 6500,
      },
      {
        accountId: marketing.id,
        description: "Marketing and advertising",
        amount: 15000,
      },
    ],
  });

  console.log("Report data seeded successfully.");
}

seedReports()
  .catch((error) => {
    console.error("Error seeding reports:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
