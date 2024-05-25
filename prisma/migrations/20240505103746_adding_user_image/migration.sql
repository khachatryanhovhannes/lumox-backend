/*
  Warnings:

  - Added the required column `imagePath` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `imagePath` VARCHAR(191) NOT NULL;
