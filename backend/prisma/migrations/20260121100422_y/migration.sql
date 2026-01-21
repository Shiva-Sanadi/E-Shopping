-- AlterTable
ALTER TABLE `address` ALTER COLUMN `phone` DROP DEFAULT;

-- AlterTable
ALTER TABLE `order` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `user` ALTER COLUMN `updatedAt` DROP DEFAULT;
