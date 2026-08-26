import { describe, expect, it } from "vitest";
import { shouldKeepLoading, shouldShowOfflineHome } from "../client/src/hooks/authGate";

describe("auth gate do DuckOS", () => {
  it("mantém LoadingScreen apenas enquanto a autenticação está dentro do tempo", () => {
    expect(shouldKeepLoading(true, false)).toBe(true);
    expect(shouldKeepLoading(true, true)).toBe(false);
    expect(shouldKeepLoading(false, false)).toBe(false);
  });

  it("ativa o modo local quando o servidor não responde e não há usuário", () => {
    expect(shouldShowOfflineHome(true, true, false)).toBe(false);
    expect(shouldShowOfflineHome(false, true, false)).toBe(true);
    expect(shouldShowOfflineHome(false, true, true)).toBe(false);
  });
});
