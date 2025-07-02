ALTER TABLE `Organization` DROP INDEX `Organization_stripe_customer_id_unique`;--> statement-breakpoint
ALTER TABLE `Organization` DROP INDEX `Organization_stripe_subscription_id_unique`;--> statement-breakpoint
ALTER TABLE `Organization` DROP COLUMN `stripe_customer_id`;--> statement-breakpoint
ALTER TABLE `Organization` DROP COLUMN `stripe_subscription_id`;