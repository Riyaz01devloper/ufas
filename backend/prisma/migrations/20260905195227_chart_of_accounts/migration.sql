-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ASSET', 'LIABILITY', 'EXPENSE', 'INCOME', 'CAPITAL');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
