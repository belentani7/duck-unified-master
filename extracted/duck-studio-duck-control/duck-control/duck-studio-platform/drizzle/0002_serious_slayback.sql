CREATE TABLE `commerceOrders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`productId` int NOT NULL,
	`licenseTemplateId` int,
	`amountCents` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'BRL',
	`status` enum('pending','paid','cancelled','refunded','failed') NOT NULL DEFAULT 'pending',
	`provider` varchar(80),
	`providerReference` varchar(200),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `commerceOrders_id` PRIMARY KEY(`id`),
	CONSTRAINT `commerceOrders_providerReference_unique` UNIQUE(`providerReference`)
);
--> statement-breakpoint
CREATE TABLE `commercialEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`leadId` int,
	`productId` int,
	`eventType` varchar(100) NOT NULL,
	`source` varchar(120),
	`metadataJson` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `commercialEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `digitalAssets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int,
	`label` varchar(180) NOT NULL,
	`category` enum('audio','image','video','preset','document','project_file','other') NOT NULL,
	`storageKey` varchar(512) NOT NULL,
	`mimeType` varchar(120) NOT NULL,
	`sizeBytes` int,
	`contentHash` varchar(128),
	`version` varchar(40) NOT NULL DEFAULT 'v1',
	`accessLevel` enum('private','client','licensed','public') NOT NULL DEFAULT 'private',
	`status` enum('pending','active','archived') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `digitalAssets_id` PRIMARY KEY(`id`),
	CONSTRAINT `digitalAssets_storageKey_unique` UNIQUE(`storageKey`)
);
--> statement-breakpoint
CREATE TABLE `issuedLicenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`licenseTemplateId` int NOT NULL,
	`licenseNumber` varchar(100) NOT NULL,
	`termsVersion` varchar(40) NOT NULL,
	`status` enum('active','revoked','expired') NOT NULL DEFAULT 'active',
	`territory` varchar(120),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `issuedLicenses_id` PRIMARY KEY(`id`),
	CONSTRAINT `issuedLicenses_orderId_unique` UNIQUE(`orderId`),
	CONSTRAINT `issuedLicenses_licenseNumber_unique` UNIQUE(`licenseNumber`)
);
--> statement-breakpoint
CREATE TABLE `licenseTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`version` varchar(40) NOT NULL,
	`termsText` text NOT NULL,
	`status` enum('draft','active','archived') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `licenseTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `operationTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`taskType` varchar(120) NOT NULL,
	`priority` enum('low','normal','high','critical') NOT NULL DEFAULT 'normal',
	`status` enum('pending','running','paused','completed','failed','cancelled','awaiting_approval') NOT NULL DEFAULT 'pending',
	`source` varchar(120) NOT NULL,
	`attempts` int NOT NULL DEFAULT 0,
	`maxAttempts` int NOT NULL DEFAULT 1,
	`result` text,
	`error` text,
	`requiresApproval` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `operationTasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `privacyRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`requestType` enum('access','deletion','consent_withdrawal') NOT NULL,
	`privacyRegion` varchar(40) NOT NULL DEFAULT 'unspecified',
	`status` enum('received','identity_verification','processing','completed','rejected') NOT NULL DEFAULT 'received',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `privacyRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productAssets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`assetId` int NOT NULL,
	`role` enum('preview','cover','licensed_file','documentation') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productAssets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(180) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`description` text,
	`category` enum('beat','license','production','service','preset','digital_file','package') NOT NULL,
	`priceCents` int,
	`currency` varchar(3) NOT NULL DEFAULT 'BRL',
	`availability` enum('draft','active','archived','sold_out') NOT NULL DEFAULT 'draft',
	`licenseTemplateId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `revenueScenarioSettings` (
	`id` int NOT NULL,
	`qualifiedVisits` int,
	`conversionBasisPoints` int,
	`averageTicketCents` int,
	`variableCostBasisPoints` int,
	`updatedById` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `revenueScenarioSettings_id` PRIMARY KEY(`id`)
);
