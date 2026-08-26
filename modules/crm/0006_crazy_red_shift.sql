CREATE TABLE `studioTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`clientId` int,
	`projectId` int,
	`title` varchar(180) NOT NULL,
	`description` text,
	`status` enum('pending','in_progress','completed','canceled') NOT NULL DEFAULT 'pending',
	`priority` enum('low','normal','high') NOT NULL DEFAULT 'normal',
	`dueAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `studioTasks_id` PRIMARY KEY(`id`)
);
