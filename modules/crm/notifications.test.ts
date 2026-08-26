import { describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  addProjectComment: vi.fn(async () => ({ ok: true })),
  approveDelivery: vi.fn(async () => ({ ok: true })),
  updateSaleStatus: vi.fn(async () => ({ ok: true })),
  createStudioNotification: vi.fn(async (input) => input),
  listStudioNotifications: vi.fn(async () => [{ id: 1, userId: 7, kind: "comment", message: "Novo comentário" }]),
  canAccessDelivery: vi.fn(async () => true),
  canAccessProject: vi.fn(async () => true),
}));
vi.mock("./db", () => ({ ...dbMocks, addProjectComment: dbMocks.addProjectComment, approveDelivery: dbMocks.approveDelivery, updateSaleStatus: dbMocks.updateSaleStatus, createStudioNotification: dbMocks.createStudioNotification, listStudioNotifications: dbMocks.listStudioNotifications, canAccessDelivery: dbMocks.canAccessDelivery, canAccessProject: dbMocks.canAccessProject }));

const { appRouter } = await import("./routers");

describe("studio notifications", () => {
  const ctx = { user: { id: 7, role: "admin" }, req: {}, res: {} } as any;
  it("emits notifications for approval, comment, and finance mutations", async () => {
    const caller = appRouter.createCaller(ctx);
    await caller.studio.approveDelivery({ deliveryId: 9 });
    await caller.studio.comment({ deliveryId: 9, body: "Ajustar respiração", timestampMs: 84000 });
    await caller.studio.updateSaleStatus({ id: 12, status: "paid" });
    expect(dbMocks.createStudioNotification).toHaveBeenCalledTimes(3);
    expect(dbMocks.createStudioNotification).toHaveBeenCalledWith(expect.objectContaining({ userId: 7, kind: "comment" }));
    expect(dbMocks.createStudioNotification).toHaveBeenCalledWith(expect.objectContaining({ userId: 7, kind: "finance" }));
  });
  it("reads notifications scoped to the authenticated user", async () => {
    const caller = appRouter.createCaller(ctx);
    const rows = await caller.studio.notifications();
    expect(rows[0]?.userId).toBe(7);
    expect(dbMocks.listStudioNotifications).toHaveBeenCalledWith(7);
  });
});
