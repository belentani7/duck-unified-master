CREATE TABLE `contracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`saleId` int NOT NULL,
	`status` enum('draft','sent','signed') NOT NULL DEFAULT 'draft',
	`documentUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contracts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `instrumentals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(180) NOT NULL,
	`genre` varchar(80),
	`bpm` int,
	`musicalKey` varchar(16),
	`audioUrl` text,
	`status` enum('available','reserved','sold') NOT NULL DEFAULT 'available',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `instrumentals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `licenseOffers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`instrumentalId` int NOT NULL,
	`kind` enum('lease','premium','exclusive') NOT NULL,
	`priceCents` int NOT NULL,
	`streamLimit` int,
	`split` varchar(180) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `licenseOffers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`discountPercent` int NOT NULL DEFAULT 10,
	`uses` int NOT NULL DEFAULT 0,
	`active` int NOT NULL DEFAULT 1,
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `referrals_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`licenseOfferId` int NOT NULL,
	`referralCode` varchar(64),
	`amountCents` int NOT NULL,
	`status` enum('pending','paid','refunded') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sales_id` PRIMARY KEY(`id`)
);
