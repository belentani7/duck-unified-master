// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

const authState = vi.hoisted(() => ({ loading: true, user: null as { role: "admin" | "collaborator" | "viewer" } | null }));

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ loading: authState.loading, user: authState.user }) }));
vi.mock("@/components/LoadingScreen", () => ({ LoadingScreen: ({ phrase }: { phrase: string }) => createElement("div", { "data-testid": "loading" }, phrase) }));
vi.mock("@/pages/Home", () => ({ default: ({ offlineMode }: { offlineMode?: boolean }) => createElement("div", { "data-testid": "home" }, offlineMode ? "Modo local ativo" : "Studio Home") }));
vi.mock("@/pages/ClientPortal", () => ({ default: () => createElement("div", { "data-testid": "portal" }, "Portal cliente") }));

import { RoleAwareHome, RoleAwarePortal } from "../client/src/routing/RoleAwareViews";

type Mounted = { host: HTMLDivElement; root: Root };
function mount(element: React.ReactElement): Mounted {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => root.render(element));
  return { host, root };
}

afterEach(() => {
  vi.useRealTimers();
  authState.loading = true;
  authState.user = null;
  document.body.innerHTML = "";
});

describe("RoleAwareViews timeout real", () => {
  it("sai do LoadingScreen depois de 3s e mostra Home em modo local", () => {
    vi.useFakeTimers();
    const view = mount(createElement(RoleAwareHome));
    expect(view.host.querySelector("[data-testid=loading]")).not.toBeNull();
    act(() => vi.advanceTimersByTime(3000));
    expect(view.host.querySelector("[data-testid=home]")?.textContent).toBe("Modo local ativo");
    expect(view.host.querySelector("[data-testid=loading]")).toBeNull();
    act(() => view.root.unmount());
  });

  it("não abre o Portal para uma conta não viewer depois do timeout", () => {
    vi.useFakeTimers();
    const view = mount(createElement(RoleAwarePortal));
    expect(view.host.querySelector("[data-testid=loading]")).not.toBeNull();
    act(() => vi.advanceTimersByTime(3000));
    expect(view.host.textContent).toContain("Acesso ao portal disponível apenas para clientes viewer.");
    expect(view.host.querySelector("[data-testid=portal]")).toBeNull();
    act(() => view.root.unmount());
  });
});
