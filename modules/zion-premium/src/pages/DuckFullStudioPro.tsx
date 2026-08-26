import React, { useEffect, useMemo, useState } from "react";
import { DuckAIChat } from "@/components/DuckAIChat";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Check, CheckCircle2, Download, FileAudio, HardDrive, MessageSquare, Pause, Play, Plus, RefreshCw, Search, ShieldCheck, Sparkles, Upload, X } from "lucide-react";
import { workspaceTabs, type WorkspaceTab } from "./duckWorkspaceContract";

type Tab = WorkspaceTab;
type Project = { id: number; name: string; artist: string; bpm: number; key: string; status: string; progress: number; genre: string };
type Stem = { id: number; stemName: string; fileSize: number; status: string; reviewNote?: string | null; createdAt: Date | string; fileUrl: string; downloadUrl: string };
type Comment = { id: number; authorName: string; content: string; timestampSeconds: number; createdAt: Date | string };

const statusLabel: Record<string, string> = {
  enviado: "Enviado",
  aprovado: "Aprovado",
  revisao_solicitada: "Revisão solicitada",
};

function formatFileSize(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function formatTimestamp(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

export default function DuckFullStudioPro() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewProject, setShowNewProject] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [projectForm, setProjectForm] = useState({ name: "", artist: "", bpm: "140", key: "C# Minor", genre: "Trap" });
  const [commentForm, setCommentForm] = useState({ content: "", timestampSeconds: "0" });

  const utils = trpc.useUtils();
  const projectsQuery = trpc.duckStudio.getProjects.useQuery(undefined, { enabled: isAuthenticated });
  const clientsQuery = trpc.duckStudio.getClients.useQuery(undefined, { enabled: isAuthenticated });
  const pluginsQuery = trpc.duckStudio.getPlugins.useQuery();
  const stemsQuery = trpc.duckStudio.getStems.useQuery(
    { projectId: activeProjectId || 0 },
    { enabled: Boolean(isAuthenticated && activeProjectId) },
  );
  const commentsQuery = trpc.duckStudio.getComments.useQuery(
    { projectId: activeProjectId || 0 },
    { enabled: Boolean(isAuthenticated && activeProjectId) },
  );
  const auditQuery = trpc.duckStudio.getAuditLogs.useQuery(undefined, { enabled: Boolean(isAuthenticated && activeTab === "audit") });

  const createProject = trpc.duckStudio.createProject.useMutation({
    onSuccess: async (result) => {
      await utils.duckStudio.getProjects.invalidate();
      await utils.duckStudio.getClients.invalidate();
      setActiveProjectId(result.project.id);
      setShowNewProject(false);
      setProjectForm({ name: "", artist: "", bpm: "140", key: "C# Minor", genre: "Trap" });
      setFlashMessage("Projeto criado e persistido no banco do estúdio.");
    },
    onError: (error) => setFlashMessage(error.message),
  });

  const uploadStem = trpc.duckStudio.uploadStem.useMutation({
    onSuccess: async () => {
      await utils.duckStudio.getStems.invalidate();
      await utils.duckStudio.getAuditLogs.invalidate();
      setShowUpload(false);
      setFlashMessage("Stem enviado para o armazenamento seguro e registrado no projeto.");
    },
    onError: (error) => setFlashMessage(error.message),
  });

  const updateStemStatus = trpc.duckStudio.updateStemStatus.useMutation({
    onSuccess: async () => {
      await utils.duckStudio.getStems.invalidate();
      await utils.duckStudio.getAuditLogs.invalidate();
      setFlashMessage("Estado de revisão atualizado.");
    },
    onError: (error) => setFlashMessage(error.message),
  });

  const addComment = trpc.duckStudio.addComment.useMutation({
    onSuccess: async () => {
      await utils.duckStudio.getComments.invalidate();
      await utils.duckStudio.getAuditLogs.invalidate();
      setCommentForm({ content: "", timestampSeconds: "0" });
      setFlashMessage("Comentário salvo com timestamp.");
    },
    onError: (error) => setFlashMessage(error.message),
  });

  const projects = (projectsQuery.data || []) as Project[];
  const activeProject = useMemo(
    () => projects.find(project => project.id === activeProjectId) || projects[0],
    [projects, activeProjectId],
  );
  const stems = (stemsQuery.data || []) as Stem[];
  const comments = (commentsQuery.data || []) as Comment[];
  const clients = clientsQuery.data || [];
  const filteredPlugins = (pluginsQuery.data || []).filter((plugin: any) =>
    plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) || plugin.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    if (!activeProjectId && projects[0]) setActiveProjectId(projects[0].id);
  }, [activeProjectId, projects]);

  useEffect(() => {
    if (!flashMessage) return;
    const timeout = window.setTimeout(() => setFlashMessage(""), 5000);
    return () => window.clearTimeout(timeout);
  }, [flashMessage]);

  const handleCreateProject = (event: React.FormEvent) => {
    event.preventDefault();
    createProject.mutate({ ...projectForm, bpm: Number(projectForm.bpm) });
  };

  const handleStemSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeProject) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      uploadStem.mutate({ projectId: activeProject.id, stemName: file.name, base64Data: reader.result, mimeType: file.type || "application/octet-stream" });
    };
    reader.readAsDataURL(file);
  };

  const handleAddComment = (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeProject || !commentForm.content.trim()) return;
    addComment.mutate({
      projectId: activeProject.id,
      authorName: user?.name || user?.email || "Duck",
      content: commentForm.content,
      timestampSeconds: Number(commentForm.timestampSeconds) || 0,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050805] text-[#e2ede2] flex items-center justify-center p-6">
        <div className="max-w-lg text-center space-y-6 bg-[#070e07] border border-[#152615] rounded-3xl p-10">
          <img src="/manus-storage/duck_agent_avatar_c5b3621a.png" alt="Mascote DUCK CoLab" className="w-20 h-20 mx-auto rounded-2xl" />
          <div>
            <p className="font-mono text-xs text-[#00ff66] uppercase tracking-widest">Workspace privado</p>
            <h1 className="text-3xl font-bold text-white mt-2">Entre para gerir as produções do DUCK.</h1>
            <p className="text-sm text-zinc-400 mt-3">Projetos, stems, comentários e aprovações são dados privados e persistentes.</p>
          </div>
          <Button onClick={() => startLogin()} className="bg-[#00ff66] text-black hover:bg-[#00e65c] font-mono font-bold rounded-xl px-6 py-5">Entrar no workspace</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050805] text-[#e2ede2] font-sans selection:bg-[#00ff66] selection:text-black">
      <header className="sticky top-0 z-50 bg-[#050805]/95 backdrop-blur-xl border-b border-[#152615] px-6 lg:px-12 py-3.5 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#00ff66] flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src="/manus-storage/duck_agent_avatar_c5b3621a.png" alt="Logótipo DUCK" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs tracking-wider text-white uppercase font-mono">DUCK STUDIO PRO 400</span>
              <span className="bg-[#0b1c0d] text-[#00ff66] font-mono text-[10px] px-2 py-0.5 rounded border border-[#152615]">FULLSTACK</span>
            </div>
            <span className="text-xs font-mono text-zinc-400 truncate block">FL Studio Flow · {activeProject?.name || "Nenhum projeto selecionado"}</span>
          </div>
        </div>
        <nav className="hidden xl:flex items-center gap-1 bg-[#081208] p-1 rounded-xl border border-[#152615] text-xs font-mono">
          {workspaceTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 rounded-lg transition-all ${activeTab === tab.id ? "bg-[#00ff66] text-black font-bold" : "text-zinc-400 hover:text-white"}`}>
              {tab.desktop}
            </button>
          ))}
        </nav>
        <span className="text-xs font-mono text-[#00ff66] bg-[#081208] px-3 py-1.5 rounded-xl border border-[#152615] whitespace-nowrap">{user?.name || "Duck"}</span>
      </header>
      <nav aria-label="Módulos do workspace" className="xl:hidden flex gap-1 overflow-x-auto bg-[#050805] border-b border-[#152615] px-6 py-2">
        {workspaceTabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap px-3 py-2 rounded-lg font-mono text-[11px] ${activeTab === tab.id ? "bg-[#00ff66] text-black font-bold" : "text-zinc-400"}`}>
            {tab.mobile}
          </button>
        ))}
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
        {flashMessage && (
          <div role="status" className="flex items-center justify-between gap-4 rounded-xl border border-[#00ff66]/40 bg-[#0b1c0d] px-4 py-3 text-xs font-mono text-[#00ff66]">
            <span>{flashMessage}</span><button onClick={() => setFlashMessage("")} aria-label="Fechar mensagem"><X className="w-4 h-4" /></button>
          </div>
        )}

        <section className="bg-[#070e07] border border-[#152615] p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#00ff66]/20 border border-[#00ff66]/40 overflow-hidden flex-shrink-0"><img src="/manus-storage/duck_agent_avatar_c5b3621a.png" alt="Mascote DUCK CoLab" className="w-full h-full object-cover" /></div>
            <div><div className="flex items-center gap-2 font-mono text-xs text-[#00ff66]"><Sparkles className="w-3.5 h-3.5" /> DUCK CoLab local</div><h2 className="font-bold text-xl text-white mt-1">O estúdio está pronto para a próxima revisão.</h2><p className="text-xs text-zinc-400 font-mono mt-1">Base local, persistência SQL e stems armazenados com links de acesso controlados.</p></div>
          </div>
          <Button onClick={() => setActiveTab("colab")} className="bg-[#00ff66] text-black hover:bg-[#00e65c] font-mono text-xs font-bold rounded-xl px-6 py-5">Falar com CoLab</Button>
        </section>

        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 bg-[#070e07] border border-[#152615] p-8 rounded-3xl space-y-6 shadow-xl">
                <div className="flex justify-between items-center"><div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-[#00ff66] animate-pulse" /><span className="font-mono text-xs text-[#00ff66] uppercase tracking-widest font-semibold">Sessão ativa</span></div><span className="bg-[#0b1c0d] text-[#00ff66] font-mono text-xs px-3 py-1 rounded-full border border-[#152615]">{activeProject?.status || "Sem projeto"}</span></div>
                <div><h1 className="font-bold text-3xl text-white tracking-tight">{activeProject?.name || "Crie seu primeiro projeto"}</h1><p className="text-xs font-mono text-zinc-400 mt-1.5">{activeProject ? `Tonalidade: ${activeProject.key} · Tempo: ${activeProject.bpm} BPM · Artista: ${activeProject.artist}` : "O projeto selecionado aparecerá aqui."}</p></div>
                <div className="flex flex-wrap items-center gap-4 pt-2"><Button onClick={() => setIsPlaying(!isPlaying)} disabled={!activeProject} className="bg-[#00ff66] text-black hover:bg-[#00e65c] font-mono text-xs rounded-2xl px-7 py-6 font-bold">{isPlaying ? <Pause className="w-4 h-4 mr-2 fill-current" /> : <Play className="w-4 h-4 mr-2 fill-current" />}{isPlaying ? "Pausar pre-master" : "Reproduzir pre-master"}</Button><Button onClick={() => setShowUpload(true)} disabled={!activeProject} variant="outline" className="border-[#152615] bg-[#050805] text-[#e2ede2] hover:bg-[#0f1c0f] font-mono text-xs rounded-2xl px-7 py-6"><Upload className="w-4 h-4 mr-2" /> Enviar stem</Button></div>
              </section>
              <section className="bg-[#070e07] border border-[#152615] p-8 rounded-3xl space-y-5 shadow-xl"><div className="flex items-center justify-between border-b border-[#152615] pb-4"><span className="font-mono text-xs text-[#00ff66] uppercase font-semibold">Estado do workspace</span><HardDrive className="w-4 h-4 text-[#00ff66]" /></div><div className="space-y-3 text-xs font-mono"><div className="flex justify-between"><span className="text-zinc-400">Projetos persistentes</span><span className="text-white font-bold">{projects.length}</span></div><div className="flex justify-between"><span className="text-zinc-400">Stems no projeto</span><span className="text-white font-bold">{stems.length}</span></div><div className="flex justify-between"><span className="text-zinc-400">Catálogo de referência</span><span className="text-[#00ff66] font-bold">400 itens</span></div></div><div className="text-[11px] text-zinc-500 font-mono border-t border-[#152615] pt-4">Os números são calculados a partir dos dados disponíveis no banco; o armazenamento S3 fornece o tamanho real de cada stem enviado.</div></section>
            </div>

            <section className="bg-[#070e07] border border-[#152615] p-8 rounded-3xl space-y-6 shadow-xl"><div className="flex justify-between items-center border-b border-[#152615] pb-4"><div><h3 className="font-bold text-lg text-white tracking-tight">Produções em curso</h3><p className="text-xs text-zinc-500 font-mono mt-1">Selecione um projeto para revisar stems e comentários.</p></div><Button onClick={() => setShowNewProject(true)} size="sm" className="bg-[#00ff66] text-black hover:bg-[#00e65c] font-mono text-xs rounded-xl px-4 py-2 font-bold"><Plus className="w-4 h-4 mr-1" /> Novo projeto</Button></div>
              {projectsQuery.isLoading ? <Loading text="Carregando projetos do banco..." /> : projectsQuery.isError ? <ErrorState text="Não foi possível consultar os projetos privados." /> : projects.length === 0 ? <EmptyState text="Nenhum projeto persistente ainda. Crie o primeiro projeto do DUCK." action={<Button onClick={() => setShowNewProject(true)} className="bg-[#00ff66] text-black font-mono text-xs">Criar projeto</Button>} /> : <div className="grid grid-cols-1 md:grid-cols-3 gap-5">{projects.map(project => <button key={project.id} onClick={() => setActiveProjectId(project.id)} className={`text-left p-6 rounded-2xl bg-[#050805] border transition-all space-y-4 group ${activeProject?.id === project.id ? "border-[#00ff66]" : "border-[#152615] hover:border-[#00ff66]/60"}`}><div className="flex justify-between items-start"><span className="font-mono text-xs text-[#00ff66] bg-[#0b1c0d] px-2.5 py-1 rounded-lg border border-[#152615]">{project.key} · {project.bpm} BPM</span><span className="text-[10px] font-mono bg-[#0f1c0f] px-2.5 py-1 rounded-lg text-zinc-300">{project.status}</span></div><div><h4 className="font-bold text-base text-white group-hover:text-[#00ff66] transition-colors">{project.name}</h4><p className="text-xs text-zinc-400 mt-1">Artista: {project.artist}</p></div><div className="w-full bg-[#081208] rounded-full h-2 overflow-hidden border border-[#152615]"><div className="bg-[#00ff66] h-full rounded-full" style={{ width: `${project.progress}%` }} /></div></button>)}</div>}
            </section>
            {showNewProject && <ProjectForm form={projectForm} setForm={setProjectForm} onSubmit={handleCreateProject} onCancel={() => setShowNewProject(false)} pending={createProject.isPending} />}
          </div>
        )}

        {activeTab === "clients" && <ClientPortal clients={clients} loading={clientsQuery.isLoading} activeProject={activeProject} stems={stems} comments={comments} stemsLoading={stemsQuery.isLoading} commentsLoading={commentsQuery.isLoading} commentForm={commentForm} setCommentForm={setCommentForm} onSelectProject={setActiveProjectId} onAddComment={handleAddComment} onStemStatus={(stemId, status) => updateStemStatus.mutate({ stemId, status })} onUpload={() => setShowUpload(true)} />}

        {activeTab === "plugins" && <section className="bg-[#070e07] border border-[#152615] p-8 rounded-3xl space-y-6 shadow-xl"><div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#152615] pb-4 gap-4"><div><h3 className="font-bold text-lg text-white">Vault de ferramentas FL Studio</h3><p className="text-xs font-mono text-zinc-400 mt-1">Catálogo legal de referências. Fontes GitHub aparecem apenas quando verificadas.</p></div><div className="relative w-full md:w-72"><Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" /><input type="text" placeholder="Buscar ferramenta..." value={searchTerm} onChange={event => setSearchTerm(event.target.value)} className="w-full bg-[#050805] border border-[#152615] rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00ff66]" /></div></div>{pluginsQuery.isLoading ? <Loading text="Carregando catálogo..." /> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{filteredPlugins.map((plugin: any) => <div key={plugin.id} className="p-5 rounded-2xl bg-[#050805] border border-[#152615] space-y-3 flex flex-col justify-between"><div className="space-y-3"><div className="flex justify-between items-center"><span className="font-mono text-[10px] bg-[#0b1c0d] text-[#00ff66] px-2.5 py-0.5 rounded border border-[#152615]">{plugin.category}</span><span className="text-[10px] font-mono text-zinc-500">{plugin.verifiedSource ? "Fonte verificada" : "Referência"}</span></div><div><h4 className="font-bold text-sm text-white">{plugin.name}</h4><p className="text-xs text-zinc-400 mt-0.5">{plugin.type}</p></div></div><div className="pt-2 border-t border-[#152615] space-y-2"><span className="text-[11px] font-mono text-[#00ff66]">{plugin.license}</span>{plugin.url && <a href={plugin.url} target="_blank" rel="noopener noreferrer" className="block text-center bg-[#081208] hover:bg-[#0b1c0d] text-[#00ff66] border border-[#152615] text-[10px] font-mono py-1.5 rounded-lg">Ver fonte GitHub ↗</a>}</div></div>)}</div>}</section>}

        {activeTab === "audit" && <section className="bg-[#070e07] border border-[#152615] p-8 rounded-3xl space-y-6 shadow-xl"><div className="flex justify-between items-center border-b border-[#152615] pb-4"><div><h3 className="font-bold text-lg text-white">Auditoria operacional</h3><p className="text-xs font-mono text-zinc-400 mt-1">Eventos reais de projeto, upload e revisão.</p></div><ShieldCheck className="w-5 h-5 text-[#00ff66]" /></div>{auditQuery.isLoading ? <Loading text="Carregando eventos..." /> : auditQuery.isError ? <ErrorState text="Não foi possível consultar os eventos de auditoria." /> : auditQuery.data?.length ? <div className="space-y-3">{auditQuery.data.map(log => <div key={log.id} className="p-4 rounded-xl bg-[#050805] border border-[#152615] flex flex-col md:flex-row md:items-center justify-between gap-2"><div><p className="font-mono text-xs text-[#00ff66]">{log.action}</p><p className="text-sm text-white mt-1">{log.details || "Sem detalhes"}</p></div><time className="text-[11px] font-mono text-zinc-500">{new Date(log.createdAt).toLocaleString("pt-BR")}</time></div>)}</div> : <EmptyState text="Nenhum evento de auditoria registrado ainda." />}</section>}

        {activeTab === "colab" && <section className="bg-[#070e07] border border-[#152615] p-8 rounded-3xl space-y-6 shadow-xl"><div className="flex items-center gap-4 border-b border-[#152615] pb-4"><div className="w-12 h-12 rounded-2xl bg-[#00ff66]/20 border border-[#00ff66]/40 overflow-hidden"><img src="/manus-storage/duck_agent_avatar_c5b3621a.png" alt="Mascote DUCK" className="w-full h-full object-cover" /></div><div><h3 className="font-bold text-lg text-white">DUCK CoLab — base local</h3><p className="text-xs font-mono text-[#00ff66]">Respostas por regras, sem alegar treinamento ou escuta automática.</p></div></div><p className="text-sm text-zinc-300 leading-relaxed">O CoLab responde em português e pode orientar sobre mixagem, masterização, fluxo de stems, comentários por timestamp e referências legais do Vault. Quando não tiver certeza, ele indica o limite e sugere uma verificação humana ou um teste de escuta.</p></section>}
      </main>

      {showUpload && activeProject && <div className="fixed inset-0 z-50 bg-black/70 p-6 flex items-center justify-center"><div className="w-full max-w-lg bg-[#070e07] border border-[#152615] rounded-3xl p-7 space-y-5"><div className="flex justify-between items-start"><div><p className="font-mono text-xs text-[#00ff66]">Projeto selecionado</p><h3 className="text-xl font-bold text-white mt-1">Enviar stem para {activeProject.name}</h3><p className="text-xs text-zinc-400 mt-2">WAV, MP3, FLAC, OGG, AAC ou M4A até 125 MB.</p></div><button onClick={() => setShowUpload(false)} aria-label="Fechar"><X className="w-5 h-5 text-zinc-400" /></button></div><label className="border border-dashed border-[#00ff66]/50 rounded-2xl p-8 flex flex-col items-center gap-3 text-center cursor-pointer hover:bg-[#0b1c0d] transition-colors"><Upload className="w-8 h-8 text-[#00ff66]" /><span className="font-mono text-sm text-white">Escolher arquivo de áudio</span><span className="text-xs text-zinc-500">O upload inicia após a seleção.</span><input type="file" className="sr-only" accept="audio/*,.wav,.flac" onChange={handleStemSelected} disabled={uploadStem.isPending} /></label>{uploadStem.isPending && <p className="text-xs font-mono text-[#00ff66] flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Enviando ao armazenamento seguro...</p>}</div></div>}

      <DuckAIChat language="pt" />
    </div>
  );
}

function Loading({ text }: { text: string }) { return <div className="flex items-center justify-center py-12 text-zinc-400 font-mono text-xs"><RefreshCw className="w-4 h-4 animate-spin mr-2 text-[#00ff66]" />{text}</div>; }
function ErrorState({ text }: { text: string }) { return <div className="flex items-center gap-3 py-10 justify-center text-red-300 text-sm"><ShieldCheck className="w-4 h-4" />{text}</div>; }
function EmptyState({ text, action }: { text: string; action?: React.ReactNode }) { return <div className="py-12 text-center space-y-4"><p className="text-sm text-zinc-400">{text}</p>{action}</div>; }

function ProjectForm({ form, setForm, onSubmit, onCancel, pending }: { form: { name: string; artist: string; bpm: string; key: string; genre: string }; setForm: React.Dispatch<React.SetStateAction<{ name: string; artist: string; bpm: string; key: string; genre: string }>>; onSubmit: (event: React.FormEvent) => void; onCancel: () => void; pending: boolean }) {
  return <form onSubmit={onSubmit} className="bg-[#070e07] border border-[#00ff66]/30 p-7 rounded-3xl space-y-5"><div className="flex justify-between items-center"><div><p className="font-mono text-xs text-[#00ff66]">Novo registro persistente</p><h3 className="text-xl font-bold text-white">Criar projeto de produção</h3></div><button type="button" onClick={onCancel} aria-label="Cancelar"><X className="w-5 h-5 text-zinc-400" /></button></div><div className="grid md:grid-cols-2 gap-4"><Input required placeholder="Nome da produção" value={form.name} onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))} className="bg-[#050805] border-[#152615] text-white" /><Input required placeholder="Artista / cliente" value={form.artist} onChange={event => setForm(prev => ({ ...prev, artist: event.target.value }))} className="bg-[#050805] border-[#152615] text-white" /><Input required type="number" min="40" max="240" placeholder="BPM" value={form.bpm} onChange={event => setForm(prev => ({ ...prev, bpm: event.target.value }))} className="bg-[#050805] border-[#152615] text-white" /><Input required placeholder="Tonalidade" value={form.key} onChange={event => setForm(prev => ({ ...prev, key: event.target.value }))} className="bg-[#050805] border-[#152615] text-white" /><Input required placeholder="Gênero" value={form.genre} onChange={event => setForm(prev => ({ ...prev, genre: event.target.value }))} className="bg-[#050805] border-[#152615] text-white md:col-span-2" /></div><div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={onCancel} className="border-[#152615] text-zinc-300">Cancelar</Button><Button type="submit" disabled={pending} className="bg-[#00ff66] text-black font-mono font-bold">{pending ? "Salvando..." : "Criar projeto"}</Button></div></form>;
}

function ClientPortal({ clients, loading, activeProject, stems, comments, stemsLoading, commentsLoading, commentForm, setCommentForm, onSelectProject, onAddComment, onStemStatus, onUpload }: { clients: any[]; loading: boolean; activeProject?: Project; stems: Stem[]; comments: Comment[]; stemsLoading: boolean; commentsLoading: boolean; commentForm: { content: string; timestampSeconds: string }; setCommentForm: React.Dispatch<React.SetStateAction<{ content: string; timestampSeconds: string }>>; onSelectProject: (id: number) => void; onAddComment: (event: React.FormEvent) => void; onStemStatus: (stemId: number, status: "enviado" | "aprovado" | "revisao_solicitada") => void; onUpload: () => void }) {
  return <div className="space-y-8"><section className="bg-[#070e07] border border-[#152615] p-8 rounded-3xl space-y-6 shadow-xl"><div className="flex justify-between items-center border-b border-[#152615] pb-4"><div><h3 className="font-bold text-lg text-white">Portal de clientes</h3><p className="text-xs font-mono text-[#00ff66] mt-1">Revisão, aprovação e comentários persistentes.</p></div><Button onClick={onUpload} disabled={!activeProject} className="bg-[#00ff66] text-black font-mono text-xs"><Upload className="w-4 h-4 mr-2" /> Enviar stem</Button></div>{loading ? <Loading text="Carregando projetos do portal..." /> : clients.length === 0 ? <EmptyState text="Crie um projeto para abrir o portal de cliente." /> : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{clients.map(client => <button key={client.id} onClick={() => onSelectProject(client.projectId)} className={`text-left p-5 rounded-2xl bg-[#050805] border ${activeProject?.id === client.projectId ? "border-[#00ff66]" : "border-[#152615]"}`}><div className="flex justify-between gap-3"><div><p className="font-bold text-white">{client.name}</p><p className="text-xs text-zinc-400 mt-1">{client.project}</p></div><span className="text-[10px] font-mono text-[#00ff66]">{client.status}</span></div><div className="mt-4 h-1.5 bg-[#081208] rounded-full"><div className="h-full bg-[#00ff66] rounded-full" style={{ width: `${client.progress}%` }} /></div></button>)}</div>}</section><section className="grid lg:grid-cols-2 gap-6"><div className="bg-[#070e07] border border-[#152615] p-7 rounded-3xl space-y-5"><div className="flex items-center justify-between"><h3 className="font-bold text-white">Stems do projeto</h3><FileAudio className="w-4 h-4 text-[#00ff66]" /></div>{!activeProject ? <EmptyState text="Selecione um projeto." /> : stemsLoading ? <Loading text="Carregando stems..." /> : stems.length === 0 ? <EmptyState text="Nenhum stem enviado ainda." action={<Button onClick={onUpload} className="bg-[#00ff66] text-black font-mono text-xs">Enviar primeiro stem</Button>} /> : <div className="space-y-3">{stems.map(stem => <div key={stem.id} className="p-4 bg-[#050805] border border-[#152615] rounded-2xl space-y-3"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-white font-semibold">{stem.stemName}</p><p className="text-[11px] font-mono text-zinc-500">{formatFileSize(stem.fileSize)} · {new Date(stem.createdAt).toLocaleDateString("pt-BR")}</p></div><span className={`text-[10px] font-mono px-2 py-1 rounded border ${stem.status === "aprovado" ? "text-[#00ff66] border-[#00ff66]/30" : stem.status === "revisao_solicitada" ? "text-amber-300 border-amber-300/30" : "text-zinc-300 border-[#152615]"}`}>{statusLabel[stem.status] || stem.status}</span></div><audio controls preload="none" src={stem.fileUrl} className="w-full h-9" aria-label={`Prévia de ${stem.stemName}`} /><div className="flex flex-wrap gap-2"><a href={stem.downloadUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-[11px] font-mono text-[#00ff66] border border-[#152615] rounded-lg px-3 py-2 hover:bg-[#0b1c0d]"><Download className="w-3.5 h-3.5 mr-1.5" /> Baixar com acesso seguro</a>{stem.status !== "aprovado" && <Button size="sm" onClick={() => onStemStatus(stem.id, "aprovado")} className="bg-[#00ff66] text-black text-[11px] font-mono"><Check className="w-3.5 h-3.5 mr-1" /> Aprovar</Button>}<Button size="sm" variant="outline" onClick={() => onStemStatus(stem.id, "revisao_solicitada")} className="border-[#152615] text-amber-300 text-[11px] font-mono">Solicitar revisão</Button></div>{stem.reviewNote && <p className="text-xs text-zinc-400 border-l-2 border-[#00ff66] pl-3">{stem.reviewNote}</p>}</div>)}</div>}</div><div className="bg-[#070e07] border border-[#152615] p-7 rounded-3xl space-y-5"><div className="flex items-center justify-between"><h3 className="font-bold text-white">Comentários por timestamp</h3><MessageSquare className="w-4 h-4 text-[#00ff66]" /></div>{!activeProject ? <EmptyState text="Selecione um projeto." /> : <><form onSubmit={onAddComment} className="space-y-3"><div className="grid grid-cols-[110px_1fr] gap-3"><Input type="number" min="0" step="0.1" value={commentForm.timestampSeconds} onChange={event => setCommentForm(prev => ({ ...prev, timestampSeconds: event.target.value }))} placeholder="Segundos" className="bg-[#050805] border-[#152615] text-white" /><Textarea required value={commentForm.content} onChange={event => setCommentForm(prev => ({ ...prev, content: event.target.value }))} placeholder="Ex.: rever a entrada do vocal" className="bg-[#050805] border-[#152615] text-white min-h-10" /></div><Button type="submit" className="bg-[#00ff66] text-black text-xs font-mono"><MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Guardar comentário</Button></form>{commentsLoading ? <Loading text="Carregando comentários..." /> : comments.length === 0 ? <p className="text-xs text-zinc-500 font-mono py-6">Ainda não há comentários para este projeto.</p> : <div className="space-y-3 max-h-80 overflow-y-auto">{comments.map(comment => <div key={comment.id} className="p-4 bg-[#050805] border border-[#152615] rounded-2xl"><div className="flex justify-between gap-3"><span className="text-[11px] font-mono text-[#00ff66]">{formatTimestamp(comment.timestampSeconds)}</span><span className="text-[10px] text-zinc-500">{comment.authorName}</span></div><p className="text-sm text-zinc-200 mt-2">{comment.content}</p></div>)}</div>}</>}</div></section></div>;
}
