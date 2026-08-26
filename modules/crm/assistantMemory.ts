export type AssistantMemory = { notes: string; updatedAt: string };
export type AssistantMemoryStore = Record<string, AssistantMemory>;

type MemoryStorage = Pick<Storage, "getItem" | "setItem">;

export function loadAssistantMemories(storage: Pick<Storage, "getItem"> | undefined): AssistantMemoryStore {
  try {
    return JSON.parse(storage?.getItem("duck-client-memories") || "{}") as AssistantMemoryStore;
  } catch {
    return {};
  }
}

export function saveAssistantMemory(storage: MemoryStorage | undefined, context: string, notes: string, now = new Date().toISOString()) {
  const current = loadAssistantMemories(storage);
  const next = { ...current, [context]: { notes, updatedAt: now } };
  storage?.setItem("duck-client-memories", JSON.stringify(next));
  return next;
}
