export type AssistantRole = "admin" | "collaborator" | "viewer" | "user";
export type AssistantClient = { id: string; name: string };

export function getAssistantContext(role: AssistantRole | undefined, clients: AssistantClient[], selectedClientId?: string) {
  const isViewer = role === "viewer";
  const activeContext = isViewer ? "portal" : selectedClientId || clients[0]?.id || "studio";
  const contextName = isViewer ? "tu proyecto" : clients.find((item) => item.id === activeContext)?.name || "el estudio";
  return {
    isViewer,
    activeContext,
    contextName,
    modeLabel: isViewer ? "PORTAL CLIENTE · SOLO LECTURA" : `OPERADOR · ${role === "collaborator" ? "COLABORADOR" : "ADMIN"}`,
    canEditMemory: !isViewer,
    canExecuteOperations: false,
  } as const;
}
