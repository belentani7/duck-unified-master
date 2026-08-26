import { beforeEach, describe, expect, it, vi } from "vitest";
import { duckAuditLogs, duckComments, duckProjects, duckStems } from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";

const state = {
  projects: [{ id: 1, ownerOpenId: "duck-test", name: "Projeto base", artist: "Artista teste", bpm: 140, key: "C# Minor", genre: "Trap", status: "Mixagem", progress: 40, audioUrl: null, createdAt: new Date(), updatedAt: new Date() }],
  stems: [] as any[],
  comments: [] as any[],
  audits: [] as any[],
};

function rowsFor(table: unknown) {
  if (table === duckProjects) return state.projects;
  if (table === duckStems) return state.stems;
  if (table === duckComments) return state.comments;
  if (table === duckAuditLogs) return state.audits;
  return [];
}

function createQuery() {
  let rows: any[] = [];
  const query: any = {
    from(table: unknown) {
      rows = rowsFor(table);
      return query;
    },
    where() {
      return query;
    },
    orderBy() {
      rows = [...rows].reverse();
      return query;
    },
    limit(limit: number) {
      return Promise.resolve(rows.slice(-limit));
    },
    then(resolve: (value: any[]) => unknown, reject?: (reason: unknown) => unknown) {
      return Promise.resolve(rows).then(resolve, reject);
    },
  };
  return query;
}

const fakeDb: any = {
  select: () => createQuery(),
  insert: (table: unknown) => ({
    values: async (value: any) => {
      const values = Array.isArray(value) ? value : [value];
      const target = rowsFor(table);
      for (const entry of values) {
        target.push({ ...entry, id: target.length + 1, createdAt: new Date(), updatedAt: new Date() });
      }
      return [{ insertId: target.length }, []];
    },
  }),
  update: (table: unknown) => ({
    set: (changes: any) => ({
      where: async () => {
        const target = rowsFor(table);
        if (target[0]) Object.assign(target[0], changes);
      },
    }),
  }),
};

vi.mock("./db", () => ({ getDb: vi.fn(async () => fakeDb) }));
vi.mock("./storage", () => ({
  storagePut: vi.fn(async () => ({ key: "stems/project_1/kick.wav_hash", url: "/manus-storage/stems/project_1/kick.wav_hash" })),
  storageGet: vi.fn(async (key: string) => ({ key, url: `/manus-storage/${key}` })),
  storageGetSignedUrl: vi.fn(async (key: string) => `https://signed.example/${encodeURIComponent(key)}`),
}));

const { appRouter } = await import("./routers");

function createTestContext(): TrpcContext {
  return {
    user: { id: 1, openId: "duck-test", email: "duck-test@example.com", name: "Duck Test", loginMethod: "test", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

describe("Duck Studio persistent workflow", () => {
  beforeEach(() => {
    state.projects.splice(1);
    state.projects[0].ownerOpenId = "duck-test";
    state.stems.splice(0);
    state.comments.splice(0);
    state.audits.splice(0);
  });

  it("creates a project, uploads a stem, comments and approves it", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const project = await caller.duckStudio.createProject({ name: "Trap Aracaju", artist: "Kvyn MC", bpm: 140, key: "C# Minor", genre: "Trap" });
    expect(project.success).toBe(true);
    expect(project.project.name).toBe("Trap Aracaju");

    const uploaded = await caller.duckStudio.uploadStem({ projectId: project.project.id, stemName: "kick.wav", base64Data: "data:audio/wav;base64,AAEC", mimeType: "audio/wav" });
    expect(uploaded.stem.status).toBe("enviado");
    expect(uploaded.stem.downloadUrl).toContain("signed.example");

    const comment = await caller.duckStudio.addComment({ projectId: project.project.id, authorName: "Kvyn MC", content: "Rever a entrada do vocal", timestampSeconds: 45.5 });
    expect(comment.comment.timestampSeconds).toBe(45.5);

    const approved = await caller.duckStudio.updateStemStatus({ stemId: uploaded.stem.id, status: "aprovado" });
    expect(approved.stem.status).toBe("aprovado");
  });

  it("rejects an unsupported stem format before storage", async () => {
    const caller = appRouter.createCaller(createTestContext());
    await expect(caller.duckStudio.uploadStem({ projectId: 1, stemName: "script.exe", base64Data: "AAEC", mimeType: "application/x-msdownload" })).rejects.toThrow("áudio WAV");
  });

  it("does not expose a project or stem to another owner", async () => {
    const otherContext = createTestContext();
    otherContext.user = { ...otherContext.user, openId: "other-owner" };
    const otherCaller = appRouter.createCaller(otherContext);
    await expect(otherCaller.duckStudio.getStems({ projectId: 1 })).rejects.toThrow("não encontrado para este utilizador");
  });

  it("declares the local CoLab mode honestly", async () => {
    const caller = appRouter.createCaller(createTestContext());
    const result = await caller.duckStudio.aiChat({ message: "O que você consegue fazer?", language: "pt" });
    expect(result.mode).toBe("local-rule-based");
    expect(result.reply).toContain("não sou um modelo treinado");
  });
});
