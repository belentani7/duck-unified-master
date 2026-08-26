import { useEffect, useMemo, useState } from "react";
import { BrainCircuit, Check, ChevronDown, KeyRound, LockKeyhole, Send, Sparkles, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getAssistantContext } from "../../../shared/assistantContext";
import { loadAssistantMemories, saveAssistantMemory } from "../../../shared/assistantMemory";

type Memory = { notes: string; updatedAt: string };

export function AssistantWidget({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const clientsQuery = trpc.studio.clients.useQuery(undefined, { enabled: Boolean(user && user.role !== "viewer"), retry: false });
  const clients = (clientsQuery.data || []).map((item) => ({ id: String(item.id), name: item.name }));
  const [message, setMessage] = useState("");
  const [client, setClient] = useState("");
  const assistantContext = getAssistantContext(user?.role, clients, client);
  const { isViewer, activeContext, contextName } = assistantContext;
  const [showConfig, setShowConfig] = useState(false);
  const [provider, setProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [configStatus, setConfigStatus] = useState("");
  const [memories, setMemories] = useState<Record<string, Memory>>(() => loadAssistantMemories(localStorage));
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [saved, setSaved] = useState(false);
  const reply = useMemo(() => isViewer ? "Modo informativo: puedo ayudarte a interpretar el estado de tu proyecto, tus entregas y los comentarios disponibles. No ejecuto cambios ni expongo la memoria interna del estudio." : "Modo informativo: puedo sugerir próximos pasos y guardar una nota local para el contexto seleccionado. No creo entregas, cobros ni cambios de proyecto desde este chat.", [isViewer]);

  useEffect(() => {
    if (isViewer) {
      setMessages([{ from: "duck", text: "Estás en el portal de cliente. Solo mostraré información compartida contigo." }]);
      setSaved(false);
      return;
    }
    setMessages([{ from: "duck", text: memories[activeContext]?.notes || `Contexto de ${contextName} cargado para la gestión del estudio.` }]);
    setSaved(Boolean(memories[activeContext]));
  }, [activeContext, contextName, isViewer, memories]);

  const send = () => { const trimmed = message.trim(); if (!trimmed) return; setMessages((current) => [...current, { from: "user", text: trimmed }, { from: "duck", text: reply }]); setMessage(""); };
  const saveMemory = () => { if (isViewer) return; const next = saveAssistantMemory(localStorage, activeContext, message.trim() || `Preferencias observadas para ${contextName}.`); setMemories(next); setMessage(""); setSaved(true); };
  const validateKey = async () => { try { const response = await fetch("http://127.0.0.1:8765/assistant/config/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider, api_key: apiKey }) }); const result = await response.json(); setConfigStatus(result.valid ? "Clave validada; nada fue almacenado." : "Formato inválido."); setApiKey(""); } catch { setConfigStatus("Núcleo local indisponible; el modo offline continúa activo."); } };

  return <aside className="assistant-widget" aria-label="Asistente Duck"><div className="assistant-head"><div className="assistant-face"><span>◡</span><i /></div><div><b>Duck asistente</b><small><span className="status-dot" /> {isViewer ? "PORTAL CLIENTE · SOLO LECTURA" : `OPERADOR · ${user?.role === "collaborator" ? "COLABORADOR" : "ADMIN"}`}</small></div><button onClick={onClose} className="icon-button" aria-label="Cerrar asistente"><X size={16} /></button></div>{!isViewer && <label className="assistant-client"><div><small>CONTEXTO DE GESTIÓN</small><select value={activeContext} onChange={(event) => setClient(event.target.value)} aria-label="Cliente activo">{clients.length ? clients.map((item) => <option key={item.id} value={item.id}>{item.name}</option>) : <option value="studio">Estudio Duck</option>}</select></div><ChevronDown size={15} /></label>}<div className="assistant-scope-note">Las respuestas de Duck son orientación; las operaciones se realizan en los módulos del Studio OS y quedan registradas allí.</div><div className="assistant-messages">{messages.map((item, index) => <div key={`${item.from}-${index}`} className={`assistant-message ${item.from}`}>{item.text}</div>)}</div>{!isViewer && <div className="memory-note"><BrainCircuit size={16} /><span><b>Notas locales del contexto</b><small>{saved ? `Nota local de ${contextName} guardada en este dispositivo.` : `Añade una nota local para ${contextName}.`}</small></span><button onClick={saveMemory} aria-label="Guardar memoria">{saved ? <Check size={15} /> : <LockKeyhole size={14} />}</button></div>}{showConfig && !isViewer && <div className="api-config"><div><b>IA externa opcional</b><small>La clave se valida por el núcleo local y no se guarda aquí.</small></div><select value={provider} onChange={(event) => setProvider(event.target.value)}><option value="openai">OpenAI</option></select><input type="password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="Pega la clave solo para validar" /><button className="secondary-button" onClick={validateKey}><KeyRound size={14} /> Validar</button>{configStatus && <small className="api-status">{configStatus}</small>}</div>}<div className="assistant-compose"><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") send(); }} placeholder={isViewer ? "Pregunta sobre tu proyecto..." : "Habla con Duck..."} /><button onClick={send} aria-label="Enviar mensaje"><Send size={16} /></button></div>{!isViewer && <button className="assistant-footer assistant-config-button" onClick={() => setShowConfig((value) => !value)}><Sparkles size={12} /> {showConfig ? "Cerrar configuración" : "Configurar IA opcional"}</button>}</aside>;
}
