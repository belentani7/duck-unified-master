import { float, index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const tracks = mysqlTable("tracks", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }).notNull(),
  genre: varchar("genre", { length: 64 }).notNull(),
  credits: varchar("credits", { length: 255 }).notNull(),
  bpm: int("bpm"),
  duration: varchar("duration", { length: 32 }),
  coverUrl: text("coverUrl"),
  audioUrl: text("audioUrl"),
  isFeatured: int("isFeatured").notNull().default(0),
  isSingle: int("isSingle").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Track = typeof tracks.$inferSelect;
export type InsertTrack = typeof tracks.$inferInsert;

export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }),
  clientPhone: varchar("clientPhone", { length: 64 }),
  genre: varchar("genre", { length: 64 }).notNull(),
  status: varchar("status", { length: 64 }).notNull().default("Em Andamento"),
  bpm: int("bpm").notNull().default(140),
  key: varchar("key", { length: 32 }).notNull().default("C#m"),
  budget: varchar("budget", { length: 64 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  action: varchar("action", { length: 255 }).notNull(),
  details: text("details"),
  performedBy: varchar("performedBy", { length: 255 }).default("Duck").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

export const duckProjects = mysqlTable("duck_projects", {
  id: int("id").autoincrement().primaryKey(),
  ownerOpenId: varchar("ownerOpenId", { length: 64 }),
  name: varchar("name", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }).notNull(),
  bpm: int("bpm").notNull().default(140),
  key: varchar("key", { length: 50 }).notNull().default("C# Minor"),
  genre: varchar("genre", { length: 100 }).notNull().default("Trap"),
  status: varchar("status", { length: 50 }).notNull().default("Mixagem"),
  progress: int("progress").notNull().default(50),
  audioUrl: text("audioUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [index("duck_projects_owner_created_idx").on(table.ownerOpenId, table.createdAt)]);

export const duckStems = mysqlTable("duck_stems", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  stemName: varchar("stemName", { length: 255 }).notNull(),
  fileKey: text("fileKey").notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileSize: int("fileSize").notNull().default(0),
  status: varchar("status", { length: 32 }).notNull().default("enviado"),
  reviewNote: text("reviewNote"),
  reviewedAt: timestamp("reviewedAt"),
  reviewedBy: varchar("reviewedBy", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("duck_stems_project_created_idx").on(table.projectId, table.createdAt)]);

export const duckComments = mysqlTable("duck_comments", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  authorName: varchar("authorName", { length: 255 }).notNull(),
  content: text("content").notNull(),
  timestampSeconds: float("timestampSeconds").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("duck_comments_project_created_idx").on(table.projectId, table.createdAt)]);

export const duckAuditLogs = mysqlTable("duck_audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  ownerOpenId: varchar("ownerOpenId", { length: 64 }),
  action: varchar("action", { length: 255 }).notNull(),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("duck_audit_owner_created_idx").on(table.ownerOpenId, table.createdAt)]);
