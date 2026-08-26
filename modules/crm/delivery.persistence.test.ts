import { describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  canAccessProject: vi.fn(async () => true),
  canAccessDelivery: vi.fn(async () => true),
  createDelivery: vi.fn(async (input) => ({ insertId: 41, input })),
  addProjectComment: vi.fn(async (input) => ({ insertId: 42, input })),
  approveDelivery: vi.fn(async (id, actorId) => ({ id, actorId, status: "approved" })),
  createStudioNotification: vi.fn(async (input) => input),
}));
vi.mock("./db", () => ({ ...dbMocks }));
const { appRouter } = await import("./routers");
const ctx = { user: { id: 9, role: "collaborator" }, req: {}, res: {} } as any;

describe("persistência do fluxo de entregas", () => {
  it("cria versão com arquivo, persiste comentário timestamp e aprova a mesma versão", async () => {
    const caller = appRouter.createCaller(ctx);
    await caller.studio.createDelivery({ projectId: 7, version: "V03", fileName: "mix-v03.wav", fileUrl: "/local/mix-v03.wav" });
    await caller.studio.comment({ deliveryId: 41, body: "Respirar antes do refrão", timestampMs: 84000 });
    await caller.studio.approveDelivery({ deliveryId: 41 });
    expect(dbMocks.createDelivery).toHaveBeenCalledWith({ projectId: 7, version: "V03", fileName: "mix-v03.wav", fileUrl: "/local/mix-v03.wav", status: "review" }, 9);
    expect(dbMocks.addProjectComment).toHaveBeenCalledWith({ deliveryId: 41, authorId: 9, body: "Respirar antes do refrão", timestampMs: 84000 });
    expect(dbMocks.approveDelivery).toHaveBeenCalledWith(41, 9);
  });
});
