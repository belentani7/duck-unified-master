import React, { useState } from "react";
import { DuckAIChat } from "@/components/DuckAIChat";
import { Button } from "@/components/ui/button";
import { Shield, ExternalLink } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";

export default function DuckMegaHTML() {
  const { user, isAuthenticated } = useAuth();
  const [showManager, setShowManager] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#080e08] flex flex-col">
      <div className="absolute top-0 left-0 right-0 z-40 bg-black/85 backdrop-blur-md border-b border-emerald-500/30 px-4 py-2 flex items-center justify-between text-xs font-mono text-emerald-400">
        <div className="flex items-center gap-3">
          <span className="font-unbounded font-black tracking-widest text-white text-sm">DUCK // HTML MÁXIMO AUDITADO (MEGA UNIFICADO)</span>
          <span className="hidden sm:inline bg-emerald-500/20 px-2 py-0.5 rounded text-[10px]">2,615 Líneas Auténticas · 1.3MB</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/duck-assets/duck-mega.html" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Pantalla Completa
          </a>
          <a href="/audit" className="flex items-center gap-1 text-emerald-300 hover:text-white transition-colors bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
            Audit Studio
          </a>
          {!isAuthenticated ? (
            <Button onClick={() => startLogin()} size="sm" className="h-7 bg-emerald-500 text-black hover:bg-emerald-400 font-mono text-[11px]">
              Login Duck
            </Button>
          ) : (
            <Button onClick={() => setShowManager(!showManager)} size="sm" variant="outline" className="h-7 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-mono text-[11px]">
              <Shield className="w-3 h-3 mr-1" /> Gestão ({user?.name})
            </Button>
          )}
        </div>
      </div>

      <div className="w-full h-full pt-10">
        <iframe
          src="/duck-assets/duck-mega.html"
          title="DUCK HTML Máximo Auditado"
          className="w-full h-full border-0"
        />
      </div>

      {showManager && isAuthenticated && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#0c160e] border border-emerald-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl text-emerald-100 font-mono">
            <div className="flex justify-between items-center border-b border-emerald-500/20 pb-4">
              <h3 className="font-unbounded font-bold text-lg text-emerald-400">Painel de Gestão Fullstack — DUCK MÁXIMO</h3>
              <Button onClick={() => setShowManager(false)} size="sm" variant="outline" className="border-emerald-500/30 text-emerald-400">Fechar</Button>
            </div>
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded bg-black/40 border border-emerald-500/20">
                <span className="text-emerald-400 font-bold block mb-1">Sessão Ativa:</span>
                Usuário: {user?.name} ({user?.email}) · Papel: {user?.role}
              </div>
              <div className="p-4 rounded bg-black/40 border border-emerald-500/20 space-y-2">
                <span className="text-emerald-400 font-bold block">Conexões S3 & Auditoria:</span>
                <p className="text-emerald-200/80">· Versão maestra de 2,615 líneas cargada en iframe con soporte interactivo.</p>
                <p className="text-emerald-200/80">· Gestão de stems, portadas e auditoria de versões via S3.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <DuckAIChat language="pt" />
    </div>
  );
}
