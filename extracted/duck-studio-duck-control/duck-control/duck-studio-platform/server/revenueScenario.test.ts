import { describe, expect, it } from "vitest";
import { buildRevenueScenarios } from "./db";

describe("buildRevenueScenarios", () => {
  it("does not calculate a scenario when observed inputs are incomplete", () => {
    const result = buildRevenueScenarios({
      qualifiedVisits: 100,
      conversionBasisPoints: null,
      averageTicketCents: 14900,
      variableCostBasisPoints: 1200,
    });

    expect(result.dataReady).toBe(false);
  });

  it("calculates sensitivities only from supplied premises", () => {
    const result = buildRevenueScenarios({
      qualifiedVisits: 1000,
      conversionBasisPoints: 250,
      averageTicketCents: 14900,
      variableCostBasisPoints: 1200,
    });

    expect(result.dataReady).toBe(true);
    if (!result.dataReady) return;
    expect(result.scenarios.base.grossCents).toBe(372500);
    expect(result.scenarios.base.variableCostsCents).toBe(44700);
    expect(result.scenarios.base.contributionCents).toBe(327800);
  });
});
