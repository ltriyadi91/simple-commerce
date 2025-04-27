/*
  Warnings:

  - A unique constraint covering the columns `[createdBy]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[updatedBy]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdBy]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[updatedBy]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdBy]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[updatedBy]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdBy]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[updatedBy]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdBy]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[updatedBy]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdBy]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[updatedBy]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdBy]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[updatedBy]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "updatedBy" TEXT,
ADD COLUMN     "updatedById" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_createdBy_key" ON "Cart"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_updatedBy_key" ON "Cart"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_createdBy_key" ON "CartItem"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_updatedBy_key" ON "CartItem"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "Image_createdBy_key" ON "Image"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "Image_updatedBy_key" ON "Image"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "Order_createdBy_key" ON "Order"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "Order_updatedBy_key" ON "Order"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_createdBy_key" ON "OrderItem"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_updatedBy_key" ON "OrderItem"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "Product_createdBy_key" ON "Product"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "Product_updatedBy_key" ON "Product"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "User_createdBy_key" ON "User"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "User_updatedBy_key" ON "User"("updatedBy");
