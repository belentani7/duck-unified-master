import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "collaborator", "viewer"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here


export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  userId: int("userId"),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }),
  role: mysqlEnum("role", ["viewer", "collaborator", "admin"]).default("viewer").notNull(),
  genre: varchar("genre", { length: 80 }),
  status: mysqlEnum("status", ["active", "pending", "archived"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId"),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  phase: varchar("phase", { length: 80 }).default("Pré-produção").notNull(),
  status: mysqlEnum("status", ["active", "review", "paused", "completed"]).default("active").notNull(),
  progress: int("progress").default(0).notNull(),
  participation: varchar("participation", { length: 180 }).default("Duck 100%").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const deliveries = mysqlTable("deliveries", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  version: varchar("version", { length: 32 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: text("fileUrl"),
  status: mysqlEnum("status", ["draft", "review", "approved", "archived"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const projectComments = mysqlTable("projectComments", {
  id: int("id").autoincrement().primaryKey(),
  deliveryId: int("deliveryId").notNull(),
  authorId: int("authorId").notNull(),
  body: text("body").notNull(),
  timestampMs: int("timestampMs"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const projectActivities = mysqlTable("projectActivities", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  actorId: int("actorId").notNull(),
  action: varchar("action", { length: 180 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});


export const instrumentals = mysqlTable("instrumentals", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  genre: varchar("genre", { length: 80 }),
  bpm: int("bpm"),
  musicalKey: varchar("musicalKey", { length: 16 }),
  audioUrl: text("audioUrl"),
  status: mysqlEnum("status", ["available", "reserved", "sold"]).default("available").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const licenseOffers = mysqlTable("licenseOffers", {
  id: int("id").autoincrement().primaryKey(),
  instrumentalId: int("instrumentalId").notNull(),
  kind: mysqlEnum("kind", ["lease", "premium", "exclusive"]).notNull(),
  priceCents: int("priceCents").notNull(),
  streamLimit: int("streamLimit"),
  split: varchar("split", { length: 180 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const sales = mysqlTable("sales", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  licenseOfferId: int("licenseOfferId").notNull(),
  referralCode: varchar("referralCode", { length: 64 }),
  amountCents: int("amountCents").notNull(),
  status: mysqlEnum("status", ["pending", "paid", "refunded"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  discountPercent: int("discountPercent").default(10).notNull(),
  uses: int("uses").default(0).notNull(),
  active: int("active").default(1).notNull(),
});

export const contracts = mysqlTable("contracts", {
  id: int("id").autoincrement().primaryKey(),
  saleId: int("saleId").notNull(),
  status: mysqlEnum("status", ["draft", "sent", "signed"]).default("draft").notNull(),
  documentUrl: text("documentUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const studioNotifications = mysqlTable("studioNotifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  kind: varchar("kind", { length: 64 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const studioTasks = mysqlTable("studioTasks", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  clientId: int("clientId"),
  projectId: int("projectId"),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "canceled"]).default("pending").notNull(),
  priority: mysqlEnum("priority", ["low", "normal", "high"]).default("normal").notNull(),
  dueAt: timestamp("dueAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
