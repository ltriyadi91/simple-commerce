-- DropIndex
DROP INDEX "Cart_createdBy_key";

-- DropIndex
DROP INDEX "Cart_updatedBy_key";

-- DropIndex
DROP INDEX "CartItem_createdBy_key";

-- DropIndex
DROP INDEX "CartItem_updatedBy_key";

-- DropIndex
DROP INDEX "Image_createdBy_key";

-- DropIndex
DROP INDEX "Image_updatedBy_key";

-- DropIndex
DROP INDEX "Order_createdBy_key";

-- DropIndex
DROP INDEX "Order_updatedBy_key";

-- DropIndex
DROP INDEX "OrderItem_createdBy_key";

-- DropIndex
DROP INDEX "OrderItem_updatedBy_key";

-- DropIndex
DROP INDEX "Product_createdBy_key";

-- DropIndex
DROP INDEX "Product_updatedBy_key";

-- DropIndex
DROP INDEX "User_createdBy_key";

-- DropIndex
DROP INDEX "User_updatedBy_key";

-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "createdBy" SET DEFAULT 'system';

-- AlterTable
ALTER TABLE "CartItem" ALTER COLUMN "createdBy" SET DEFAULT 'system';

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "createdBy" SET DEFAULT 'system';

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "createdBy" SET DEFAULT 'system';

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "createdBy" SET DEFAULT 'system';

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "createdBy" SET DEFAULT 'system';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdBy" SET DEFAULT 'system';
