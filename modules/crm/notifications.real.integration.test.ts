import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { clients, contracts, deliveries, instrumentals, licenseOffers, projectActivities, projects, referrals, sales, studioNotifications, users } from "../drizzle/schema";

const { appRouter } = await import("./routers");
const realDbEnabled = process.env.RUN_REAL_DB_TESTS === "1" && Boolean(process.env.DATABASE_URL);

describe.skipIf(!realDbEnabled)("studio notifications com banco real", () => {
  it("persiste eventos de aprovação, comentário e finanças e lê por userId", async () => {
    const db = await getDb();
    if (!db) throw new Error("DATABASE_URL indisponível");
    const token = `real-${Date.now()}`;
    let userId = 0; let clientId = 0; let projectId = 0; let deliveryId = 0; let instrumentalId = 0; let offerId = 0; let saleId = 0; let contractId = 0; const referralCode = `REAL-${Date.now()}`;
    try {
      await db.insert(users).values({ openId: token, name: "Teste temporário", role: "admin", lastSignedIn: new Date() });
      userId = Number((await db.select().from(users).where(eq(users.openId, token)))[0]?.id || 0);
      await db.insert(clients).values({ ownerId: userId, userId, name: "Cliente temporário", role: "viewer" });
      clientId = Number((await db.select().from(clients).where(eq(clients.userId, userId)))[0]?.id || 0);
      await db.insert(projects).values({ ownerId: userId, clientId, name: "Projeto temporário" });
      projectId = Number((await db.select().from(projects).where(eq(projects.clientId, clientId)))[0]?.id || 0);
      await db.insert(deliveries).values({ projectId, version: "V99", fileName: "integration.wav", status: "review" });
      deliveryId = Number((await db.select().from(deliveries).where(eq(deliveries.projectId, projectId)))[0]?.id || 0);
      await db.insert(instrumentals).values({ ownerId: userId, name: "Beat temporário", status: "available" });
      instrumentalId = Number((await db.select().from(instrumentals).where(eq(instrumentals.ownerId, userId)))[0]?.id || 0);
      await db.insert(licenseOffers).values({ instrumentalId, kind: "lease", priceCents: 1000, split: "Duck 60% · artista 40%" });
      offerId = Number((await db.select().from(licenseOffers).where(eq(licenseOffers.instrumentalId, instrumentalId)))[0]?.id || 0);
      await db.insert(referrals).values({ code: referralCode, discountPercent: 10, active: 1 });
      const caller = appRouter.createCaller({ user: { id: userId, role: "admin" }, req: {}, res: {} } as any);
      await caller.studio.comment({ deliveryId, body: "Comentário real", timestampMs: 84000 });
      await caller.studio.approveDelivery({ deliveryId });
      const sale = await caller.studio.createSale({ clientId, licenseOfferId: offerId, referralCode });
      saleId = Number((await db.select().from(sales).where(eq(sales.clientId, clientId)))[0]?.id || 0);
      expect(sale.amountCents).toBe(900);
      const contract = await caller.studio.createContractDraft({ saleId });
      contractId = Number((await db.select().from(contracts).where(eq(contracts.saleId, saleId)))[0]?.id || 0);
      expect(contractId).toBeGreaterThan(0);
      await caller.studio.updateSaleStatus({ id: saleId, status: "paid" });
      const notifications = await caller.studio.notifications();
      expect(notifications.filter((item) => item.userId === userId).map((item) => item.kind)).toEqual(expect.arrayContaining(["comment", "delivery", "finance"]));
    } finally {
      if (userId) await db.delete(studioNotifications).where(eq(studioNotifications.userId, userId));
      if (userId) await db.delete(projectActivities).where(eq(projectActivities.actorId, userId));
      if (contractId) await db.delete(contracts).where(eq(contracts.id, contractId));
      if (saleId) await db.delete(sales).where(eq(sales.id, saleId));
      await db.delete(referrals).where(eq(referrals.code, referralCode));
      if (offerId) await db.delete(licenseOffers).where(eq(licenseOffers.id, offerId));
      if (instrumentalId) await db.delete(instrumentals).where(eq(instrumentals.id, instrumentalId));
      if (deliveryId) await db.delete(deliveries).where(eq(deliveries.id, deliveryId));
      if (projectId) await db.delete(projects).where(eq(projects.id, projectId));
      if (clientId) await db.delete(clients).where(eq(clients.id, clientId));
      if (userId) await db.delete(users).where(eq(users.id, userId));
      if (!userId) await db.delete(users).where(eq(users.openId, token));
    }
  });
});
