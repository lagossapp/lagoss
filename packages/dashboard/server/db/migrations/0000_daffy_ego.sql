CREATE TABLE `Deployment` (
	`id` varchar(191) NOT NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	`functionId` varchar(191) NOT NULL,
	`triggerer` varchar(191) DEFAULT 'Lagoss',
	`commit` varchar(191),
	`isProduction` tinyint NOT NULL DEFAULT 0,
	`assets` json NOT NULL,
	CONSTRAINT `Deployment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Domain` (
	`id` varchar(191) NOT NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	`domain` varchar(191) NOT NULL,
	`functionId` varchar(191) NOT NULL,
	CONSTRAINT `Domain_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `EnvVariable` (
	`id` varchar(191) NOT NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	`key` varchar(64) NOT NULL,
	`value` varchar(5120) NOT NULL,
	`functionId` varchar(191) NOT NULL,
	CONSTRAINT `EnvVariable_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `OrganizationMember` (
	`id` varchar(191) NOT NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	`organizationId` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	CONSTRAINT `OrganizationMember_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Organization` (
	`id` varchar(191) NOT NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	`name` varchar(64) NOT NULL,
	`description` varchar(256),
	`ownerId` varchar(191) NOT NULL,
	`stripe_customer_id` varchar(191),
	`stripe_subscription_id` varchar(191),
	`plan` varchar(191) NOT NULL DEFAULT 'personal',
	`plan_period_end` datetime,
	CONSTRAINT `Organization_id` PRIMARY KEY(`id`),
	CONSTRAINT `Organization_stripe_customer_id_unique` UNIQUE(`stripe_customer_id`),
	CONSTRAINT `Organization_stripe_subscription_id_unique` UNIQUE(`stripe_subscription_id`)
);
--> statement-breakpoint
CREATE TABLE `Function` (
	`id` varchar(191) NOT NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	`name` varchar(64) NOT NULL,
	`memory` int NOT NULL,
	`tickTimeout` int NOT NULL DEFAULT 500,
	`cron` varchar(191),
	`organizationId` varchar(191) NOT NULL,
	`cronRegion` varchar(191),
	`totalTimeout` int NOT NULL DEFAULT 5000,
	CONSTRAINT `Function_id` PRIMARY KEY(`id`),
	CONSTRAINT `Function_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `Token` (
	`id` varchar(191) NOT NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	`value` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	CONSTRAINT `Token_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191),
	`email` varchar(191),
	`emailVerified` datetime,
	`image` varchar(191),
	`verificationCode` varchar(191),
	`currentOrganizationId` varchar(191),
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `Deployment` ADD CONSTRAINT `Deployment_functionId_Function_id_fk` FOREIGN KEY (`functionId`) REFERENCES `Function`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Domain` ADD CONSTRAINT `Domain_functionId_Function_id_fk` FOREIGN KEY (`functionId`) REFERENCES `Function`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `EnvVariable` ADD CONSTRAINT `EnvVariable_functionId_Function_id_fk` FOREIGN KEY (`functionId`) REFERENCES `Function`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `OrganizationMember` ADD CONSTRAINT `OrganizationMember_organizationId_Organization_id_fk` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `OrganizationMember` ADD CONSTRAINT `OrganizationMember_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Function` ADD CONSTRAINT `Function_organizationId_Organization_id_fk` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Token` ADD CONSTRAINT `Token_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `User` ADD CONSTRAINT `User_currentOrganizationId_Organization_id_fk` FOREIGN KEY (`currentOrganizationId`) REFERENCES `Organization`(`id`) ON DELETE no action ON UPDATE no action;