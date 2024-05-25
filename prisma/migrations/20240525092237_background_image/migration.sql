-- AlterTable
ALTER TABLE `users` ADD COLUMN `backgroundImagePath` VARCHAR(191) NULL,
    MODIFY `imagePath` VARCHAR(191) NULL;
