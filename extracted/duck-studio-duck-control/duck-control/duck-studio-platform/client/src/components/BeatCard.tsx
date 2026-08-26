import { Pause, Play, ShoppingBag, Waves } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export type Beat = { id: number; name: string; mood: string; bpm: number; genre: string; key: string; price: string; tone: "emerald" | "lime" | "teal" | "jade"; };
export const beatCatalog: Beat[] = [
  { id: 1, name: "MARÉ BAIXA", mood: "Noturno", bpm: 94, genre: "R&B alternativo", key: "F# min", price: "A partir de R$ 149", tone: "emerald" },
  { id: 2, name: "NOVA FREQUÊNCIA", mood: "Cinemático", bpm: 128, genre: "Trap futurista", key: "C min", price: "A partir de R$ 149", tone: "lime" },
  { id: 3, name: "VERDE FUMAÇA", mood: "Denso", bpm: 76, genre: "Drill brasileiro", key: "D# min", price: "A partir de R$ 149", tone: "teal" },
  { id: 4, name: "DEPOIS DAS 2", mood: "Íntimo", bpm: 102, genre: "Soul / Hip-Hop", key: "A min", price: "A partir de R$ 149", tone: "jade" },
  { id: 5, name: "SEMENTE", mood: "Luminoso", bpm: 118, genre: "Afrobeat", key: "G min", price: "A partir de R$ 149", tone: "lime" },
  { id: 6, name: "FOCO VERMELHO", mood: "Tenso", bpm: 140, genre: "Trap", key: "B min", price: "A partir de R$ 149", tone: "teal" },
];

export function BeatCard({ beat }: { beat: Beat }) {
  const [playing, setPlaying] = useState(false);
  return <article className="beat-card"><div className={`beat-visual tone-${beat.tone}`}><span className="beat-orbit orbit-one" /><span className="beat-orbit orbit-two" /><div className="relative z-10 flex h-full flex-col justify-between p-5"><span className="mono-label">0{beat.id} · PRÉVIA</span><button className="play-button" onClick={() => setPlaying(!playing)} aria-label={playing ? `Pausar ${beat.name}` : `Reproduzir ${beat.name}`}>{playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button><div className="flex h-7 items-end gap-1" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <span key={index} className="wave-bar" style={{ height: `${20 + ((index * 17) % 70)}%` }} />)}</div></div></div><div className="space-y-4 p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="font-display text-xl tracking-tight text-white">{beat.name}</h3><p className="mt-1 text-sm text-emerald-100/55">{beat.genre}</p></div><Waves size={18} className="mt-1 shrink-0 text-emerald-300" /></div><div className="flex flex-wrap gap-2"><span className="beat-tag">{beat.mood}</span><span className="beat-tag">{beat.bpm} BPM</span><span className="beat-tag">{beat.key}</span></div><div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4"><span className="text-xs font-medium text-emerald-100/70">{beat.price}</span><button onClick={() => toast.info("O carrinho seguro será ativado assim que o storefront do Shopify estiver conectado.")} className="inline-flex items-center gap-2 text-xs font-semibold text-white hover:text-emerald-300"><ShoppingBag size={15} /> Adicionar</button></div></div></article>;
}
