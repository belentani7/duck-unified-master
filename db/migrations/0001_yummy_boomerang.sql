CREATE TABLE `automationAuditEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`action` varchar(120) NOT NULL,
	`status` enum('ready','paused','blocked','awaiting_approval','executed') NOT NULL,
	`risk` enum('low','medium','high') NOT NULL,
	`detail` text NOT NULL,
	`ownerId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `automationAuditEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `automationControls` (
	`id` int NOT NULL,
	`globalPaused` boolean NOT NULL DEFAULT false,
	`manualApproval` boolean NOT NULL DEFAULT true,
	`updatedById` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `automationControls_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clientProjects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`briefId` int,
	`title` varchar(160) NOT NULL,
	`status` enum('intake','production','review','delivered','closed') NOT NULL DEFAULT 'intake',
	`progress` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `clientProjects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consentRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`purpose` varchar(120) NOT NULL,
	`granted` boolean NOT NULL,
	`privacyRegion` varchar(40) NOT NULL DEFAULT 'unspecified',
	`capturedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `consentRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deliverables` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`label` varchar(160) NOT NULL,
	`fileUrl` text NOT NULL,
	`version` varchar(40) NOT NULL DEFAULT 'v1',
	`approvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `deliverables_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`service` varchar(80) NOT NULL,
	`message` text,
	`marketingConsent` boolean NOT NULL DEFAULT false,
	`privacyRegion` varchar(40) NOT NULL DEFAULT 'unspecified',
	`status` enum('new','qualified','active','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectBriefs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`objective` text NOT NULL,
	`references` text,
	`mood` varchar(80),
	`bpm` int,
	`genre` varchar(80),
	`status` enum('submitted','reviewing','approved','archived') NOT NULL DEFAULT 'submitted',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectBriefs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectFeedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`userId` int NOT NULL,
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectFeedback_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectMilestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`status` enum('pending','review','approved') NOT NULL DEFAULT 'pending',
	`dueAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectMilestones_id` PRIMARY KEY(`id`)
);
