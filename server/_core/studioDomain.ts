export type AutomationCandidate = {
  globalPaused: boolean;
  hasConsent: boolean;
  hasRecipient: boolean;
  action: "email_follow_up" | "project_update" | "delivery_notice";
  manualApproval: boolean;
  jurisdiction?: string;
};

export type AutomationAssessment = {
  status: "paused" | "blocked" | "awaiting_approval" | "ready";
  risk: "low" | "medium" | "high";
  dataNode: { passed: boolean; reasons: string[] };
  riskNode: { passed: boolean; reasons: string[] };
  ownerNode: { required: boolean; passed: boolean; reasons: string[] };
};

export function assessAutomation(candidate: AutomationCandidate): AutomationAssessment {
  const dataReasons: string[] = [];
  if (!candidate.hasRecipient) dataReasons.push("Falta destinatário verificável.");
  if (candidate.action === "email_follow_up" && !candidate.hasConsent) {
    dataReasons.push("Falta consentimento para acompanhamento comercial.");
  }

  const risk: AutomationAssessment["risk"] =
    candidate.action === "email_follow_up" || candidate.jurisdiction === "restricted"
      ? "high"
      : candidate.action === "delivery_notice"
        ? "medium"
        : "low";
  const riskReasons =
    risk === "high"
      ? ["Contato comercial externo: exige revisão reforçada."]
      : risk === "medium"
        ? ["Aviso externo vinculado a um projeto: manter rastreabilidade."]
        : ["Ação interna de baixo risco."];
  const dataPassed = dataReasons.length === 0;
  const ownerRequired = candidate.manualApproval || risk !== "low";
  const ownerPassed = !ownerRequired;

  if (candidate.globalPaused) {
    return {
      status: "paused",
      risk,
      dataNode: { passed: dataPassed, reasons: dataReasons },
      riskNode: { passed: true, reasons: riskReasons },
      ownerNode: { required: ownerRequired, passed: false, reasons: ["Pausa global ativa."] },
    };
  }
  if (!dataPassed) {
    return {
      status: "blocked",
      risk,
      dataNode: { passed: false, reasons: dataReasons },
      riskNode: { passed: true, reasons: riskReasons },
      ownerNode: { required: ownerRequired, passed: false, reasons: ["Bloqueado até que os dados sejam corrigidos."] },
    };
  }
  if (ownerRequired) {
    return {
      status: "awaiting_approval",
      risk,
      dataNode: { passed: true, reasons: ["Dados, preferências e regras validados."] },
      riskNode: { passed: true, reasons: riskReasons },
      ownerNode: { required: true, passed: false, reasons: ["Aguardando aprovação do proprietário."] },
    };
  }
  return {
    status: "ready",
    risk,
    dataNode: { passed: true, reasons: ["Dados, preferências e regras validados."] },
    riskNode: { passed: true, reasons: riskReasons },
    ownerNode: { required: false, passed: true, reasons: ["Não exige aprovação adicional."] },
  };
}
