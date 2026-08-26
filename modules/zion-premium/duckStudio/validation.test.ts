import { describe, expect, it } from "vitest";
import { sanitizeStemName } from "./stemStorage";
import { commentInputSchema, isAllowedStemMime, projectInputSchema, stemStatusInputSchema } from "./validation";

describe("Duck Studio domain validation", () => {
  it("accepts a valid production project and rejects invalid BPM values", () => {
    expect(projectInputSchema.safeParse({ name: "Trap Aracaju", artist: "DUCK", bpm: 140, key: "C# Minor", genre: "Trap" }).success).toBe(true);
    expect(projectInputSchema.safeParse({ name: "Trap Aracaju", artist: "DUCK", bpm: 20, key: "C# Minor", genre: "Trap" }).success).toBe(false);
  });

  it("enforces timestamp and review state constraints", () => {
    expect(commentInputSchema.safeParse({ projectId: 1, authorName: "DUCK", content: "Entrada do vocal", timestampSeconds: 42.3 }).success).toBe(true);
    expect(commentInputSchema.safeParse({ projectId: 1, authorName: "DUCK", content: "Entrada do vocal", timestampSeconds: -1 }).success).toBe(false);
    expect(stemStatusInputSchema.safeParse({ stemId: 1, status: "aprovado" }).success).toBe(true);
    expect(stemStatusInputSchema.safeParse({ stemId: 1, status: "removido" }).success).toBe(false);
  });

  it("accepts audio formats and produces a safe storage filename", () => {
    expect(isAllowedStemMime("audio/wav")).toBe(true);
    expect(isAllowedStemMime("application/x-msdownload")).toBe(false);
    expect(sanitizeStemName("Voz principal / take 01!.wav")).toBe("Voz_principal_take_01_.wav");
  });
});
