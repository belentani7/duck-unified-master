import { useState } from "react";
import { Check, ListTodo, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { validateTaskInput } from "@shared/pvcU";

const statusLabels = { pending: "Pendente", in_progress: "Em andamento", completed: "Concluída", canceled: "Cancelada" } as const;

export function TaskPanel() {
  const tasksQuery = trpc.studio.tasks.useQuery(undefined, { retry: false });
  const projectsQuery = trpc.studio.projects.useQuery(undefined, { retry: false });
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "normal" | "high">("normal");
  const [projectId, setProjectId] = useState<number | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const createTask = trpc.studio.createTask.useMutation({
    onSuccess: () => {
      void tasksQuery.refetch();
      setTitle("");
      setShowForm(false);
      setValidationMessage(null);
      setStatusMessage("Tarefa validada e persistida no núcleo Duck.");
    },
    onError: (error) => setValidationMessage(error.message),
  });
  const updateStatus = trpc.studio.updateTaskStatus.useMutation({
    onSuccess: () => {
      void tasksQuery.refetch();
      setStatusMessage("Transição de estado confirmada.");
    },
    onError: (error) => setValidationMessage(error.message),
  });

  const save = () => {
    const validation = validateTaskInput({ title, priority, projectId });
    if (validation.status !== "PASSED" || !validation.data) {
      setValidationMessage(validation.issues[0]?.message ?? "Revise os campos antes de salvar.");
      setStatusMessage(null);
      return;
    }
    setValidationMessage(null);
    setStatusMessage("Validando estrutura e regras de conteúdo…");
    createTask.mutate(validation.data);
  };

  const tasks = tasksQuery.data || [];
  return <section className="management-workspace">
    <div className="workspace-heading"><div><span className="panel-kicker">CRM · TAREFAS · PVC-U</span><h2>Próximas ações do estúdio</h2><p>Tarefas persistidas, vinculadas ao owner e opcionalmente a um projeto.</p></div><button className="primary-button" onClick={() => setShowForm((value) => !value)}><Plus size={16} /> Nova tarefa</button></div>
    {showForm && <div className="inline-form" aria-label="Nova tarefa"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: revisar vocal do refrão" aria-label="Título da tarefa" aria-invalid={Boolean(validationMessage)} autoFocus /><select value={priority} onChange={(event) => setPriority(event.target.value as typeof priority)} aria-label="Prioridade"><option value="low">Baixa</option><option value="normal">Normal</option><option value="high">Alta</option></select><select value={projectId || ""} onChange={(event) => setProjectId(event.target.value ? Number(event.target.value) : undefined)} aria-label="Projeto"><option value="">Sem projeto</option>{(projectsQuery.data || []).map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select><button className="secondary-button" onClick={save} disabled={createTask.isPending}><Check size={14} /> {createTask.isPending ? "Validando…" : "Salvar"}</button></div>}
    {(validationMessage || statusMessage) && <p className={validationMessage ? "form-error" : "form-status"} role="status">{validationMessage || statusMessage}</p>}
    <div className="entity-list">{tasks.length ? tasks.map((task) => <article className="entity-row" key={task.id}><div className="entity-icon violet"><ListTodo size={17} /></div><div className="entity-main"><b>{task.title}</b><span>{task.projectId ? `Projeto #${task.projectId}` : "Tarefa geral"} · prioridade {task.priority}</span></div><div className="entity-meta"><select value={task.status} onChange={(event) => updateStatus.mutate({ id: task.id, status: event.target.value as keyof typeof statusLabels })} aria-label={`Status de ${task.title}`}><option value="pending">{statusLabels.pending}</option><option value="in_progress">{statusLabels.in_progress}</option><option value="completed">{statusLabels.completed}</option><option value="canceled">{statusLabels.canceled}</option></select><small>{new Date(task.createdAt).toLocaleDateString("pt-BR")}</small></div></article>) : <div className="empty-state">Nenhuma tarefa persistida. Crie a primeira ação operacional do estúdio.</div>}</div>
  </section>;
}
