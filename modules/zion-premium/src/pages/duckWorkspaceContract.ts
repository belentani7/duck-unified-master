export const workspaceTabs = [
  { id: "dashboard", desktop: "Dashboard", mobile: "Dashboard" },
  { id: "clients", desktop: "Portal Clientes", mobile: "Clientes" },
  { id: "plugins", desktop: "Vault Plugins", mobile: "Vault" },
  { id: "audit", desktop: "Auditoria", mobile: "Auditoria" },
  { id: "colab", desktop: "CoLab AI", mobile: "CoLab" },
] as const;

export type WorkspaceTab = (typeof workspaceTabs)[number]["id"];

export function workspaceNavigationClass(isMobile: boolean, isActive: boolean) {
  const responsive = isMobile ? "xl:hidden overflow-x-auto" : "hidden xl:flex";
  const state = isActive ? "bg-[#00ff66] text-black font-bold" : "text-zinc-400 hover:text-white";
  return `${responsive} ${state}`;
}
