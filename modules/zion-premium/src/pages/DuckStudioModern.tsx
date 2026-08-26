import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { DuckAIChat } from "@/components/DuckAIChat";
import { Shield, Play, Pause, ExternalLink, Sliders, Disc, Sparkles, Radio, ArrowRight, Music2, CheckCircle2 } from "lucide-react";
import { startLogin } from "@/const";

export default function DuckStudioModern() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"catalog" | "story" | "studio" | "management">("story");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({ title: "Eu Que Mando", artist: "Duck4x", year: "2026", genre: "Pop / Trap" });

  const catalog = [
    { id: 1, title: "Eu Que Mando", artist: "Duck4x", genre: "Pop", role: "Produção", year: "2026", cover: "/manus-storage/capa-1920x1080_40bb2b50.jpg", yt: "https://www.youtube.com/watch?v=SwD7EGmOYQs" },
    { id: 2, title: "Yakuza", artist: "Kvyn MC", genre: "Trap", role: "Beat & Mix", year: "2025", cover: "/manus-storage/mix-3-1920x1280_e312aa60.jpg", yt: "https://www.youtube.com/watch?v=6WgxE4o0J1E" },
    { id: 3, title: "Lento", artist: "Belentani", genre: "Pop", role: "Produção & Master", year: "2025", cover: "/manus-storage/setup-2-1920x1280_ec85dbe9.jpg", yt: "https://www.youtube.com/watch?v=5MClO2y0OLM" },
    { id: 4, title: "Heart Breaking", artist: "Belentani", genre: "Pop", role: "Beatmaking", year: "2025", cover: "/manus-storage/capa-1920x1080_40bb2b50.jpg", yt: "https://www.youtube.com/watch?v=4Hsy6TKp6ys" },
    { id: 5, title: "Money Way", artist: "Dlok", genre: "Trap", role: "Beatmaker", year: "2024", cover: "/manus-storage/mix-3-1920x1280_e312aa60.jpg", yt: "https://www.youtube.com/watch?v=DraF8ww2kgU" },
  ];

  return (
    <div className="min-h-screen bg-[#070b07] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Editorial Top Navigation */}
      <header className="sticky top-0 z-50 bg-[#070b07]/90 backdrop-blur-md border-b border-zinc-800/80 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black font-mono tracking-tighter shadow-lg shadow-emerald-500/20">
            D4X
          </div>
          <div>
            <span className="font-mono text-[10px] tracking-widest text-emerald-400 uppercase block">Aracaju, Sergipe · Brasil</span>
            <span className="font-semibold text-sm tracking-wide text-white">DUCK // STUDIO & PRODUÇÃO</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider text-zinc-400">
          <button onClick={() => setActiveTab("story")} className={`hover:text-emerald-400 transition-colors ${activeTab === 'story' ? 'text-emerald-400 font-bold border-b border-emerald-400 pb-1' : ''}`}>01. HISTÓRIA</button>
          <button onClick={() => setActiveTab("catalog")} className={`hover:text-emerald-400 transition-colors ${activeTab === 'catalog' ? 'text-emerald-400 font-bold border-b border-emerald-400 pb-1' : ''}`}>02. CATÁLOGO</button>
          <button onClick={() => setActiveTab("studio")} className={`hover:text-emerald-400 transition-colors ${activeTab === 'studio' ? 'text-emerald-400 font-bold border-b border-emerald-400 pb-1' : ''}`}>03. ESTÚDIO</button>
          {isAuthenticated && (
            <button onClick={() => setActiveTab("management")} className={`hover:text-emerald-400 transition-colors ${activeTab === 'management' ? 'text-emerald-400 font-bold border-b border-emerald-400 pb-1' : ''}`}>04. GESTÃO S3</button>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <Button onClick={() => startLogin()} size="sm" className="bg-emerald-500 text-black hover:bg-emerald-400 font-mono text-xs rounded-full px-5">
              Acceso Duck
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{user?.name}</span>
            </div>
          )}
        </div>
      </header>

      {/* Hero / Story Chapter */}
      {activeTab === "story" && (
        <main className="max-w-7xl mx-auto px-6 lg:px-16 py-16 space-y-24">
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5" /> 13 Años de Arquitectura Sonora
              </div>
              <h1 className="font-sans font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.05]">
                Transformando frecuencias en <span className="text-emerald-400 underline decoration-emerald-500/30 decoration-2">identidad viva</span>.
              </h1>
              <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                Soy Lucas (Duck), productor musical, beatmaker y engenheiro de mixagem y masterização basado en Aracaju. Conectando 36M+ streams y más de 40 lanzamientos oficiales, cada frecuencia es diseñada con precisión milimétrica para que el sonido cuente una historia real.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button onClick={() => setActiveTab("catalog")} className="bg-emerald-500 text-black hover:bg-emerald-400 font-mono text-xs rounded-full px-8 py-6">
                  Explorar Discografía <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button onClick={() => setActiveTab("studio")} variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 font-mono text-xs rounded-full px-8 py-6">
                  Ver Estúdio & Equips
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative group">
                <img src="/manus-storage/capa-1920x1080_40bb2b50.jpg" alt="Duck Producer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end">
                  <span className="font-mono text-xs text-emerald-400">DUCK.46GRAUS.COM // ARCHIVE</span>
                  <h4 className="font-bold text-white text-lg mt-1">"Duck que beat é esse?"</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Sesión activa en el estudio principal, Aracaju.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Metrics Grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-zinc-800/80 py-12">
            <div className="space-y-1">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-white">36M+</span>
              <span className="block text-xs font-mono text-zinc-400 tracking-wider">STREAMS GLOBALES</span>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-emerald-400">40+</span>
              <span className="block text-xs font-mono text-zinc-400 tracking-wider">LANZAMIENTOS OFICIALES</span>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-white">13</span>
              <span className="block text-xs font-mono text-zinc-400 tracking-wider">AÑOS DE TRAYECTORIA</span>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-emerald-400">2012</span>
              <span className="block text-xs font-mono text-zinc-400 tracking-wider">ESTUDIO FUNDADO</span>
            </div>
          </section>
        </main>
      )}

      {/* Catalog Chapter */}
      {activeTab === "catalog" && (
        <main className="max-w-7xl mx-auto px-6 lg:px-16 py-16 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-800 pb-6">
            <div>
              <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest">DISCOGRAFÍA & CATÁLOGO</span>
              <h2 className="font-bold text-3xl sm:text-4xl text-white mt-1">Producciones Destacadas</h2>
            </div>
            <p className="text-sm text-zinc-400 max-w-md">
              Selección de beats, colaboraciones y trabajos de mezcla producidos en el estudio de Duck.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalog.map((track) => (
              <div key={track.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl overflow-hidden p-5 space-y-4 hover:border-emerald-500/50 transition-colors group">
                <div className="aspect-square rounded-lg overflow-hidden relative border border-zinc-800">
                  <img src={track.cover} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button 
                    onClick={() => { setCurrentTrack(track); setIsPlaying(true); }}
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono text-emerald-400">
                    <span>{track.genre} · {track.year}</span>
                    <span className="bg-zinc-800 px-2 py-0.5 rounded text-[10px] text-zinc-300">{track.role}</span>
                  </div>
                  <h3 className="font-bold text-lg text-white">{track.title}</h3>
                  <p className="text-xs text-zinc-400">Artista: {track.artist}</p>
                </div>
                <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
                  <a href={track.yt} target="_blank" rel="noreferrer" className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1">
                    Ver en YouTube <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="font-mono text-[10px] text-zinc-500">Master Verified</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Studio Chapter */}
      {activeTab === "studio" && (
        <main className="max-w-7xl mx-auto px-6 lg:px-16 py-16 space-y-12">
          <div className="border-b border-zinc-800 pb-6">
            <span className="font-mono text-xs text-emerald-400 uppercase tracking-widest">ARQUITECTURA DE AUDIO</span>
            <h2 className="font-bold text-3xl sm:text-4xl text-white mt-1">El Estúdio & Equipamentos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="aspect-[16/10] rounded-xl overflow-hidden border border-zinc-800">
                <img src="/manus-storage/mix-3-1920x1280_e312aa60.jpg" alt="Consola y Monitores" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-bold text-lg text-white">Consola & Monitoreo</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Tratamiento acústico avanzado y monitores de alta fidelidad para una traducción perfecta en cualquier sistema de sonido.
              </p>
            </div>
            <div className="space-y-4">
              <div className="aspect-[16/10] rounded-xl overflow-hidden border border-zinc-800">
                <img src="/manus-storage/setup-2-1920x1280_ec85dbe9.jpg" alt="Aracaju Sergipe" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-bold text-lg text-white">Aracaju, Sergipe</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Base creativa principal equipada con hardware analógico y sintetizadores vintage para texturas orgánicas únicas.
              </p>
            </div>
            <div className="space-y-4">
              <div className="aspect-[16/10] rounded-xl overflow-hidden border border-zinc-800">
                <img src="/manus-storage/capa-1920x1080_40bb2b50.jpg" alt="Sesión Activa" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-bold text-lg text-white">Ingeniería de Producción</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Desde la composición del beat hasta el master final optimizado para plataformas de streaming global.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* Floating Audio Bar */}
      <div className="fixed bottom-6 left-6 right-6 lg:left-1/2 lg:-translate-x-1/2 lg:max-w-2xl z-40 bg-zinc-950/90 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-zinc-800 overflow-hidden border border-zinc-700">
            <img src="/manus-storage/capa-1920x1080_40bb2b50.jpg" alt="Cover" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider block">REPRODUCTOR ACTIVO</span>
            <h5 className="font-bold text-sm text-white">{currentTrack.title} <span className="text-zinc-400 font-normal">({currentTrack.artist})</span></h5>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
        </div>
      </div>

      <DuckAIChat language="pt" />
    </div>
  );
}
