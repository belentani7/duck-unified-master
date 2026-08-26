import { TRPCError } from "@trpc/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("../storage", () => ({
  storageGet: vi.fn(async () => ({ key: "stems/project_1/kick.wav", url: "/manus-storage/stems/project_1/kick.wav" })),
  storageGetSignedUrl: vi.fn(async () => "https://signed.example/stems/project_1/kick.wav"),
}));

import { requireOwnedProject, writeStudioAudit } from "./access";
import { getPluginCatalog } from "./catalog";
import { createColabReply } from "./colab";
import { attachPrivateStemLinks, sanitizeStemName } from "./stemStorage";

function createAccessDb(ownerOpenId: string) {
  const auditValues = vi.fn(async () => undefined);
  const query: any = {
    from: () => query,
    where: () => query,
    limit: async () => [{ id: 1, ownerOpenId }],
  };
  return {
    database: {
      select: () => query,
      insert: () => ({ values: auditValues }),
    } as any,
    auditValues,
  };
}

describe("Duck Studio extracted services", () => {
  it("returns a 400-item catalog and distinguishes verified references", () => {
    const catalog = getPluginCatalog();
    expect(catalog).toHaveLength(400);
    expect(catalog[0]).toMatchObject({ name: "butterDAWg (FL Studio 20 Clone)", verifiedSource: true });
    expect(catalog.find(plugin => plugin.name === "Serum (Xfer Records)")).toMatchObject({ verifiedSource: false, url: null });
  });

  it("keeps CoLab replies local and transparent in supported languages", () => {
    const portugueseReply = createColabReply({ message: "Como faço upload de um stem?", language: "pt" });
    const englishReply = createColabReply({ message: "Help me with trap 808", language: "en" });
    expect(portugueseReply).toMatchObject({ mode: "local-rule-based", duckStatus: "online", activePlugins: 400 });
    expect(portugueseReply.reply).toContain("crie ou selecione um projeto");
    expect(englishReply.reply).toContain("Compare subgrave");
  });

  it("validates ownership and records an audit action through the access service", async () => {
    const { database, auditValues } = createAccessDb("owner-1");
    await expect(requireOwnedProject(database, 1, "owner-1")).resolves.toMatchObject({ id: 1, ownerOpenId: "owner-1" });
    await expect(requireOwnedProject(database, 1, "owner-2")).rejects.toBeInstanceOf(TRPCError);
    await writeStudioAudit(database, "owner-1", "PROJECT_CREATED", "Projeto criado.");
    expect(auditValues).toHaveBeenCalledWith({ ownerOpenId: "owner-1", action: "PROJECT_CREATED", details: "Projeto criado." });
  });

  it("sanitizes storage names and strips internal file keys from client responses", async () => {
    const safeName = sanitizeStemName("Kick & 808 / versão final.wav");
    const linkedStem = await attachPrivateStemLinks({
      id: 1,
      projectId: 1,
      stemName: "Kick & 808.wav",
      fileKey: "stems/project_1/kick.wav",
      fileUrl: "internal://object",
      fileSize: 2048,
      status: "enviado",
      reviewNote: null,
      reviewedAt: null,
      reviewedBy: null,
      createdAt: new Date(),
    } as any);
    expect(safeName).toBe("Kick_808_versao_final.wav");
    expect(linkedStem).toMatchObject({ fileUrl: "/manus-storage/stems/project_1/kick.wav", downloadUrl: "https://signed.example/stems/project_1/kick.wav" });
    expect(linkedStem).not.toHaveProperty("fileKey");
  });
});
