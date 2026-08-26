import { describe, expect, it } from "vitest";
import { workspaceNavigationClass, workspaceTabs } from "./duckWorkspaceContract";

describe("workspace responsive navigation contract", () => {
  it("keeps all five modules available on desktop and mobile", () => {
    expect(workspaceTabs).toHaveLength(5);
    expect(workspaceTabs.map(tab => tab.id)).toEqual(["dashboard", "clients", "plugins", "audit", "colab"]);
    expect(workspaceTabs.every(tab => tab.desktop.length > 0 && tab.mobile.length > 0)).toBe(true);
  });

  it("uses an explicit mobile breakpoint contract", () => {
    expect(workspaceNavigationClass(true, true)).toContain("xl:hidden");
    expect(workspaceNavigationClass(false, false)).toContain("hidden xl:flex");
    expect(workspaceNavigationClass(true, true)).toContain("bg-[#00ff66]");
  });
});
