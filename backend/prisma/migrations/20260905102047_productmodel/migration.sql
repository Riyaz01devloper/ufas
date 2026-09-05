-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('GOODS', 'SERVICE', 'COMBO');

-- CreateEnum
CREATE TYPE "FurnitureCategory" AS ENUM ('CHAIRS', 'TABLES', 'SOFAS', 'BEDS', 'WARDROBES', 'CABINETS', 'DESKS', 'DINING', 'OFFICE_FURNITURE', 'OUTDOOR_FURNITURE', 'STORAGE', 'MATTRESSES', 'OTHER');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brandName" TEXT,
    "type" "ProductType" NOT NULL DEFAULT 'GOODS',
    "category" "FurnitureCategory" NOT NULL,
    "purchasingPrice" DOUBLE PRECISION NOT NULL,
    "sellingPrice" DOUBLE PRECISION NOT NULL,
    "availableQuantity" INTEGER NOT NULL,
    "maxMargin" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
