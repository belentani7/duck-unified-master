import { describe, expect, it } from "vitest";
import { groundedValidationProfile, validateTaskInput } from "./pvcU";

describe("PVC-U grounded subset", () => {
  it("aprova uma tarefa estruturalmente e semanticamente válida", () => {
    const result = validateTaskInput({ title: "Revisar vocal", priority: "high", projectId: 4 });
    expect(result.status).toBe("PASSED");
    expect(result.protocol).toBe("PVC-U");
    expect(result.version).toBe("1.0-grounded");
    expect(result.traceId).toBeTruthy();
    expect(result.data?.title).toBe("Revisar vocal");
    expect(result.issues).toEqual([]);
  });

  it("rejeita título vazio ou longo na esfera estrutural", () => {
    const result = validateTaskInput({ title: "   ", priority: "normal" });
    expect(result.status).toBe("FAILED");
    expect(result.layer).toBe("structural");
    expect(result.issues[0]?.code).toMatch(/^PVC-1/);
  });

  it("rejeita caracteres de controle na esfera semântica", () => {
    const result = validateTaskInput({ title: "Vocal\u0000corrompido", priority: "normal" });
    expect(result.status).toBe("FAILED");
    expect(result.layer).toBe("semantic");
    expect(result.issues[0]?.code).toBe("PVC-2XX");
  });

  it("declara honestamente o que o código não implementa", () => {
    expect(groundedValidationProfile.implemented).toContain("Headers de versão e traceId no cliente");
    expect(groundedValidationProfile.explicitlyNotImplemented).toContain("QKD, homomorphic encryption, PINNs and automatic axiom rewriting");
  });
});
