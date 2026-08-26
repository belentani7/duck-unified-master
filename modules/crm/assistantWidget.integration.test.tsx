// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

const authState = vi.hoisted(() => ({ role: "admin" as "admin" | "collaborator" | "viewer", name: "Duck" }));
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function setInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ user: { id: 1, role: authState.role, name: authState.name } }) }));
vi.mock("@/lib/trpc", () => ({ trpc: { studio: { clients: { useQuery: () => ({ data: [{ id: 7, name: "Artista Real" }] }) } } } }));

import { AssistantWidget } from "../client/src/components/AssistantWidget";

function mount(role: typeof authState.role) {
  authState.role = role;
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root: Root = createRoot(host);
  act(() => root.render(createElement(AssistantWidget, { onClose: () => undefined })));
  return { host, root };
}

afterEach(() => {
  localStorage.clear();
  document.body.innerHTML = "";
});

describe("AssistantWidget real DOM flow", () => {
  it("admin escreve e relê uma nota local no contexto selecionado", () => {
    const first = mount("admin");
    const input = first.host.querySelector<HTMLInputElement>(".assistant-compose input");
    expect(first.host.textContent).toContain("OPERADOR · ADMIN");
    expect(first.host.textContent).toContain("Las respuestas de Duck son orientación");
    expect(input).not.toBeNull();
    act(() => setInputValue(input!, "Vocal seco"));
    act(() => first.host.querySelector<HTMLButtonElement>(".memory-note button")!.click());
    expect(JSON.parse(localStorage.getItem("duck-client-memories") || "{}")["7"].notes).toBe("Vocal seco");
    act(() => first.root.unmount());
    const second = mount("admin");
    expect(second.host.textContent).toContain("Nota local de Artista Real guardada");
    act(() => second.root.unmount());
  });

  it("collaborator pode trabalhar em contexto de cliente, mas o chat declara modo informativo", () => {
    const view = mount("collaborator");
    expect(view.host.textContent).toContain("OPERADOR · COLABORADOR");
    const input = view.host.querySelector<HTMLInputElement>(".assistant-compose input");
    act(() => setInputValue(input!, "Qué hago después?"));
    act(() => view.host.querySelector<HTMLButtonElement>(".assistant-compose button")!.click());
    expect(view.host.textContent).toContain("Modo informativo");
    expect(view.host.textContent).toContain("No creo entregas, cobros ni cambios de proyecto desde este chat");
    act(() => view.root.unmount());
  });

  it("viewer fica em leitura no portal e não expõe controles de memória", () => {
    const view = mount("viewer");
    expect(view.host.textContent).toContain("PORTAL CLIENTE · SOLO LECTURA");
    expect(view.host.textContent).toContain("Solo mostraré información compartida contigo");
    expect(view.host.querySelector(".memory-note")).toBeNull();
    expect(view.host.querySelector(".assistant-config-button")).toBeNull();
    act(() => view.root.unmount());
  });
});
