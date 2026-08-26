export type PluginReview = {
  hashVerified: boolean;
  staticAuditPassed: boolean;
  manuallyApproved: boolean;
};

export function canInstallOrExecutePlugin(review: PluginReview): boolean {
  return review.hashVerified && review.staticAuditPassed && review.manuallyApproved;
}

export function reviewStatus(review: PluginReview): "bloqueado" | "aprovado" {
  return canInstallOrExecutePlugin(review) ? "aprovado" : "bloqueado";
}
