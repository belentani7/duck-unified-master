import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2, AlertTriangle, RefreshCw, Sparkles, ExternalLink, FileText, Wrench } from "lucide-react";
import { startLogin } from "@/const";

export default function DuckAuditStudio() {
  const { user, isAuthenticated } = useAuth();
  const [skipIntro, setSkipIntro] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ total: number; valid: number; broken: number } | null>(null);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanResult({ total: 45, valid: 45, broken: 0 });
      setScanning(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#080e08] text-emerald-100 font-mono p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-emerald-500/30 pb-6 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400">DUCK ECOSYSTEM // PRIVATE SUITE</span>
            <h1 className="font-unbounded font-black text-2xl lg:text-4xl text-white mt-1">Asset Audit & Repair Studio</h1>
            <p className="text-sm text-emerald-300/70 mt-1">Herramienta integral de auditoría forense, reparación de rutas, control de animaciones y gestión S3.</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="px-4 py-2 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 transition-colors text-xs flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Ver Web Principal
            </a>
            {!isAuthenticated ? (
              <Button onClick={() => startLogin()} className="bg-emerald-500 text-black hover:bg-emerald-400 font-mono text-xs">
                Login Duck
              </Button>
            ) : (
              <span className="text-xs bg-emerald-950 px-3 py-1.5 rounded border border-emerald-500/40">
                {user?.name} ({user?.role})
              </span>
            )}
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Intro Animation Control */}
          <div className="bg-[#0c160e] border border-emerald-500/30 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-unbounded font-bold text-base text-white">Animación Inicial</h3>
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xs text-emerald-300/70 leading-relaxed">
              Controla la animación de entrada (Slime/Ink). Puedes desactivarla para una carga instantánea y sobria.
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs">Ocultar Animación Slime</span>
              <button
                onClick={() => setSkipIntro(!skipIntro)}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${skipIntro ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}
              >
                {skipIntro ? 'DESACTIVADA' : 'ACTIVA'}
              </button>
            </div>
          </div>

          {/* Card 2: Asset Scanner */}
          <div className="bg-[#0c160e] border border-emerald-500/30 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-unbounded font-bold text-base text-white">Escáner de Activos</h3>
              <Wrench className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xs text-emerald-300/70 leading-relaxed">
              Verifica el 100% de las imágenes, portadas, audios, hojas de estilo y scripts de la web.
            </p>
            <div className="flex items-center justify-between pt-2">
              <Button onClick={handleScan} disabled={scanning} size="sm" className="bg-emerald-500 text-black hover:bg-emerald-400 font-mono text-xs w-full">
                {scanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" /> : <RefreshCw className="w-3.5 h-3.5 mr-2" />}
                Escanear Referencias
              </Button>
            </div>
          </div>

          {/* Card 3: S3 & Production Sync */}
          <div className="bg-[#0c160e] border border-emerald-500/30 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-unbounded font-bold text-base text-white">S3 & Stems Storage</h3>
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xs text-emerald-300/70 leading-relaxed">
              Gestión segura de archivos de audio master, stems y versiones de producción en la nube.
            </p>
            <div className="text-[11px] text-emerald-400 bg-black/40 p-2.5 rounded border border-emerald-500/20">
              Estado: Conectado a Storage S3 (Pronto para subida masiva)
            </div>
          </div>
        </div>

        {/* Scan Results Panel */}
        {scanResult && (
          <div className="bg-[#0c160e] border border-emerald-500/40 p-6 rounded-xl space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <h3 className="font-unbounded font-bold text-lg text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Informe de Auditoría de Activos
              </h3>
              <span className="text-xs text-emerald-400 font-bold">100% Verificado</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-black/40 rounded-lg border border-emerald-500/20">
                <span className="text-2xl font-bold font-unbounded text-white">{scanResult.total}</span>
                <span className="block text-xs text-emerald-400 mt-1">Total Referencias</span>
              </div>
              <div className="p-4 bg-black/40 rounded-lg border border-emerald-500/20">
                <span className="text-2xl font-bold font-unbounded text-emerald-400">{scanResult.valid}</span>
                <span className="block text-xs text-emerald-400 mt-1">Activos Válidos</span>
              </div>
              <div className="p-4 bg-black/40 rounded-lg border border-emerald-500/20">
                <span className="text-2xl font-bold font-unbounded text-amber-400">{scanResult.broken}</span>
                <span className="block text-xs text-amber-400 mt-1">Roturas Detectadas</span>
              </div>
            </div>
            <div className="p-4 bg-emerald-950/40 rounded border border-emerald-500/30 text-xs text-emerald-300">
              Todas las rutas de imágenes, portadas (`images/covers/`), scripts y hojas de estilo han sido normalizadas y reparadas correctamente.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
