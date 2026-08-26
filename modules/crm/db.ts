import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, clients, projects, deliveries, projectComments, projectActivities, instrumentals, licenseOffers, sales, referrals, contracts, studioNotifications, studioTasks } from "../drizzle/schema";
import { ENV } from './_core/env';

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

export async function listClients(ownerId: number) { const db = await getDb(); if (!db) return []; return db.select().from(clients).where(eq(clients.ownerId, ownerId)); }
export async function listClientHistory(ownerId: number) { const db = await getDb(); if (!db) return []; const clientRows = await db.select().from(clients).where(eq(clients.ownerId, ownerId)); const ids = clientRows.map((client) => client.id); const projectRows = ids.length ? await db.select().from(projects) : []; const clientProjects = projectRows.filter((project) => project.clientId && ids.includes(project.clientId)); const activities = await db.select().from(projectActivities); return clientRows.map((client) => ({ client, projects: clientProjects.filter((project) => project.clientId === client.id).map((project) => ({ ...project, activities: activities.filter((activity) => activity.projectId === project.id) })) })); }
export async function createClient(input: typeof clients.$inferInsert) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); return db.insert(clients).values(input); }
export async function listProjects(ownerId: number) { const db = await getDb(); if (!db) return []; return db.select().from(projects).where(eq(projects.ownerId, ownerId)); }
export async function createProject(input: typeof projects.$inferInsert) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const result = await db.insert(projects).values(input); const projectId = Number((result as any).insertId || 0); if (projectId) await db.insert(projectActivities).values({ projectId, actorId: input.ownerId, action: "Projeto criado" }); return result; }
export async function listDeliveries(projectId: number) { const db = await getDb(); if (!db) return []; return db.select().from(deliveries).where(eq(deliveries.projectId, projectId)); }
export async function listAllDeliveries(ownerId: number) { const db = await getDb(); if (!db) return []; const ownedProjects = await db.select().from(projects).where(eq(projects.ownerId, ownerId)); const ids = ownedProjects.map((project) => project.id); const rows = await db.select().from(deliveries); return rows.filter((delivery) => ids.includes(delivery.projectId)).map((delivery) => ({ ...delivery, projectName: ownedProjects.find((project) => project.id === delivery.projectId)?.name || `Projeto #${delivery.projectId}` })); }
export async function createDelivery(input: typeof deliveries.$inferInsert, actorId = input.projectId) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const result = await db.insert(deliveries).values(input); const deliveryId = Number((result as any).insertId || 0); if (deliveryId) await db.insert(projectActivities).values({ projectId: input.projectId, actorId, action: `Entrega ${input.version} criada` }); return result; }
export async function approveDelivery(deliveryId: number, actorId = 0) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const found = await db.select().from(deliveries).where(eq(deliveries.id, deliveryId)); const result = await db.update(deliveries).set({ status: "approved" }).where(eq(deliveries.id, deliveryId)); if (found[0]) await db.insert(projectActivities).values({ projectId: found[0].projectId, actorId, action: `Entrega ${found[0].version} aprovada` }); return result; }
export async function addProjectComment(input: typeof projectComments.$inferInsert) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const result = await db.insert(projectComments).values(input); const deliveriesFound = await db.select().from(deliveries).where(eq(deliveries.id, input.deliveryId)); const projectId = deliveriesFound[0]?.projectId; if (projectId) await db.insert(projectActivities).values({ projectId, actorId: input.authorId, action: "Novo comentário na entrega" }); return result; }
export async function addProjectActivity(input: typeof projectActivities.$inferInsert) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); return db.insert(projectActivities).values(input); }
export async function listProjectActivities(projectId?: number) { const db = await getDb(); if (!db) return []; const rows = await db.select().from(projectActivities); return projectId ? rows.filter((item) => item.projectId === projectId) : rows; }
export async function getClientPortalData(userId: number) { const db = await getDb(); if (!db) return { client: undefined, projects: [], deliveries: [] }; const clientRows = await db.select().from(clients).where(eq(clients.userId, userId)); const client = clientRows[0]; if (!client || client.role !== "viewer" || client.status !== "active") return { client: undefined, projects: [], deliveries: [] }; const projectRows = await db.select().from(projects).where(eq(projects.clientId, client.id)); const projectIds = projectRows.map((item) => item.id); const deliveryRows = projectIds.length ? (await db.select().from(deliveries)).filter((item) => projectIds.includes(item.projectId)) : []; return { client: { id: client.id, name: client.name, role: client.role, status: client.status }, projects: projectRows.map((item) => ({ id: item.id, name: item.name, phase: item.phase, status: item.status, progress: item.progress })), deliveries: deliveryRows.map((item) => ({ id: item.id, projectId: item.projectId, version: item.version, status: item.status })) }; }
export async function canAccessProject(userId: number, role: string, projectId: number) { const db = await getDb(); if (!db) return false; if (role === "admin") return true; const rows = await db.select().from(projects).where(eq(projects.id, projectId)); const project = rows[0]; if (!project) return false; if (project.ownerId === userId) return true; if (role === "viewer") { const linked = await db.select().from(clients).where(eq(clients.userId, userId)); return linked.some((client) => client.id === project.clientId && client.role === "viewer" && client.status === "active"); } return false; }
export async function canAccessDelivery(userId: number, role: string, deliveryId: number) { const db = await getDb(); if (!db) return false; const rows = await db.select().from(deliveries).where(eq(deliveries.id, deliveryId)); const delivery = rows[0]; return delivery ? canAccessProject(userId, role, delivery.projectId) : false; }
export async function listInstrumentals(ownerId: number) { const db = await getDb(); if (!db) return []; return db.select().from(instrumentals).where(eq(instrumentals.ownerId, ownerId)); }
export async function listLicenseOffers() { const db = await getDb(); if (!db) return []; return db.select().from(licenseOffers); }
export async function listActiveReferrals() { const db = await getDb(); if (!db) return []; return db.select().from(referrals).where(eq(referrals.active, 1)); }
export async function createSale(input: { clientId: number; licenseOfferId: number; referralCode?: string }) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const offers = await db.select().from(licenseOffers).where(eq(licenseOffers.id, input.licenseOfferId)); const offer = offers[0]; if (!offer) throw new Error("Licença não encontrada"); const refs = input.referralCode ? await db.select().from(referrals).where(eq(referrals.code, input.referralCode)) : []; const discount = refs[0]?.active ? refs[0].discountPercent : 0; const amountCents = Math.round(offer.priceCents * (100 - discount) / 100); await db.insert(sales).values({ clientId: input.clientId, licenseOfferId: input.licenseOfferId, referralCode: input.referralCode, amountCents, status: "pending" }); return { amountCents, discountPercent: discount }; }
export async function createContractDraft(saleId: number) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); return db.insert(contracts).values({ saleId, status: "draft" }); }
export async function listSales() { const db = await getDb(); if (!db) return []; return db.select().from(sales); }
export async function updateSaleStatus(id: number, status: "pending" | "paid" | "refunded", actorId = 0) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const result = await db.update(sales).set({ status }).where(eq(sales.id, id)); await db.insert(projectActivities).values({ projectId: 0, actorId, action: `Pagamento #${id} alterado para ${status}` }); return result; }
export async function createStudioNotification(input: typeof studioNotifications.$inferInsert) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); return db.insert(studioNotifications).values(input); }
export async function listStudioNotifications(userId: number) { const db = await getDb(); if (!db) return []; return db.select().from(studioNotifications).where(eq(studioNotifications.userId, userId)); }
export async function listStudioTasks(ownerId: number) { const db = await getDb(); if (!db) return []; return db.select().from(studioTasks).where(eq(studioTasks.ownerId, ownerId)); }
export async function createStudioTask(input: typeof studioTasks.$inferInsert) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); return db.insert(studioTasks).values(input); }
export async function updateStudioTask(id: number, ownerId: number, status: "pending" | "in_progress" | "completed" | "canceled") { const db = await getDb(); if (!db) throw new Error("Database unavailable"); return db.update(studioTasks).set({ status }).where(and(eq(studioTasks.id, id), eq(studioTasks.ownerId, ownerId))); }

