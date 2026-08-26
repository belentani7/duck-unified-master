import { describe, expect, it } from "vitest";
import { assessAutomation } from "./studioDomain";

describe("assessAutomation", () => {
  it("blocks commercial outreach without consent", () => {
    const assessment = assessAutomation({
      globalPaused: false,
      hasConsent: false,
      hasRecipient: true,
      action: "email_follow_up",
      manualApproval: false,
    });

    expect(assessment.status).toBe("blocked");
    expect(assessment.dataNode.passed).toBe(false);
  });

  it("pauses any action while the global switch is active", () => {
    const assessment = assessAutomation({
      globalPaused: true,
      hasConsent: true,
      hasRecipient: true,
      action: "project_update",
      manualApproval: false,
    });

    expect(assessment.status).toBe("paused");
    expect(assessment.ownerNode.passed).toBe(false);
  });

  it("routes an external delivery notice to owner approval", () => {
    const assessment = assessAutomation({
      globalPaused: false,
      hasConsent: true,
      hasRecipient: true,
      action: "delivery_notice",
      manualApproval: false,
    });

    expect(assessment.status).toBe("awaiting_approval");
    expect(assessment.ownerNode.required).toBe(true);
  });
});
