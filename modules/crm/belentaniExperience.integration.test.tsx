// @vitest-environment jsdom

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

const authState = vi.hoisted(() => ({ role: "admin" as "admin" | "collaborator" | "viewer", name: "Lucas Silva" }));
const queryState = vi.hoisted(() => ({ enabled: false }));
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: 1, role: authState.role, name: authState.name, openId: "lucas-owner" } }),
}));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    studio: {
      belentaniExperience: {
        useQuery: (_input: undefined, options: { enabled: boolean }) => {
          queryState.enabled = options.enabled;
          return options.enabled ? { data: { title: "Belentani Experience", signature: "Desenvolvido discretamente por Belentani para Duck", fragmentLabel: "CHAVE 01/05 · SINAL DE CONFIANÇA", message: "Algumas criações não precisam fazer ruído para mudar o ambiente." } } : { data: undefined };
        },
      },
    },
  },
}));

import { BelentaniExperience } from "../client/src/components/BelentaniExperience";

function mount(role: typeof authState.role, name: string) {
  authState.role = role;
  authState.name = name;
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root: Root = createRoot(host);
  act(() => root.render(createElement(BelentaniExperience)));
  return { host, root };
}

afterEach(() => {
  document.body.innerHTML = "";
  queryState.enabled = false;
});

describe("Belentani Experience owner-only", () => {
  it("monta o selo discreto para Lucas Silva admin", () => {
    const view = mount("admin", "Lucas Silva");
    expect(queryState.enabled).toBe(true);
    expect(view.host.querySelector("[data-testid=belentani-experience]")).not.toBeNull();
    expect(view.host.textContent).not.toContain("CHAVE 02");
    act(() => view.root.unmount());
  });

  it("não monta nem consulta o artefato para collaborator, viewer ou outro nome", () => {
    const collaborator = mount("collaborator", "Lucas Silva");
    expect(queryState.enabled).toBe(false);
    expect(collaborator.host.querySelector("[data-testid=belentani-experience]")).toBeNull();
    act(() => collaborator.root.unmount());

    const viewer = mount("viewer", "Lucas Silva");
    expect(viewer.host.querySelector("[data-testid=belentani-experience]")).toBeNull();
    act(() => viewer.root.unmount());

    const other = mount("admin", "Outra Pessoa");
    expect(other.host.querySelector("[data-testid=belentani-experience]")).toBeNull();
    act(() => other.root.unmount());
  });
});
