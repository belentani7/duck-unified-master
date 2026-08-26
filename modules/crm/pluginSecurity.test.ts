import { describe, expect, it } from "vitest";
import { canInstallOrExecutePlugin, reviewStatus } from "../shared/pluginSecurity";

describe("plugin security gate", () => {
  it("blocks a plugin until every security condition is satisfied", () => {
    expect(canInstallOrExecutePlugin({ hashVerified: true, staticAuditPassed: true, manuallyApproved: false })).toBe(false);
    expect(reviewStatus({ hashVerified: true, staticAuditPassed: true, manuallyApproved: false })).toBe("bloqueado");
  });

  it("allows execution only after hash, static audit, and manual approval", () => {
    expect(canInstallOrExecutePlugin({ hashVerified: true, staticAuditPassed: true, manuallyApproved: true })).toBe(true);
    expect(reviewStatus({ hashVerified: true, staticAuditPassed: true, manuallyApproved: true })).toBe("aprovado");
  });
});
