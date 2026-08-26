import { describe, expect, it } from "vitest";
import { isAudioQueueTimedOut, resolveAudioQueueState } from "./audioQueue";

describe("audio queue timeout", () => {
  it("does not timeout before the limit", () => {
    expect(isAudioQueueTimedOut(44, 45)).toBe(false);
  });
  it("times out at the limit", () => {
    expect(isAudioQueueTimedOut(45, 45)).toBe(true);
    expect(resolveAudioQueueState(undefined, 45, 45)).toBe("erro");
  });
  it("matches the runtime state transitions", () => {
    expect(resolveAudioQueueState("processing", 1, 45)).toBe("processando");
    expect(resolveAudioQueueState("completed", 2, 45)).toBe("concluído");
    expect(resolveAudioQueueState("error", 2, 45)).toBe("erro");
  });
});
