/*
  Warnings:

  - You are about to drop the column `stripe_current_period_end` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_price_id` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Organization` DROP COLUMN `stripe_current_period_end`,
    DROP COLUMN `stripe_price_id`,
    ADD COLUMN `plan` VARCHAR(191) NULL,
    ADD COLUMN `plan_period_end` DATETIME(3) NULL;
