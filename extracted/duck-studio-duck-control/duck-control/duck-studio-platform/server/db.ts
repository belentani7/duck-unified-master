import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { createHash } from "node:crypto";
import {
  automationAuditEvents,
  automationControls,
  clientProjects,
  commercialEvents,
  commerceOrders,
  consentRecords,
  deliverables,
  digitalAssets,
  InsertUser,
  issuedLicenses,
  licenseTemplates,
  leadNotes,
  operationTasks,
  privacyRequests,
  products,
  productAssets,
  leads,
  projectBriefs,
  projectFeedback,
  projectMilestones,
  revenueScenarioSettings,
  users,
} from "../drizzle/schema";
import { ENV } from './_core/env';
import { storageGetSignedUrl, storagePut } from "./storage";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createLead(input: {
  name: string;
  email: string;
  service: string;
  message?: string;
  marketingConsent: boolean;
  privacyRegion: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const result = await db.insert(leads).values(input);
  if (input.marketingConsent) {
    await db.insert(consentRecords).values({
      email: input.email,
      purpose: "commercial_follow_up",
      granted: true,
      privacyRegion: input.privacyRegion,
    });
  }
  return result;
}

export async function createProjectBrief(userId: number, input: {
  title: string;
  objective: string;
  references?: string;
  mood?: string;
  bpm?: number;
  genre?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.insert(projectBriefs).values({ userId, ...input });
}

export async function getProjectBriefs(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projectBriefs).where(eq(projectBriefs.userId, userId)).orderBy(desc(projectBriefs.createdAt));
}

export async function getClientProjects(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clientProjects).where(eq(clientProjects.userId, userId)).orderBy(desc(clientProjects.updatedAt));
}

export async function createFeedback(userId: number, projectId: number, message: string) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const project = await db.select({ id: clientProjects.id }).from(clientProjects).where(and(eq(clientProjects.id, projectId), eq(clientProjects.userId, userId))).limit(1);
  if (!project[0]) throw new Error("No tienes acceso a este proyecto.");
  return db.insert(projectFeedback).values({ userId, projectId, message });
}

export async function getClientProjectWorkspace(userId: number, projectId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const project = await db.select().from(clientProjects).where(and(eq(clientProjects.id, projectId), eq(clientProjects.userId, userId))).limit(1);
  if (!project[0]) return undefined;
  const [milestones, files, feedback] = await Promise.all([
    db.select().from(projectMilestones).where(eq(projectMilestones.projectId, projectId)).orderBy(desc(projectMilestones.createdAt)),
    db.select().from(deliverables).where(eq(deliverables.projectId, projectId)).orderBy(desc(deliverables.createdAt)),
    db.select().from(projectFeedback).where(eq(projectFeedback.projectId, projectId)).orderBy(desc(projectFeedback.createdAt)),
  ]);
  return { project: project[0], milestones, files, feedback };
}

export async function approveProjectMilestone(userId: number, projectId: number, milestoneId: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const project = await db.select({ id: clientProjects.id }).from(clientProjects).where(and(eq(clientProjects.id, projectId), eq(clientProjects.userId, userId))).limit(1);
  if (!project[0]) throw new Error("No tienes acceso a este proyecto.");
  await db.update(projectMilestones).set({ status: "approved" }).where(and(eq(projectMilestones.id, milestoneId), eq(projectMilestones.projectId, projectId)));
  return getClientProjectWorkspace(userId, projectId);
}

export async function getAutomationControl() {
  const db = await getDb();
  if (!db) return { globalPaused: false, manualApproval: true };
  const result = await db.select().from(automationControls).where(eq(automationControls.id, 1)).limit(1);
  return result[0] ?? { globalPaused: false, manualApproval: true };
}

export async function updateAutomationControl(userId: number, globalPaused: boolean, manualApproval: boolean) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  await db.insert(automationControls).values({ id: 1, globalPaused, manualApproval, updatedById: userId }).onDuplicateKeyUpdate({
    set: { globalPaused, manualApproval, updatedById: userId },
  });
  return getAutomationControl();
}

export async function createAutomationAudit(input: {
  action: string;
  status: "ready" | "paused" | "blocked" | "awaiting_approval" | "executed";
  risk: "low" | "medium" | "high";
  detail: string;
  ownerId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.insert(automationAuditEvents).values(input);
}

export async function getOwnerOverview() {
  const db = await getDb();
  if (!db) return { leads: 0, briefs: 0, projects: 0, auditEvents: [] };
  const [leadRows, briefRows, projectRows, auditEvents] = await Promise.all([
    db.select({ id: leads.id }).from(leads),
    db.select({ id: projectBriefs.id }).from(projectBriefs),
    db.select({ id: clientProjects.id }).from(clientProjects),
    db.select().from(automationAuditEvents).orderBy(desc(automationAuditEvents.createdAt)).limit(8),
  ]);
  return { leads: leadRows.length, briefs: briefRows.length, projects: projectRows.length, auditEvents };
}

export async function getCrmLeads() {
  const db = await getDb();
  if (!db) return [];
  const [leadRows, notes] = await Promise.all([
    db.select().from(leads).orderBy(desc(leads.createdAt)).limit(100),
    db.select().from(leadNotes).orderBy(desc(leadNotes.createdAt)).limit(300),
  ]);
  return leadRows.map((lead) => ({ ...lead, notes: notes.filter((note) => note.leadId === lead.id) }));
}

export async function updateCrmLeadStatus(userId: number, leadId: number, status: "new" | "qualified" | "active" | "closed") {
  const db = await getDb();
  if (!db) throw new Error("A base de dados não está disponível.");
  await db.update(leads).set({ status }).where(eq(leads.id, leadId));
  await createAutomationAudit({ action: "crm_lead_status_updated", status: "executed", risk: "low", detail: `Lead ${leadId} atualizado para ${status}.`, ownerId: userId });
  return getCrmLeads();
}

export async function createCrmLeadNote(userId: number, leadId: number, note: string) {
  const db = await getDb();
  if (!db) throw new Error("A base de dados não está disponível.");
  const lead = await db.select({ id: leads.id }).from(leads).where(eq(leads.id, leadId)).limit(1);
  if (!lead[0]) throw new Error("Lead não encontrado.");
  await db.insert(leadNotes).values({ leadId, authorId: userId, note });
  await createAutomationAudit({ action: "crm_lead_note_created", status: "executed", risk: "low", detail: `Nota interna criada no lead ${leadId}.`, ownerId: userId });
  return getCrmLeads();
}

export async function createPrivacyRequest(input: {
  email: string;
  requestType: "access" | "deletion" | "consent_withdrawal";
  privacyRegion: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("A base de dados não está disponível.");
  return db.insert(privacyRequests).values(input);
}

export async function getPrivacyRequests() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(privacyRequests).orderBy(desc(privacyRequests.updatedAt)).limit(50);
}

export async function processLeadPrivacyRequest(userId: number, input: {
  requestId: number;
  identityVerified: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("A base de dados não está disponível.");
  const request = await db.select().from(privacyRequests).where(eq(privacyRequests.id, input.requestId)).limit(1);
  if (!request[0]) throw new Error("Solicitação de privacidade não encontrada.");
  if (!input.identityVerified) {
    await db.update(privacyRequests).set({ status: "identity_verification" }).where(eq(privacyRequests.id, input.requestId));
    return { status: "identity_verification" as const, exportData: undefined };
  }
  const leadRecords = await db.select().from(leads).where(eq(leads.email, request[0].email));
  const consentHistory = await db.select().from(consentRecords).where(eq(consentRecords.email, request[0].email));
  if (request[0].requestType === "consent_withdrawal") {
    await db.update(consentRecords).set({ granted: false }).where(eq(consentRecords.email, request[0].email));
  }
  if (request[0].requestType === "deletion") {
    await db.delete(leads).where(eq(leads.email, request[0].email));
    await db.delete(consentRecords).where(eq(consentRecords.email, request[0].email));
  }
  await db.update(privacyRequests).set({ status: "completed" }).where(eq(privacyRequests.id, input.requestId));
  await createAutomationAudit({
    action: `privacy_${request[0].requestType}_processed`,
    status: "executed",
    risk: "high",
    detail: `Solicitação ${input.requestId} processada após confirmação manual de identidade.`,
    ownerId: userId,
  });
  return {
    status: "completed" as const,
    exportData: request[0].requestType === "access" ? { email: request[0].email, leads: leadRecords, consentHistory } : undefined,
  };
}

export async function getPublicCatalogProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.availability, "active")).orderBy(desc(products.updatedAt));
}

export async function getOwnerOperations() {
  const db = await getDb();
  if (!db) return { tasks: [], products: 0, assets: 0, paidOrders: 0, paidRevenueCents: 0, events: 0 };
  const [tasks, productRows, assetRows, orderRows, eventRows] = await Promise.all([
    db.select().from(operationTasks).orderBy(desc(operationTasks.updatedAt)).limit(12),
    db.select({ id: products.id }).from(products),
    db.select({ id: digitalAssets.id }).from(digitalAssets),
    db.select().from(commerceOrders),
    db.select({ id: commercialEvents.id }).from(commercialEvents),
  ]);
  const paidOrders = orderRows.filter((order) => order.status === "paid");
  return {
    tasks,
    products: productRows.length,
    assets: assetRows.length,
    paidOrders: paidOrders.length,
    paidRevenueCents: paidOrders.reduce((total, order) => total + order.amountCents, 0),
    events: eventRows.length,
  };
}

export async function createOperationTask(userId: number, input: {
  taskType: string;
  priority: "low" | "normal" | "high" | "critical";
  source: string;
  requiresApproval: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("A base de dados não está disponível.");
  const status = input.requiresApproval ? "awaiting_approval" : "pending" as const;
  const result = await db.insert(operationTasks).values({ ...input, status, maxAttempts: 1 });
  await createAutomationAudit({
    action: "operation_task_created",
    status: input.requiresApproval ? "awaiting_approval" : "ready",
    risk: input.priority === "critical" || input.priority === "high" ? "high" : "low",
    detail: `Tarefa ${input.taskType} criada com estado ${status}.`,
    ownerId: userId,
  });
  return result;
}

export async function getRevenueScenarioSettings() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(revenueScenarioSettings).where(eq(revenueScenarioSettings.id, 1)).limit(1);
  return result[0];
}

export async function updateRevenueScenarioSettings(userId: number, input: {
  qualifiedVisits?: number;
  conversionBasisPoints?: number;
  averageTicketCents?: number;
  variableCostBasisPoints?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("A base de dados não está disponível.");
  await db.insert(revenueScenarioSettings).values({ id: 1, ...input, updatedById: userId }).onDuplicateKeyUpdate({ set: { ...input, updatedById: userId } });
  return getRevenueScenarioSettings();
}

export type RevenueScenarioInput = {
  qualifiedVisits: number | null;
  conversionBasisPoints: number | null;
  averageTicketCents: number | null;
  variableCostBasisPoints: number | null;
};

export function buildRevenueScenarios(settings: RevenueScenarioInput | undefined) {
  if (!settings || settings.qualifiedVisits === null || settings.conversionBasisPoints === null || settings.averageTicketCents === null || settings.variableCostBasisPoints === null) {
    return { dataReady: false as const, message: "Dados insuficientes. Informe métricas observadas e o período de referência." };
  }
  const qualifiedVisits = settings.qualifiedVisits;
  const conversionBasisPoints = settings.conversionBasisPoints;
  const averageTicketCents = settings.averageTicketCents;
  const variableCostBasisPoints = settings.variableCostBasisPoints;
  const calculate = (visitFactor: number, conversionFactor: number, ticketFactor: number) => {
    const gross = Math.round(qualifiedVisits * visitFactor * (conversionBasisPoints / 10000) * conversionFactor * averageTicketCents * ticketFactor);
    const variableCosts = Math.round(gross * (variableCostBasisPoints / 10000));
    return { grossCents: gross, variableCostsCents: variableCosts, contributionCents: gross - variableCosts };
  };
  return {
    dataReady: true as const,
    message: "Cenários de sensibilidade baseados em premissas informadas pelo proprietário; não constituem previsão ou garantia.",
    scenarios: { conservative: calculate(0.8, 0.8, 0.9), base: calculate(1, 1, 1), expansion: calculate(1.2, 1.15, 1.1) },
  };
}

export async function getClientLicenses(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const licenses = await db.select().from(issuedLicenses).where(eq(issuedLicenses.userId, userId)).orderBy(desc(issuedLicenses.createdAt));
  if (!licenses.length) return [];
  const [productRows, assignments, assetRows] = await Promise.all([db.select().from(products), db.select().from(productAssets), db.select().from(digitalAssets)]);
  return licenses.map((license) => ({
    ...license,
    product: productRows.find((product) => product.id === license.productId),
    assets: assignments
      .filter((assignment) => assignment.productId === license.productId && assignment.role === "licensed_file")
      .map((assignment) => assetRows.find((asset) => asset.id === assignment.assetId))
      .filter((asset): asset is NonNullable<typeof asset> => Boolean(asset)),
  }));
}

export async function getLicensedAssetUrl(userId: number, licenseId: number, assetId: number) {
  const db = await getDb();
  if (!db) throw new Error("A base de dados não está disponível.");
  const license = await db.select().from(issuedLicenses).where(and(eq(issuedLicenses.id, licenseId), eq(issuedLicenses.userId, userId), eq(issuedLicenses.status, "active"))).limit(1);
  if (!license[0]) throw new Error("Licença ativa não encontrada para este usuário.");
  const assignment = await db.select().from(productAssets).where(and(eq(productAssets.productId, license[0].productId), eq(productAssets.assetId, assetId), eq(productAssets.role, "licensed_file"))).limit(1);
  if (!assignment[0]) throw new Error("Ativo não autorizado por esta licença.");
  const asset = await db.select().from(digitalAssets).where(and(eq(digitalAssets.id, assetId), eq(digitalAssets.accessLevel, "licensed"), eq(digitalAssets.status, "active"))).limit(1);
  if (!asset[0]) throw new Error("Ativo licenciado indisponível.");
  return { url: await storageGetSignedUrl(asset[0].storageKey), label: asset[0].label };
}

export async function getOwnerAssets() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(digitalAssets).orderBy(desc(digitalAssets.updatedAt)).limit(100);
}

export async function createOwnerAsset(userId: number, input: {
  label: string;
  category: "audio" | "image" | "video" | "preset" | "document" | "project_file" | "other";
  filename: string;
  mimeType: string;
  base64: string;
  accessLevel: "private" | "client" | "licensed" | "public";
}) {
  const db = await getDb();
  if (!db) throw new Error("A base de dados não está disponível.");
  const data = Buffer.from(input.base64, "base64");
  if (!data.length || data.length > 8 * 1024 * 1024) throw new Error("O ativo deve ter até 8 MB nesta interface.");
  const safeName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const { key } = await storagePut(`duck-assets/${userId}/${Date.now()}_${safeName}`, data, input.mimeType);
  const result = await db.insert(digitalAssets).values({
    ownerId: userId,
    label: input.label,
    category: input.category,
    storageKey: key,
    mimeType: input.mimeType,
    sizeBytes: data.length,
    contentHash: createHash("sha256").update(data).digest("hex"),
    accessLevel: input.accessLevel,
    status: "active",
  });
  await createAutomationAudit({ action: "digital_asset_uploaded", status: "executed", risk: "medium", detail: `Ativo ${input.label} enviado com acesso ${input.accessLevel}.`, ownerId: userId });
  return result;
}

export async function getOwnerCatalog() {
  const db = await getDb();
  if (!db) return { products: [], licenses: [], assets: [] };
  const [productRows, licenses, assets] = await Promise.all([
    db.select().from(products).orderBy(desc(products.updatedAt)),
    db.select().from(licenseTemplates).orderBy(desc(licenseTemplates.updatedAt)),
    db.select().from(digitalAssets).orderBy(desc(digitalAssets.updatedAt)),
  ]);
  return { products: productRows, licenses, assets };
}

export async function createLicenseTemplate(userId: number, input: { name: string; version: string; termsText: string }) {
  const db = await getDb();
  if (!db) throw new Error("A base de dados não está disponível.");
  const result = await db.insert(licenseTemplates).values({ ...input, status: "draft" });
  await createAutomationAudit({ action: "license_template_created", status: "executed", risk: "medium", detail: `Modelo de licença ${input.name} ${input.version} criado como rascunho.`, ownerId: userId });
  return result;
}

export async function createCatalogProduct(userId: number, input: {
  name: string;
  description?: string;
  category: "beat" | "license" | "production" | "service" | "preset" | "digital_file" | "package";
  priceCents?: number;
  licenseTemplateId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("A base de dados não está disponível.");
  const baseSlug = input.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "produto";
  const slug = `${baseSlug}-${Date.now()}`;
  const result = await db.insert(products).values({ ...input, slug, availability: "draft" });
  await createAutomationAudit({ action: "catalog_product_created", status: "executed", risk: "medium", detail: `Produto ${input.name} criado como rascunho.`, ownerId: userId });
  return result;
}

export async function assignCatalogAsset(userId: number, input: { productId: number; assetId: number; role: "preview" | "cover" | "licensed_file" | "documentation" }) {
  const db = await getDb();
  if (!db) throw new Error("A base de dados não está disponível.");
  const [product, asset] = await Promise.all([
    db.select({ id: products.id }).from(products).where(eq(products.id, input.productId)).limit(1),
    db.select({ id: digitalAssets.id }).from(digitalAssets).where(eq(digitalAssets.id, input.assetId)).limit(1),
  ]);
  if (!product[0] || !asset[0]) throw new Error("Produto ou ativo não encontrado.");
  const result = await db.insert(productAssets).values(input);
  await createAutomationAudit({ action: "catalog_asset_assigned", status: "executed", risk: "medium", detail: `Ativo ${input.assetId} associado ao produto ${input.productId} como ${input.role}.`, ownerId: userId });
  return result;
}
