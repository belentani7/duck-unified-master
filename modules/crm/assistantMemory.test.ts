import { describe, expect, it } from "vitest";
import { loadAssistantMemories, saveAssistantMemory } from "./assistantMemory";
import { getAssistantContext } from "./assistantContext";

type FakeStorage = { data: Record<string, string>; getItem: (key: string) => string | null; setItem: (key: string, value: string) => void };
const storage = (): FakeStorage => {
  const data: Record<string, string> = {};
  return { data, getItem: (key) => data[key] ?? null, setItem: (key, value) => { data[key] = value; } };
};

describe("memória local do assistente por papel", () => {
  it("grava e lê notas isoladas por cliente para admin/collaborator", () => {
    const local = storage();
    saveAssistantMemory(local, "client-7", "Preferência por vocal seco", "2026-08-13T00:00:00.000Z");
    saveAssistantMemory(local, "client-8", "Entregar stems em 48kHz", "2026-08-13T00:01:00.000Z");
    const memories = loadAssistantMemories(local);
    expect(memories["client-7"]?.notes).toBe("Preferência por vocal seco");
    expect(memories["client-8"]?.notes).toBe("Entregar stems em 48kHz");
    expect(getAssistantContext("collaborator", [{ id: "7", name: "A" }], "7").canEditMemory).toBe(true);
  });

  it("mantém viewer no portal e sem edição da memória interna", () => {
    const local = storage();
    saveAssistantMemory(local, "client-7", "Nota interna", "2026-08-13T00:00:00.000Z");
    const viewer = getAssistantContext("viewer", [{ id: "7", name: "A" }], "7");
    expect(viewer.activeContext).toBe("portal");
    expect(viewer.canEditMemory).toBe(false);
    expect(loadAssistantMemories(local)["client-7"]?.notes).toBe("Nota interna");
  });
});
