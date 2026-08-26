import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { DuckAIChat } from "@/components/DuckAIChat";
import { Sliders, Disc, FolderArchive, Users, Radio, Cpu, Sparkles, CheckCircle2, Play, Pause, Upload, Shield, HardDrive, FileAudio, ArrowUpRight, Check } from "lucide-react";
import { startLogin } from "@/const";

export default function DuckFullStudioWorkspace() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "clients" | "assets" | "mastering">("dashboard");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeProject, setActiveProject] = useState({ name: "Trap Aracaju 140BPM", bpm: 140, key: "C# Minor", status: "Mixagem & Vocal Tuning" });

  const projects = [
    { id: 1, name: "Trap Aracaju 140BPM", artist: "Kvyn MC", bpm: 140, key: "C#m", status: "Mixagem", progress: 75 },
    { id: 2, name: "Pop Summer Hit", artist: "Belentani", bpm: 118, key: "F# Major", status: "Masterização", progress: 90 },
    { id: 3, name: "Drill Sergipe", artist: "Dlok", bpm: 142, key: "Em", status: "Beatmaking", progress: 40 },
  ];

  const clients = [
    { id: 1, name: "Kvyn MC", project: "Trap Aracaju", deadline: "15 Ago 2026", status: "Aguardando Aprovação V2", link: "duckstudio.local/client/kvyn" },
    { id: 2, name: "Belentani", project: "Pop Summer Hit", deadline: "18 Ago 2026", status: "Stems Enviados", link: "duckstudio.local/client/belen" },
  ];

  return (
    <div className="min-h-screen bg-[#060a06] text-[#e2ede2] font-sans selection:bg-[#00ff66] selection:text-black">
      {/* Top App Bar - Material 3 Style */}
      <header className="sticky top-0 z-50 bg-[#060a06]/95 backdrop-blur-xl border-b border-[#1b301b] px-6 lg:px-12 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#00ff66] flex items-center justify-center font-bold text-black font-mono tracking-tighter shadow-lg shadow-[#00ff66]/15">
            D4X
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs tracking-wider text-white uppercase font-mono">DUCK STUDIO WORKSPACE</span>
              <span className="bg-[#0f2615] text-[#00ff66] font-mono text-[10px] px-2 py-0.5 rounded border border-[#1b301b]">PRO 2026</span>
            </div>
            <span className="text-xs font-mono text-zinc-400">FL Studio Engine Sincronizado · {activeProject.name}</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2 bg-[#0a140a] p-1 rounded-xl border border-[#1b301b] text-xs font-mono">
          <button onClick={() => setActiveTab("dashboard")} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-[#00ff66] text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'}`}>Dashboard</button>
          <button onClick={() => setActiveTab("clients")} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'clients' ? 'bg-[#00ff66] text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'}`}>Portal Clientes</button>
          <button onClick={() => setActiveTab("assets")} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'assets' ? 'bg-[#00ff66] text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'}`}>Assets & VSTs</button>
          <button onClick={() => setActiveTab("mastering")} className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'mastering' ? 'bg-[#00ff66] text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'}`}>Master Lab</button>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#00ff66] bg-[#0a140a] px-3.5 py-1.5 rounded-xl border border-[#1b301b]">
            {user?.name || "Duck (Studio Master)"}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-8">
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Active Session & Storage Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#091209] border border-[#1b301b] p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff66]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66] animate-pulse" />
                    <span className="font-mono text-xs text-[#00ff66] uppercase tracking-widest font-semibold">SESIÓN ACTIVA FL STUDIO</span>
                  </div>
                  <span className="bg-[#0f2615] text-[#00ff66] font-mono text-xs px-3 py-1 rounded-full border border-[#1b301b]">
                    {activeProject.status}
                  </span>
                </div>
                <div>
                  <h1 className="font-bold text-3xl text-white tracking-tight">{activeProject.name}</h1>
                  <p className="text-xs font-mono text-zinc-400 mt-1.5">Tonalidad: {activeProject.key} · Tempo: {activeProject.bpm} BPM · Productor: Duck (Aracaju)</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Button onClick={() => setIsPlaying(!isPlaying)} className="bg-[#00ff66] text-black hover:bg-[#00e65c] font-mono text-xs rounded-2xl px-7 py-6 font-bold shadow-lg shadow-[#00ff66]/20 transition-transform active:scale-95">
                    {isPlaying ? <Pause className="w-4 h-4 mr-2 fill-current" /> : <Play className="w-4 h-4 mr-2 fill-current" />}
                    {isPlaying ? "Pausar Pre-master" : "Reproducir Pre-master"}
                  </Button>
                  <Button variant="outline" className="border-[#1b301b] bg-[#060a06] text-[#e2ede2] hover:bg-[#122012] font-mono text-xs rounded-2xl px-7 py-6 transition-colors">
                    <Upload className="w-4 h-4 mr-2" /> Exportar Stems
                  </Button>
                </div>
              </div>

              <div className="bg-[#091209] border border-[#1b301b] p-8 rounded-3xl space-y-6 shadow-xl flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-[#1b301b] pb-4">
                  <span className="font-mono text-xs text-[#00ff66] uppercase font-semibold">ALMACENAMIENTO LOCAL</span>
                  <HardDrive className="w-4 h-4 text-[#00ff66]" />
                </div>
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between"><span className="text-zinc-400">One-Shots & Kits:</span> <span className="text-white font-bold">1,420</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Presets & VSTs:</span> <span className="text-white font-bold">850</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Espacio Usado:</span> <span className="text-[#00ff66] font-bold">14.2 GB / 500 GB</span></div>
                </div>
                <div className="w-full bg-[#060a06] rounded-full h-2.5 overflow-hidden border border-[#1b301b]">
                  <div className="bg-[#00ff66] h-full w-[28%] rounded-full" />
                </div>
              </div>
            </div>

            {/* Projects Queue */}
            <div className="bg-[#091209] border border-[#1b301b] p-8 rounded-3xl space-y-6 shadow-xl">
              <div className="flex justify-between items-center border-b border-[#1b301b] pb-4">
                <h3 className="font-bold text-lg text-white tracking-tight">Cola de Producciones en Curso</h3>
                <Button size="sm" className="bg-[#00ff66] text-black hover:bg-[#00e65c] font-mono text-xs rounded-xl px-4 py-2 font-bold">
                  + Nuevo Proyecto
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {projects.map((p) => (
                  <div key={p.id} onClick={() => setActiveProject(p)} className="p-6 rounded-2xl bg-[#060a06] border border-[#1b301b] hover:border-[#00ff66]/60 cursor-pointer transition-all space-y-4 group">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs text-[#00ff66] bg-[#0f2615] px-2.5 py-1 rounded-lg border border-[#1b301b]">{p.key} · {p.bpm} BPM</span>
                      <span className="text-[10px] font-mono bg-[#122012] px-2.5 py-1 rounded-lg text-zinc-300">{p.status}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white group-hover:text-[#00ff66] transition-colors">{p.name}</h4>
                      <p className="text-xs text-zinc-400 mt-1">Artista: {p.artist}</p>
                    </div>
                    <div className="w-full bg-[#0a140a] rounded-full h-2 overflow-hidden border border-[#1b301b]">
                      <div className="bg-[#00ff66] h-full rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "clients" && (
          <div className="bg-[#091209] border border-[#1b301b] p-8 rounded-3xl space-y-6 shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-[#1b301b] pb-4">
              <h3 className="font-bold text-lg text-white">Portal Inteligente de Clientes</h3>
              <span className="text-xs font-mono text-[#00ff66]">Enlaces seguros para aprobación de mix</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clients.map((c) => (
                <div key={c.id} className="p-6 rounded-2xl bg-[#060a06] border border-[#1b301b] space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs text-[#00ff66]">Prazo: {c.deadline}</span>
                    <span className="text-[10px] font-mono bg-[#0f2615] text-[#00ff66] px-3 py-1 rounded-full border border-[#1b301b]">{c.status}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">{c.name}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Proyecto: {c.project}</p>
                  </div>
                  <div className="pt-3 border-t border-[#1b301b] flex justify-between items-center">
                    <span className="font-mono text-xs text-zinc-500">{c.link}</span>
                    <Button size="sm" variant="outline" className="border-[#1b301b] bg-[#060a06] text-[#00ff66] font-mono text-xs hover:bg-[#122012] rounded-xl">
                      Copiar Enlace
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "assets" && (
          <div className="bg-[#091209] border border-[#1b301b] p-8 rounded-3xl space-y-6 shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-[#1b301b] pb-4">
              <h3 className="font-bold text-lg text-white">Librería de Assets Funcionales (FL Studio)</h3>
              <span className="text-xs font-mono text-[#00ff66]">14.2 GB Locales</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-xs font-mono">
              <div className="p-6 bg-[#060a06] rounded-2xl border border-[#1b301b] space-y-3">
                <FileAudio className="w-6 h-6 text-[#00ff66]" />
                <h4 className="font-bold text-white text-sm">One-Shots & Drum Kits</h4>
                <p className="text-zinc-400">1,420 samples optimizados 24bit/44.1kHz</p>
              </div>
              <div className="p-6 bg-[#060a06] rounded-2xl border border-[#1b301b] space-y-3">
                <Cpu className="w-6 h-6 text-[#00ff66]" />
                <h4 className="font-bold text-white text-sm">Presets VSTs</h4>
                <p className="text-zinc-400">850 patches para Serum, Vital y Sylenth1</p>
              </div>
              <div className="p-6 bg-[#060a06] rounded-2xl border border-[#1b301b] space-y-3">
                <FolderArchive className="w-6 h-6 text-[#00ff66]" />
                <h4 className="font-bold text-white text-sm">Stems Multitrack</h4>
                <p className="text-zinc-400">42 proyectos archivados y comprimidos</p>
              </div>
              <div className="p-6 bg-[#060a06] rounded-2xl border border-[#1b301b] space-y-3">
                <Sliders className="w-6 h-6 text-[#00ff66]" />
                <h4 className="font-bold text-white text-sm">Plantillas FL Studio</h4>
                <p className="text-zinc-400">12 templates de mezcla rápida</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <DuckAIChat language="pt" />
    </div>
  );
}
