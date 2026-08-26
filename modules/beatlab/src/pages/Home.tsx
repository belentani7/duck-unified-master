/**
 * Diseño: Laboratorio de señal nocturna — consola asimétrica, estados de señal legibles y verde activo.
 * Alcance: prototipo interactivo local; las funciones de audio real se presentan como demostración de flujo.
 */
import { useEffect, useMemo, useState } from "react";
import {
  AudioLines,
  BookOpen,
  ChevronRight,
  CircleHelp,
  Command,
  Download,
  FolderOpen,
  Headphones,
  LibraryBig,
  Mic2,
  Music2,
  PanelLeftClose,
  Pause,
  Play,
  Plus,
  Radio,
  RotateCcw,
  Save,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  VolumeX,
  Waves,
  X,
} from "lucide-react";
import { toast } from "sonner";
import StudioLogo from "@/components/StudioLogo";

type View = "Patrón" | "Piano roll" | "Playlist" | "Mixer" | "Voz";

type Track = {
  id: string;
  name: string;
  family: string;
  color: string;
  level: number;
  steps: number[];
};

const initialTracks: Track[] = [
  { id: "kick", name: "Kick · Pato Gordo", family: "DRUMS", color: "#62F2A5", level: 82, steps: [0, 4, 8, 11, 12] },
  { id: "clap", name: "Clap · Garagem", family: "DRUMS", color: "#70C79A", level: 67, steps: [4, 12] },
  { id: "hat", name: "Hat · Areia Fina", family: "PERC", color: "#7FAE8C", level: 58, steps: [2, 6, 10, 14] },
  { id: "bass", name: "Baixo · Maré Baixa", family: "SYNTH", color: "#75B785", level: 76, steps: [0, 3, 8, 11] },
  { id: "chord", name: "Keys · Neblina", family: "KEYS", color: "#A5CA91", level: 61, steps: [0, 8] },
];

const soundLibrary = [
  { section: "Kits activos", entries: ["Pato Gordo Kit", "Garagem Seca", "Marcado 140"] },
  { section: "Instrumentos", entries: ["Baixo Maré Baixa", "Keys Neblina", "Lead Salmoura", "Pad 03:12"] },
  { section: "Capturas", entries: ["Voz — idea_07", "Voz — dobra baixa", "Textura — chuva"] },
];

const pianoNotes = [
  { note: "C5", start: 1, length: 2, lane: 1 },
  { note: "D#5", start: 3, length: 1, lane: 3 },
  { note: "G4", start: 5, length: 2, lane: 7 },
  { note: "A#4", start: 8, length: 1, lane: 5 },
  { note: "C5", start: 9, length: 3, lane: 1 },
  { note: "F4", start: 12, length: 2, lane: 9 },
];

const playlistTracks = [
  { name: "DRUMS · Pato Gordo", color: "#62F2A5", blocks: [{ start: 0, span: 3, label: "Beat A" }, { start: 4, span: 3, label: "Beat B" }] },
  { name: "BASS · Maré Baixa", color: "#75B785", blocks: [{ start: 1, span: 2, label: "Low tide" }, { start: 4, span: 2, label: "Riptide" }] },
  { name: "VOZ · idea_07", color: "#72BE8F", blocks: [{ start: 3, span: 3, label: "voz principal" }] },
  { name: "ATMOS · chuva", color: "#8EBF93", blocks: [{ start: 0, span: 6, label: "textura" }] },
];

function ToolButton({ label, children, onClick, active = false, danger = false }: { label: string; children: React.ReactNode; onClick?: () => void; active?: boolean; danger?: boolean }) {
  return (
    <button className={`tool-button ${active ? "is-active" : ""} ${danger ? "is-danger" : ""}`} onClick={onClick} aria-label={label} title={label}>
      {children}
    </button>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("Patrón");
  const [tracks, setTracks] = useState(initialTracks);
  const [playing, setPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [bpm, setBpm] = useState(140);
  const [selectedLibrary, setSelectedLibrary] = useState("Pato Gordo Kit");
  const [search, setSearch] = useState("");
  const [muted, setMuted] = useState<string[]>([]);
  const [soloed, setSoloed] = useState<string[]>([]);
  const [showLibrary, setShowLibrary] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const ticker = window.setInterval(() => setPlayhead((step) => (step + 1) % 16), Math.max(70, 60000 / bpm / 4));
    return () => window.clearInterval(ticker);
  }, [bpm, playing]);

  const filteredLibrary = useMemo(() => {
    if (!search.trim()) return soundLibrary;
    const query = search.toLowerCase();
    return soundLibrary
      .map((group) => ({ ...group, entries: group.entries.filter((entry) => entry.toLowerCase().includes(query)) }))
      .filter((group) => group.entries.length > 0);
  }, [search]);

  function toggleStep(trackId: string, step: number) {
    setTracks((current) => current.map((track) => track.id === trackId
      ? { ...track, steps: track.steps.includes(step) ? track.steps.filter((item) => item !== step) : [...track.steps, step] }
      : track));
  }

  function toggleMute(id: string) {
    setMuted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function toggleSolo(id: string) {
    setSoloed((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function changeLevel(id: string, level: number) {
    setTracks((current) => current.map((track) => track.id === id ? { ...track, level } : track));
  }

  function toggleTransport() {
    setPlaying((current) => !current);
    toast(playing ? "Transporte detenido" : "Reproduciendo patrón de demostración");
  }

  function triggerPlaceholder(label: string) {
    toast(`${label} está disponible como interacción de demostración.`);
  }

  return (
    <div className="studio-shell">
      <header className="topbar">
        <StudioLogo compact={!showLibrary} />
        <div className="topbar__divider" />
        <div className="session-chip"><span className="session-chip__dot" /> SESIÓN / BEAT_140_DUCK</div>
        <div className="transport">
          <ToolButton label="Volver al inicio" onClick={() => { setPlayhead(0); setPlaying(false); }}><RotateCcw size={15} /></ToolButton>
          <ToolButton label={playing ? "Pausar" : "Reproducir"} active={playing} onClick={toggleTransport}>{playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}</ToolButton>
          <ToolButton label="Grabar" danger active={recording} onClick={() => { setRecording((active) => !active); toast(recording ? "Grabación cancelada" : "Armado de grabación activado"); }}><span className="record-dot" /></ToolButton>
          <div className="tempo-control"><button onClick={() => setBpm((value) => Math.max(50, value - 1))}>−</button><strong>{bpm}</strong><span>BPM</span><button onClick={() => setBpm((value) => Math.min(240, value + 1))}>+</button></div>
          <div className="time-display">01 : 01 : <span>{String(playhead + 1).padStart(2, "0")}</span></div>
        </div>
        <div className="topbar__spacer" />
        <div className="meter-pair" aria-label="Medidores de salida"><i style={{ height: playing ? "74%" : "20%" }} /><i style={{ height: playing ? "50%" : "15%" }} /></div>
        <ToolButton label="Guardar sesión" onClick={() => toast("Sesión guardada localmente en esta demostración.")}><Save size={15} /></ToolButton>
        <ToolButton label="Abrir ayuda" onClick={() => setHelpOpen(true)}><CircleHelp size={16} /></ToolButton>
      </header>

      <main className="studio-main">
        <aside className={`library ${showLibrary ? "" : "library--collapsed"}`}>
          <div className="library__head"><span><LibraryBig size={15} /> BIBLIOTECA</span><button onClick={() => setShowLibrary(false)} aria-label="Ocultar biblioteca"><PanelLeftClose size={15} /></button></div>
          <label className="library-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar sonidos" /></label>
          <div className="library__list">
            {filteredLibrary.map((group) => (
              <section key={group.section} className="library-group">
                <p>{group.section}</p>
                {group.entries.map((entry) => (
                  <button key={entry} className={`sound-item ${selectedLibrary === entry ? "is-selected" : ""}`} onClick={() => { setSelectedLibrary(entry); toast(`${entry} cargado en el rack.`); }}>
                    <span className="sound-item__icon">{entry.startsWith("Voz") ? <Mic2 size={13} /> : entry.startsWith("Keys") || entry.startsWith("Lead") || entry.startsWith("Pad") ? <Music2 size={13} /> : <AudioLines size={13} />}</span>
                    <span>{entry}</span><ChevronRight size={13} />
                  </button>
                ))}
              </section>
            ))}
          </div>
          <div className="library__footer"><button onClick={() => triggerPlaceholder("Importar audio")}><Plus size={14} /> Importar</button><button onClick={() => triggerPlaceholder("Organizar carpeta")}><FolderOpen size={14} /></button></div>
        </aside>

        {!showLibrary && <button className="library-reveal" onClick={() => setShowLibrary(true)} title="Mostrar biblioteca"><LibraryBig size={16} /></button>}

        <section className="workspace">
          <nav className="view-tabs" aria-label="Vistas de la sesión">
            {(["Patrón", "Piano roll", "Playlist", "Mixer", "Voz"] as View[]).map((tab) => (
              <button key={tab} className={view === tab ? "is-active" : ""} onClick={() => setView(tab)}>
                {tab === "Patrón" && <Command size={14} />}{tab === "Piano roll" && <Music2 size={14} />}{tab === "Playlist" && <Waves size={14} />}{tab === "Mixer" && <SlidersHorizontal size={14} />}{tab === "Voz" && <Mic2 size={14} />}{tab}
              </button>
            ))}
            <span className="view-tabs__spacer" />
            <span className="bar-label"><Radio size={13} /> MASTER −7.2 dB</span>
          </nav>

          <div className="workspace__head">
            <div><p className="eyebrow">CANAL SELECCIONADO</p><h1>{view === "Patrón" ? selectedLibrary : view}</h1></div>
            <div className="workspace__actions"><button className="quiet-action" onClick={() => triggerPlaceholder("Cambiar escala")}><Sparkles size={14} /> D minor</button><button className="quiet-action" onClick={() => triggerPlaceholder("Exportar sesión")}><Download size={14} /> Exportar</button></div>
          </div>

          <div className="workspace__canvas">
            {view === "Patrón" && (
              <div className="pattern-view">
                <div className="pattern-guide"><span>INSTRUMENTO</span>{Array.from({ length: 16 }, (_, index) => <span key={index} className={index % 4 === 0 ? "bar-start" : ""}>{String(index + 1).padStart(2, "0")}</span>)}</div>
                {tracks.map((track) => (
                  <div className={`pattern-row ${muted.includes(track.id) ? "is-muted" : ""}`} key={track.id}>
                    <div className="track-label"><i style={{ background: track.color }} /><div><strong>{track.name}</strong><span>{track.family}</span></div><button className={`track-toggle ${muted.includes(track.id) ? "is-on is-mute" : ""}`} onClick={() => toggleMute(track.id)}>M</button><button className={`track-toggle ${soloed.includes(track.id) ? "is-on is-solo" : ""}`} onClick={() => toggleSolo(track.id)}>S</button><input aria-label={`Volumen de ${track.name}`} type="range" min="0" max="100" value={track.level} onChange={(event) => changeLevel(track.id, Number(event.target.value))} /></div>
                    <div className="step-sequencer">{Array.from({ length: 16 }, (_, step) => <button key={step} className={`step ${track.steps.includes(step) ? "is-on" : ""} ${step === playhead && playing ? "is-current" : ""} ${step % 4 === 0 ? "bar-start" : ""}`} style={track.steps.includes(step) ? { backgroundColor: track.color } : undefined} onClick={() => toggleStep(track.id, step)} aria-label={`${track.name}, paso ${step + 1}`} />)}</div>
                  </div>
                ))}
                <div className="pattern-footer"><span><span className="signal-led" /> SEÑAL DE COMPÁS ESTABLE</span><button onClick={() => triggerPlaceholder("Crear variación")}><Plus size={14} /> Crear variación</button></div>
              </div>
            )}

            {view === "Piano roll" && (
              <div className="piano-roll">
                <div className="piano-toolbar"><span><Music2 size={14} /> MARÉ BAIXA · MIDI</span><button onClick={() => triggerPlaceholder("Cuantizar notas")}>Cuantizar 1/16</button><button onClick={() => triggerPlaceholder("Añadir nota")}><Plus size={14} /> Nota</button></div>
                <div className="piano-grid-wrap"><div className="piano-keys">{["C5", "B4", "A#4", "A4", "G#4", "G4", "F#4", "F4", "E4", "D#4", "D4", "C4"].map((key) => <span key={key} className={key.includes("#") ? "black-key" : "white-key"}>{key}</span>)}</div><div className="piano-grid">{Array.from({ length: 12 }, (_, lane) => <div key={lane} className="piano-lane" />)}{Array.from({ length: 16 }, (_, index) => <i key={index} className={`piano-line ${index % 4 === 0 ? "beat-line" : ""}`} style={{ left: `${index * 6.25}%` }} />)}<div className="piano-playhead" style={{ left: `${playhead * 6.25}%` }} />{pianoNotes.map((item, index) => <button key={`${item.note}-${index}`} className="piano-note" title={`${item.note}, paso ${item.start}`} style={{ left: `${item.start * 6.25 + 0.6}%`, width: `${item.length * 6.25 - 1.2}%`, top: `${item.lane * 8.333 + 1}%` }} onClick={() => toast(`Nota ${item.note} seleccionada.`)}>{item.note}</button>)}</div></div>
                <div className="piano-status"><span>CLIP: 1 · 4 BARRAS</span><span>ESCALA: D MENOR NATURAL</span><span>SWING: 8%</span></div>
              </div>
            )}

            {view === "Playlist" && (
              <div className="playlist-view">
                <div className="arrangement-ruler"><span>PISTAS</span>{Array.from({ length: 8 }, (_, index) => <span key={index}>{index + 1}</span>)}</div>
                {playlistTracks.map((track) => <div className="arrangement-row" key={track.name}><div className="arrangement-name"><i style={{ background: track.color }} /><span>{track.name}</span></div><div className="arrangement-lane">{Array.from({ length: 8 }, (_, index) => <i key={index} className={index % 2 === 0 ? "strong-grid" : ""} />)}{track.blocks.map((block) => <button key={block.label} className="arrangement-block" style={{ left: `${block.start * 12.5 + 0.6}%`, width: `${block.span * 12.5 - 1.2}%`, background: track.color }} onClick={() => toast(`Clip «${block.label}» seleccionado.`)}>{block.label}</button>)}<b className="arrangement-cursor" style={{ left: `${playhead * 6.25}%` }} /></div></div>)}
                <div className="arrangement-footer"><span><Waves size={14} /> IDEA: ESTRUCTURA — INTRO / DROP / RESPIRO</span><button onClick={() => triggerPlaceholder("Añadir sección")}><Plus size={14} /> Sección</button></div>
              </div>
            )}

            {view === "Mixer" && (
              <div className="mixer-view">{[...tracks, { id: "master", name: "MASTER", family: "OUT", color: "#62F2A5", level: 78, steps: [] }].map((channel, index) => <div className={`mixer-channel ${channel.id === "master" ? "mixer-channel--master" : ""}`} key={channel.id}><div className="channel-title"><i style={{ background: channel.color }} /><strong>{channel.name.split("·")[0]}</strong><span>{channel.family}</span></div><div className="channel-meter"><b style={{ height: playing ? `${Math.max(12, channel.level - index * 6)}%` : "8%" }} /><b style={{ height: playing ? `${Math.max(8, channel.level - 17 - index * 4)}%` : "5%" }} /></div><div className="fader-zone"><input aria-label={`Nivel de ${channel.name}`} className="vertical-fader" type="range" min="0" max="100" value={channel.level} onChange={(event) => channel.id !== "master" && changeLevel(channel.id, Number(event.target.value))} disabled={channel.id === "master"} /><span>{(channel.level / 10 - 10).toFixed(1)} dB</span></div><div className="mixer-controls">{channel.id !== "master" && <><button className={muted.includes(channel.id) ? "mute-on" : ""} onClick={() => toggleMute(channel.id)}>M</button><button className={soloed.includes(channel.id) ? "solo-on" : ""} onClick={() => toggleSolo(channel.id)}>S</button></>}<button onClick={() => triggerPlaceholder("Abrir inserciones")}><Settings2 size={13} /></button></div></div>)}</div>
            )}

            {view === "Voz" && (
              <div className="voice-view">
                <div className="voice-controls"><button className={`record-button ${recording ? "is-recording" : ""}`} onClick={() => { setRecording((value) => !value); toast(recording ? "Toma detenida" : "Toma vocal armada"); }}>{recording ? <Pause size={20} /> : <Mic2 size={20} />}</button><div><p className="eyebrow">VOICE LAB</p><h2>{recording ? "Escuchando la toma…" : "Captura una idea antes de que desaparezca."}</h2><span>Entrada: Duck Mic / 48 kHz · Modo: MONO</span></div><button className="input-select" onClick={() => triggerPlaceholder("Seleccionar entrada")}><Headphones size={14} /> Duck Mic <ChevronRight size={14} /></button></div>
                <div className="voice-wave"><img src="/manus-storage/duck-studio-waveform_072b7224.png" alt="Visualización abstracta de una forma de onda" /><div className="voice-wave__overlay">{Array.from({ length: 52 }, (_, index) => <i key={index} style={{ height: `${22 + ((index * 13) % 56)}%` }} />)}</div><b className="voice-playline" style={{ left: `${Math.max(6, playhead * 6.25)}%` }} /></div>
                <div className="voice-takes"><div className="take take--active"><span className="take-led" /><div><strong>idea_07 · toma 02</strong><small>00:14.8 · armada</small></div><button onClick={() => toast("Reproduciendo toma de demostración.")}><Play size={14} /></button></div><div className="take"><span className="take-led take-led--amber" /><div><strong>idea_07 · toma 01</strong><small>00:12.3 · archivada</small></div><button onClick={() => triggerPlaceholder("Abrir edición de toma")}><Settings2 size={14} /></button></div><div className="voice-note"><Sparkles size={15} /><span><b>Sugerencia de flujo:</b> graba una frase, marca el compás fuerte y duplica sólo lo que pide respuesta.</span></div></div>
              </div>
            )}
            <section className="control-deck" aria-label="Telemetría de sesión">
              <div className="deck-module deck-module--channels">
                <div className="deck-title"><span><Radio size={13} /> BUS DE SEÑAL</span><b>ESTABLE</b></div>
                <div className="channel-readouts">
                  {tracks.slice(0, 4).map((track, index) => <div key={track.id} className="channel-readout"><span><i style={{ background: track.color }} /> CH {String(index + 1).padStart(2, "0")}</span><b>{muted.includes(track.id) ? "−∞" : `${(track.level / 10 - 10).toFixed(1)}`}</b><em style={{ width: `${playing ? Math.max(12, track.level - index * 7) : 14}%` }} /></div>)}
                </div>
              </div>
              <div className="deck-module deck-module--scope">
                <div className="deck-title"><span><Waves size={13} /> OSCILOSCOPIO / MASTER</span><b>{playing ? "EN VIVO" : "EN ESPERA"}</b></div>
                <img src="/manus-storage/duck-studio-transport_25ff6538.png" alt="Superficie abstracta de un controlador de producción" />
                <div className="scope-trace" aria-hidden="true">{Array.from({ length: 62 }, (_, index) => <i key={index} style={{ height: `${16 + ((index * 17) % 70)}%` }} />)}</div>
                <div className="scope-scale"><span>−48</span><span>−24</span><span>−12</span><span>−6</span><span>0 dB</span></div>
              </div>
              <div className="deck-module deck-module--clock">
                <div className="deck-title"><span><Command size={13} /> PULSO</span><b>4 / 4</b></div>
                <strong>{String(playhead + 1).padStart(2, "0")}</strong><span className="clock-caption">PASO ACTIVO</span>
                <div className="clock-ticks">{Array.from({ length: 16 }, (_, index) => <i key={index} className={index === playhead ? "is-current" : ""} />)}</div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <footer className="statusbar"><span><i className="signal-led" /> AUDIO LOCAL</span><span>48 kHz / 24-bit</span><span><Command size={13} /> ESPACIO: reproducir · R: grabar</span><span className="statusbar__spacer" /><span>Duck, ¿qué beat es ese?</span></footer>

      {helpOpen && <div className="help-overlay" role="dialog" aria-modal="true" aria-label="Ayuda de Duck Studio Suite"><div className="help-card"><button className="help-close" onClick={() => setHelpOpen(false)} aria-label="Cerrar ayuda"><X size={18} /></button><div className="help-mark"><img src="/manus-storage/duck-studio-logo_8a973c67.png" alt="" /></div><p className="eyebrow">GUÍA RÁPIDA</p><h2>De la chispa al patrón.</h2><p>Duck Studio Suite organiza una idea rítmica como una sesión tangible. Activa pads en <b>Patrón</b>, dibuja una frase en <b>Piano roll</b>, acomoda clips en <b>Playlist</b> y controla niveles en <b>Mixer</b>.</p><div className="shortcut-table"><span><kbd>Espacio</kbd> Reproducir / pausar</span><span><kbd>R</kbd> Armar captura vocal</span><span><kbd>1–5</kbd> Cambiar vista</span></div><button className="help-cta" onClick={() => setHelpOpen(false)}>Entrar a la sesión <ChevronRight size={16} /></button></div></div>}
    </div>
  );
}
