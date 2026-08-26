import { describe, expect, it } from "vitest";
import { getAssistantContext } from "./assistantContext";

describe("contexto operacional do Duck", () => {
  const clients = [{ id: "7", name: "Artista Real" }];

  it("separa admin e collaborator como operador sem permitir mutações pelo chat", () => {
    const admin = getAssistantContext("admin", clients);
    const collaborator = getAssistantContext("collaborator", clients, "7");
    expect(admin.modeLabel).toContain("ADMIN");
    expect(collaborator.modeLabel).toContain("COLABORADOR");
    expect(admin.canEditMemory).toBe(true);
    expect(collaborator.activeContext).toBe("7");
    expect(admin.canExecuteOperations).toBe(false);
  });

  it("isola viewer no portal e bloqueia memória interna", () => {
    const viewer = getAssistantContext("viewer", clients, "7");
    expect(viewer.activeContext).toBe("portal");
    expect(viewer.modeLabel).toContain("SOLO LECTURA");
    expect(viewer.canEditMemory).toBe(false);
    expect(viewer.canExecuteOperations).toBe(false);
  });
});
