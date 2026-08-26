CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320),
	`role` enum('viewer','collaborator','admin') NOT NULL DEFAULT 'viewer',
	`genre` varchar(80),
	`status` enum('active','pending','archived') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deliveries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`version` varchar(32) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` text,
	`status` enum('draft','review','approved','archived') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `deliveries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectActivities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`actorId` int NOT NULL,
	`action` varchar(180) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectActivities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deliveryId` int NOT NULL,
	`authorId` int NOT NULL,
	`body` text NOT NULL,
	`timestampMs` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int,
	`ownerId` int NOT NULL,
	`name` varchar(180) NOT NULL,
	`phase` varchar(80) NOT NULL DEFAULT 'Pré-produção',
	`status` enum('active','review','paused','completed') NOT NULL DEFAULT 'active',
	`progress` int NOT NULL DEFAULT 0,
	`participation` varchar(180) NOT NULL DEFAULT 'Duck 100%',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
