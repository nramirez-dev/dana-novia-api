/*
  Warnings:

  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- Insert a default category so we can associate existing products
INSERT INTO "Category" ("id", "name", "slug", "updatedAt") 
VALUES ('default-category-1', 'General', 'general', CURRENT_TIMESTAMP);

-- AlterTable to add the new column (nullable initially)
ALTER TABLE "Product" ADD COLUMN     "categoryId" TEXT;

-- Update existing records to the default category
UPDATE "Product" SET "categoryId" = 'default-category-1' WHERE "categoryId" IS NULL;

-- Make the column required
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Finally, drop the old column
ALTER TABLE "Product" DROP COLUMN "category";
