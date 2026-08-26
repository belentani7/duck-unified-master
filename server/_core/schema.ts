import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  service: varchar("service", { length: 80 }).notNull(),
  message: text("message"),
  marketingConsent: boolean("marketingConsent").notNull().default(false),
  privacyRegion: varchar("privacyRegion", { length: 40 }).notNull().default("unspecified"),
  source: varchar("source", { length: 120 }).notNull().default("direct"),
  status: mysqlEnum("status", ["new", "qualified", "active", "closed"]).notNull().default("new"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const projectBriefs = mysqlTable("projectBriefs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  objective: text("objective").notNull(),
  references: text("references"),
  mood: varchar("mood", { length: 80 }),
  bpm: int("bpm"),
  genre: varchar("genre", { length: 80 }),
  status: mysqlEnum("status", ["submitted", "reviewing", "approved", "archived"]).notNull().default("submitted"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const clientProjects = mysqlTable("clientProjects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  briefId: int("briefId"),
  title: varchar("title", { length: 160 }).notNull(),
  status: mysqlEnum("status", ["intake", "production", "review", "delivered", "closed"]).notNull().default("intake"),
  progress: int("progress").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const projectMilestones = mysqlTable("projectMilestones", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  status: mysqlEnum("status", ["pending", "review", "approved"]).notNull().default("pending"),
  dueAt: timestamp("dueAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const deliverables = mysqlTable("deliverables", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  label: varchar("label", { length: 160 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  version: varchar("version", { length: 40 }).notNull().default("v1"),
  approvedAt: timestamp("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const projectFeedback = mysqlTable("projectFeedback", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  userId: int("userId").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const automationControls = mysqlTable("automationControls", {
  id: int("id").primaryKey(),
  globalPaused: boolean("globalPaused").notNull().default(false),
  manualApproval: boolean("manualApproval").notNull().default(true),
  updatedById: int("updatedById"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const automationAuditEvents = mysqlTable("automationAuditEvents", {
  id: int("id").autoincrement().primaryKey(),
  action: varchar("action", { length: 120 }).notNull(),
  status: mysqlEnum("status", ["ready", "paused", "blocked", "awaiting_approval", "executed"]).notNull(),
  risk: mysqlEnum("risk", ["low", "medium", "high"]).notNull(),
  detail: text("detail").notNull(),
  ownerId: int("ownerId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const consentRecords = mysqlTable("consentRecords", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  purpose: varchar("purpose", { length: 120 }).notNull(),
  granted: boolean("granted").notNull(),
  privacyRegion: varchar("privacyRegion", { length: 40 }).notNull().default("unspecified"),
  capturedAt: timestamp("capturedAt").defaultNow().notNull(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description"),
  category: mysqlEnum("category", ["beat", "license", "production", "service", "preset", "digital_file", "package"]).notNull(),
  priceCents: int("priceCents"),
  currency: varchar("currency", { length: 3 }).notNull().default("BRL"),
  availability: mysqlEnum("availability", ["draft", "active", "archived", "sold_out"]).notNull().default("draft"),
  licenseTemplateId: int("licenseTemplateId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const licenseTemplates = mysqlTable("licenseTemplates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  version: varchar("version", { length: 40 }).notNull(),
  termsText: text("termsText").notNull(),
  status: mysqlEnum("status", ["draft", "active", "archived"]).notNull().default("draft"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const digitalAssets = mysqlTable("digitalAssets", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId"),
  label: varchar("label", { length: 180 }).notNull(),
  category: mysqlEnum("category", ["audio", "image", "video", "preset", "document", "project_file", "other"]).notNull(),
  storageKey: varchar("storageKey", { length: 512 }).notNull().unique(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  sizeBytes: int("sizeBytes"),
  contentHash: varchar("contentHash", { length: 128 }),
  version: varchar("version", { length: 40 }).notNull().default("v1"),
  accessLevel: mysqlEnum("accessLevel", ["private", "client", "licensed", "public"]).notNull().default("private"),
  status: mysqlEnum("status", ["pending", "active", "archived"]).notNull().default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const productAssets = mysqlTable("productAssets", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  assetId: int("assetId").notNull(),
  role: mysqlEnum("role", ["preview", "cover", "licensed_file", "documentation"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const commerceOrders = mysqlTable("commerceOrders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  productId: int("productId").notNull(),
  licenseTemplateId: int("licenseTemplateId"),
  amountCents: int("amountCents").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("BRL"),
  status: mysqlEnum("status", ["pending", "paid", "cancelled", "refunded", "failed"]).notNull().default("pending"),
  provider: varchar("provider", { length: 80 }),
  providerReference: varchar("providerReference", { length: 200 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const issuedLicenses = mysqlTable("issuedLicenses", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull().unique(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  licenseTemplateId: int("licenseTemplateId").notNull(),
  licenseNumber: varchar("licenseNumber", { length: 100 }).notNull().unique(),
  termsVersion: varchar("termsVersion", { length: 40 }).notNull(),
  status: mysqlEnum("status", ["active", "revoked", "expired"]).notNull().default("active"),
  territory: varchar("territory", { length: 120 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const commercialEvents = mysqlTable("commercialEvents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  leadId: int("leadId"),
  productId: int("productId"),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  source: varchar("source", { length: 120 }),
  metadataJson: text("metadataJson"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const operationTasks = mysqlTable("operationTasks", {
  id: int("id").autoincrement().primaryKey(),
  taskType: varchar("taskType", { length: 120 }).notNull(),
  priority: mysqlEnum("priority", ["low", "normal", "high", "critical"]).notNull().default("normal"),
  status: mysqlEnum("status", ["pending", "running", "paused", "completed", "failed", "cancelled", "awaiting_approval"]).notNull().default("pending"),
  source: varchar("source", { length: 120 }).notNull(),
  attempts: int("attempts").notNull().default(0),
  maxAttempts: int("maxAttempts").notNull().default(1),
  result: text("result"),
  error: text("error"),
  requiresApproval: boolean("requiresApproval").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const privacyRequests = mysqlTable("privacyRequests", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  requestType: mysqlEnum("requestType", ["access", "deletion", "consent_withdrawal"]).notNull(),
  privacyRegion: varchar("privacyRegion", { length: 40 }).notNull().default("unspecified"),
  status: mysqlEnum("status", ["received", "identity_verification", "processing", "completed", "rejected"]).notNull().default("received"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const revenueScenarioSettings = mysqlTable("revenueScenarioSettings", {
  id: int("id").primaryKey(),
  qualifiedVisits: int("qualifiedVisits"),
  conversionBasisPoints: int("conversionBasisPoints"),
  averageTicketCents: int("averageTicketCents"),
  variableCostBasisPoints: int("variableCostBasisPoints"),
  updatedById: int("updatedById"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const leadNotes = mysqlTable("leadNotes", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  authorId: int("authorId").notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
