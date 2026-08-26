import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  AudioLines,
  BarChart3,
  Bell,
  Bolt,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Code2,
  Command,
  FileAudio,
  FolderKanban,
  Gauge,
  Headphones,
  LayoutDashboard, ListTodo,
  LockKeyhole,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Music2,
  PackageCheck,
  PanelLeftClose,
  Play,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  WandSparkles,
  X,
} from "lucide-react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AssistantWidget } from "@/components/AssistantWidget";
import { AudioLabPanel } from "@/components/AudioLabPanel";
import { PluginReportPanel } from "@/components/PluginReportPanel";
import { StudioManagementPanel } from "@/components/StudioManagementPanel";
import { CatalogPanel } from "@/components/CatalogPanel";
import { DeliveryPortalPanel } from "@/components/DeliveryPortalPanel";
import { FinancePanel } from "@/components/FinancePanel";
import { ActivityHistoryPanel } from "@/components/ActivityHistoryPanel";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { TaskPanel } from "@/components/TaskPanel";
import { BelentaniExperience } from "@/components/BelentaniExperience";

const phrases = [
  "Acredite no seu som.",
  "Persistência transforma talento em resultado.",
  "Conhecer seu processo é ampliar sua liberdade.",
  "Sonhe grande. Produza maior ainda.",
  "Cada acorde é um passo em direção à sua assinatura.",
];

const audioTools = [
  { icon: Activity, label: "Espectro", value: "Abrir módulo", hint: "Entrada de áudio sob demanda" },
  { icon: Gauge, label: "Loudness", value: "Abrir módulo", hint: "Medição após selecionar arquivo" },
  { icon: AudioLines, label: "Afinador", value: "Abrir módulo", hint: "Microfone sob permissão" },
  { icon: Music2, label: "Harmonia", value: "Catálogo", hint: "Ideias reproduzíveis" },
];

const navItems = [
  { label: "Visão geral", icon: LayoutDashboard },
  { label: "Projetos", icon: FolderKanban },
  { label: "Clientes", icon: Users },
  { label: "Entregas", icon: PackageCheck },
  { label: "Tarefas", icon: ListTodo },
  { label: "Financeiro", icon: CircleDollarSign },
  { label: "Catálogo", icon: Music2 },
  { label: "Ferramentas", icon: Headphones },
  { label: "Vault de plugins", icon: ShieldCheck },
];

function Waveform({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`waveform ${compact ? "waveform-compact" : ""}`} aria-hidden="true">
      {Array.from({ length: compact ? 30 : 54 }).map((_, index) => (
        <i key={index} style={{ height: `${18 + ((index * 29) % 72)}%`, animationDelay: `${index * 22}ms` }} />
      ))}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, delta, accent }: { icon: typeof Activity; label: string; value: string; delta: string; accent: string }) {
  return (
    <article className="metric-card">
      <div className="metric-top"><span className={`metric-icon ${accent}`}><Icon size={17} /></span><span className="metric-delta">{delta}</span></div>
      <p>{label}</p>
      <strong>{value}</strong>
      <div className="metric-line"><span style={{ width: accent === "amber" ? "64%" : accent === "violet" ? "82%" : "72%" }} /></div>
    </article>
  );
}

export default function Home({ offlineMode = false }: { offlineMode?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("Visão geral");
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window === "undefined" || window.innerWidth > 820);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const { user } = useAuth();
  const projectsQuery = trpc.studio.projects.useQuery(undefined, { retry: false });
  const clientsQuery = trpc.studio.clients.useQuery(undefined, { retry: false });
  const salesQuery = trpc.studio.sales.useQuery(undefined, { retry: false });
  const activitiesQuery = trpc.studio.activities.useQuery(undefined, { retry: false });
  const projectId = projectsQuery.data?.[0]?.id;
  const deliveriesQuery = trpc.studio.deliveries.useQuery({ projectId: projectId || 0 }, { enabled: Boolean(projectId), retry: false });
  const dashboardProjects = useMemo(() => (projectsQuery.data || []).map((project, index) => ({ name: project.name, client: project.clientId ? `Cliente #${project.clientId}` : "Projeto interno", phase: project.phase, progress: project.progress, color: ["lime", "amber", "violet"][index % 3], due: project.status === "completed" ? "Concluído" : project.status })), [projectsQuery.data]);
  const visibleProjects = useMemo(() => dashboardProjects.filter((project) => `${project.name} ${project.client} ${project.phase}`.toLowerCase().includes(query.toLowerCase())), [dashboardProjects, query]);
  const paidRevenue = useMemo(() => (salesQuery.data || []).filter((sale) => sale.status === "paid").reduce((sum, sale) => sum + sale.amountCents, 0), [salesQuery.data]);
  const pendingDeliveries = (deliveriesQuery.data || []).filter((delivery) => delivery.status === "review").length;
  const activityPreview = (activitiesQuery.data || []).slice(0, 4);
  const navCounts: Record<string, string> = { Projetos: String(projectsQuery.data?.length || 0).padStart(2, "0"), Clientes: String(clientsQuery.data?.length || 0).padStart(2, "0"), Entregas: String(pendingDeliveries).padStart(2, "0") };

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1450);
    const phraseTimer = window.setInterval(() => setPhraseIndex((current) => (current + 1) % phrases.length), 3200);
    return () => { window.clearTimeout(timer); window.clearInterval(phraseTimer); };
  }, []);

  if (loading) return <LoadingScreen phrase={phrases[phraseIndex]} />;

  return (
    <div className="duck-app">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="grid-noise" />{offlineMode && <div className="offline-mode-banner" role="status"><span><b>Modo local ativo</b><small>O núcleo online não respondeu. O dashboard continua disponível; sincronização será retomada quando a conexão voltar.</small></span><span className="offline-mode-dot" /></div>}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="brand-lockup"><img className="brand-logo-image" src="/manus-storage/Untitled2_3621346a.png" alt="Duck" /><div className="duck-mark">D</div><div className="brand-copy"><b>DUCK</b><span>RITMO & FREQUÊNCIA</span></div><button className="icon-button mobile-only" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu"><X size={18} /></button></div>
        <div className="on-air"><span className="on-air-dot" /> NÚCLEO LOCAL <small>{typeof navigator !== "undefined" && navigator.onLine ? "ONLINE" : "OFFLINE"}</small></div>
        <nav className="main-nav" aria-label="Navegação principal">
          <p className="nav-kicker">MISSION CONTROL</p>
          {navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${active === label ? "active" : ""}`} onClick={() => setActive(label)}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{navCounts[label] && <em>{navCounts[label]}</em>} {active === label && <i className="nav-signal" />}</button>)}
        </nav>
        <div className="sidebar-bottom"><div className="storage-meter"><div><span>VAULT LOCAL</span><strong>—</strong></div><div className="storage-track"><i style={{ width: "0%" }} /></div><small>Uso medido pelo núcleo local quando disponível</small></div>{user?.role === "admin" && <button className="nav-item"><Settings2 size={18} /><span>Configurações administrativas</span></button>}<div className="profile-row"><div className="avatar-duck">{(user?.name || "D").slice(0, 1).toUpperCase()}</div><div><b>{user?.name || "Operador Duck"}</b><small>{user?.role === "collaborator" ? "Colaborador · escopo atribuído" : "Admin · offline-first"}</small></div><MoreHorizontal size={18} /></div></div>
      </aside>

      <main className={`main-content ${sidebarOpen ? "" : "wide"}`}>
        <header className="topbar"><div className="topbar-left"><button className="icon-button" onClick={() => setSidebarOpen((open) => !open)} aria-label="Alternar menu">{sidebarOpen ? <PanelLeftClose size={19} /> : <Menu size={19} />}</button><div className="breadcrumb"><span>DUCK.OS</span><ChevronRight size={14} /><b>{active.toUpperCase()}</b></div></div><div className="topbar-actions"><label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar no estúdio" /><kbd>⌘ K</kbd></label><button className="icon-button notification" aria-label="Notificações"><Bell size={18} /><i /></button><button className="duck-mini" onClick={() => setAssistantOpen((open) => !open)}><Sparkles size={16} /> Falar com Duck</button></div></header>

        <section className="hero-section"><div><span className="eyebrow"><span className="pulse-dot" /> {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "short" }).toUpperCase()}</span><h1>Bom trabalho,<br /><span>Duck.</span></h1><p className="hero-subtitle">Seu estúdio está em movimento. <strong>{pendingDeliveries} entregas</strong> aguardam seu toque.</p><div className="hero-actions"><button className="primary-button" onClick={() => setActive("Projetos")}><Plus size={17} /> Novo projeto</button><button className="secondary-button" onClick={() => setActive("Ferramentas")}><Command size={16} /> Atalhos rápidos</button></div></div><div className="hero-console"><div className="console-heading"><span><span className="signal-bars">▂▅▇</span> MONITOR DE SESSÃO</span><small>SEM ENTRADA <i>AGUARDANDO</i></small></div><Waveform /><div className="console-footer"><span>FONTE DE ÁUDIO NÃO SELECIONADA</span><span className="console-status"><i /> NÚCLEO LOCAL</span><span>—</span></div></div></section>

        <section className="metrics-grid"><MetricCard icon={CircleDollarSign} label="Receita paga" value={`R$ ${(paidRevenue / 100).toFixed(2).replace(".", ",")}`} delta="persistido" accent="lime" /><MetricCard icon={FolderKanban} label="Projetos ativos" value={`${(projectsQuery.data || []).filter((project) => project.status !== "completed").length} projetos`} delta="banco" accent="violet" /><MetricCard icon={PackageCheck} label="Entregas pendentes" value={`${pendingDeliveries} revisões`} delta="banco" accent="amber" /><MetricCard icon={Users} label="Clientes ativos" value={`${(clientsQuery.data || []).filter((client) => client.status === "active").length} clientes`} delta="banco" accent="cyan" /></section>

        <section className="dashboard-grid"><div className="panel projects-panel"><div className="panel-heading"><div><span className="panel-kicker">WORKSPACE</span><h2>Projetos em andamento</h2></div><button className="text-button" onClick={() => setActive("Projetos")}>Ver todos <ArrowUpRight size={15} /></button></div><div className="project-list">{visibleProjects.map((project) => <button className="project-row" key={project.name} onClick={() => setActive("Projetos")}><div className={`project-cover ${project.color}`}><Waveform compact /></div><div className="project-info"><div><b>{project.name}</b><span>{project.client}</span></div><small>{project.phase} · {project.due}</small><div className="project-progress"><span style={{ width: `${project.progress}%` }} /><em>{project.progress}%</em></div></div><ChevronRight size={18} className="row-arrow" /></button>)}{visibleProjects.length === 0 && <div className="empty-state">Nenhum projeto encontrado para “{query}”.</div>}</div></div><div className="panel activity-panel"><div className="panel-heading"><div><span className="panel-kicker">LIVE FEED</span><h2>Atividade recente</h2></div><button className="icon-button"><MoreHorizontal size={18} /></button></div><div className="activity-list">{activityPreview.length ? activityPreview.map((item) => <div className="activity-item" key={item.id}><div className="activity-icon lime"><Check size={15} /></div><div><b>{item.action}</b><span>Projeto #{item.projectId}</span></div><time>{new Date(item.createdAt).toLocaleString("pt-BR")}</time></div>) : <div className="empty-state">Nenhuma atividade persistida ainda.</div>}</div><button className="full-link" onClick={() => setActive("Projetos")}>Abrir histórico completo <ArrowUpRight size={15} /></button></div></section>

        <section className="bottom-grid"><div className="panel audio-panel"><div className="panel-heading"><div><span className="panel-kicker">STUDIO RACK</span><h2>Ferramentas de áudio</h2></div><button className="text-button" onClick={() => setActive("Ferramentas")}>Abrir rack <ArrowUpRight size={15} /></button></div><div className="audio-tools">{audioTools.map(({ icon: Icon, label, value, hint }) => <button key={label} className="audio-tool" onClick={() => setActive("Ferramentas")}><span className="tool-icon"><Icon size={19} /></span><b>{label}</b><strong>{value}</strong><small>{hint}</small><span className="tool-led" /></button>)}</div></div><div className="panel security-panel"><div className="panel-heading"><div><span className="panel-kicker">SECURITY</span><h2>Plugin Vault</h2></div><LockKeyhole size={18} className="panel-muted" /></div><div className="security-score"><div className="score-ring"><strong>—</strong><span>audit</span></div><div><b>Revisão manual ativa</b><span>O Vault não executa plugins automaticamente</span><small><ShieldCheck size={13} /> Aprovação necessária por item</small></div></div><div className="vault-row"><Code2 size={16} /><span>Inventário e relatórios persistidos</span><b>VAULT</b></div><button className="full-link" onClick={() => setActive("Vault de plugins")}>Revisar fila segura <ArrowUpRight size={15} /></button></div></section>

        {active === "Projetos" && <><StudioManagementPanel section="Projetos" /><ActivityHistoryPanel /></>}
        {active === "Clientes" && <StudioManagementPanel section="Clientes" />}
        {active === "Entregas" && <DeliveryPortalPanel />}
        {active === "Tarefas" && <TaskPanel />}
        {active === "Financeiro" && <FinancePanel />}
        {active === "Catálogo" && <CatalogPanel />}
        {active === "Ferramentas" && <AudioLabPanel />}
        {active === "Vault de plugins" && <PluginReportPanel />}
        <footer className="app-footer"><span><span className="footer-led" /> DUCK.OS LOCAL CORE v0.1.0</span><span>Seus dados permanecem sob seu controle</span><span>Ajuda <span className="footer-separator">·</span> Privacidade</span></footer>
        <BelentaniExperience />
      </main>
      {assistantOpen && <AssistantWidget onClose={() => setAssistantOpen(false)} />}
    </div>
  );
}
