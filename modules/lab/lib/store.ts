/**
 * Duck Lab - Application State Store
 * Armazenamento de Estado da Aplicação
 * 
 * Zustand store managing all application state for the Duck Lab DAW.
 * All UI-facing strings are in Portuguese.
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { getAudioEngine } from './audio-engine';
import type {
  TrackOptions,
  TransportState,
  TimeSignature,
  EffectParams,
} from './audio-engine';
import type {
  AssetCategory,
  AssetMetadata,
  AssetsLibrary,
  Genre,
  SearchOptions,
  SearchResult,
} from './assets-library';

// ============================================================================
// TYPE DEFINITIONS / DEFINIÇÕES DE TIPO
// ============================================================================

/** Track state in the store */
export interface TrackState {
  id: string;
  name: string;
  color: string;
  volume: number;        // 0.0 to 1.0
  pan: number;           // -1.0 to 1.0
  muted: boolean;
  solo: boolean;
  armed: boolean;        // Ready for recording
  selected: boolean;
  effects: EffectParams;
  clips: ClipState[];
}

/** Clip state on a track */
export interface ClipState {
  id: string;
  name: string;
  startTime: number;     // Position in seconds
  duration: number;      // Duration in seconds
  color: string;
  assetId?: string;      // Reference to library asset
  waveformUrl?: string;
}

/** Selection state */
export interface SelectionState {
  /** Selected track IDs */
  tracks: string[];
  /** Selected clip IDs */
  clips: string[];
  /** Start time of selection in seconds */
  startTime: number;
  /** End time of selection in seconds */
  endTime: number;
  /** Whether we're in selection mode */
  active: boolean;
}

/** Timeline view state */
export interface TimelineViewState {
  /** Zoom level (pixels per second) */
  zoomLevel: number;
  /** Horizontal scroll position in seconds */
  scrollPosition: number;
  /** Vertical offset for track scrolling */
  verticalOffset: number;
  /** Show grid lines */
  showGrid: boolean;
  /** Snap to grid enabled */
  snapEnabled: boolean;
  /** Grid size in beats */
  gridSize: number;
  /** Show time markers */
  showMarkers: boolean;
}

/** Panel visibility state */
export interface PanelsVisibility {
  /** Show mixer panel on right */
  mixer: boolean;
  /** Show asset browser at bottom */
  assetBrowser: boolean;
  /** Show transport controls (always visible but can be minimized) */
  transportExpanded: boolean;
  /** Show piano roll editor */
  pianoRoll: boolean;
  /** Show automation lanes */
  automation: boolean;
  /** Show master channel strip */
  masterStrip: boolean;
  /** Show metadata/info panel */
  infoPanel: boolean;
}

/** UI Theme configuration */
export interface ThemeConfig {
  /** Primary color (emerald green by default) */
  primaryColor: string;
  /** Accent color */
  accentColor: string;
  /** Background color */
  backgroundColor: string;
  /** Surface/panel color */
  surfaceColor: string;
  /** Text color */
  textColor: string;
  /** Waveform color */
  waveformColor: string;
  /** Grid color */
  gridColor: string;
  /** Use dark mode */
  darkMode: boolean;
}

/** Project information */
export interface ProjectInfo {
  /** Unique project ID */
  id: string;
  /** Display name */
  name: string;
  /** Description */
  description: string;
  /** Artist/creator name */
  artist: string;
  /** Creation date */
  createdAt: string;
  /** Last modified date */
  modifiedAt: string;
  /** Total duration in seconds */
  duration: number;
  /** Project tempo */
  bpm: number;
  /** Time signature */
  timeSignature: TimeSignature;
  /** Key of the project */
  key: string;
  /** Project genre */
  genre: Genre | null;
}

/** History entry for undo/redo */
export interface HistoryEntry {
  id: string;
  timestamp: number;
  action: string;
  description: string;
  previousState: Partial<DuckLabState>;
}

/** Notification/toast message */
export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

/** Complete application state */
export interface DuckLabState {
  // ==========================================================================
  // PROJECT STATE / ESTADO DO PROJETO
  // ==========================================================================
  project: ProjectInfo;
  
  // ==========================================================================
  // TRACKS STATE / ESTADO DAS FAIXAS
  // ==========================================================================
  tracks: TrackState[];
  selectedTrackId: string | null;
  
  // ==========================================================================
  // TRANSPORT STATE / ESTADO DO TRANSPORTE
  // ==========================================================================
  transportState: TransportState;
  currentTime: number;
  loopEnabled: boolean;
  loopStart: number;
  loopEnd: number;
  isMetronomeEnabled: boolean;
  countInEnabled: boolean;
  countInBeats: number;
  
  // ==========================================================================
  // TIMELINE VIEW / VISUALIZAÇÃO DA LINHA DO TEMPO
  // ==========================================================================
  timeline: TimelineViewState;
  
  // ==========================================================================
  // SELECTION / SELEÇÃO
  // ==========================================================================
  selection: SelectionState;
  
  // ==========================================================================
  // PANELS / PAINÉIS
  // ==========================================================================
  panels: PanelsVisibility;
  
  // ==========================================================================
  // THEME / TEMA
  // ==========================================================================
  theme: ThemeConfig;
  
  // ==========================================================================
  // ASSET BROWSER / NAVEGADOR DE ATIVOS
  // ==========================================================================
  assetBrowserSearch: SearchOptions;
  assetBrowserResults: SearchResult | null;
  assetBrowserSelectedAsset: AssetMetadata | null;
  assetBrowserFavorites: string[];
  
  // ==========================================================================
  // HISTORY / HISTÓRICO
  // ==========================================================================
  history: HistoryEntry[];
  historyIndex: number;
  maxHistorySize: number;
  
  // ==========================================================================
  // NOTIFICATIONS / NOTIFICAÇÕES
  // ==========================================================================
  notifications: NotificationMessage[];
  
  // ==========================================================================
  // UI STATE / ESTADO DA INTERFACE
  // ==========================================================================
  isLoading: boolean;
  isInitialized: boolean;
  sidebarOpen: boolean;
  contextMenu: {
    open: boolean;
    x: number;
    y: number;
    items: ContextMenuItem[];
  } | null;
  
  // ==========================================================================
  // MODAL STATES / ESTADOS DE MODAIS
  // ==========================================================================
  modals: {
    newProject: boolean;
    export: boolean;
    settings: boolean;
    about: boolean;
    keyboardShortcuts: boolean;
    trackSettings: string | null; // Track ID or null
  };
  
  // ==========================================================================
  // CLIPBOARD / ÁREA DE TRANSFERÊNCIA
  // ==========================================================================
  clipboard: {
    clips: ClipState[];
    tracks: TrackState[];
    type: 'copy' | 'cut';
  } | null;
}

/** Context menu item */
export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  action?: () => void;
  children?: ContextMenuItem[];
}

// ============================================================================
// ACTIONS / AÇÕES
// ============================================================================

/** Actions that can be performed on the state */
export interface DuckLabActions {
  // ==========================================================================
  // PROJECT ACTIONS / AÇÕES DO PROJETO
  // ==========================================================================
  createNewProject: (name?: string) => void;
  loadProject: (projectData: Partial<ProjectInfo>) => void;
  updateProject: (updates: Partial<ProjectInfo>) => void;
  setBPM: (bpm: number) => void;
  setTimeSignature: (beatsPerMeasure: number, beatUnit: number) => void;
  
  // ==========================================================================
  // TRACK ACTIONS / AÇÕES DE FAIXAS
  // ==========================================================================
  addTrack: (options?: Partial<TrackOptions>) => string;
  removeTrack: (trackId: string) => void;
  duplicateTrack: (trackId: string) => string;
  selectTrack: (trackId: string | null) => void;
  selectMultipleTracks: (trackIds: string[]) => void;
  updateTrack: (trackId: string, updates: Partial<TrackState>) => void;
  reorderTracks: (fromIndex: number, toIndex: number) => void;
  
  // ==========================================================================
  // TRACK PROPERTY ACTIONS / AÇÕES DE PROPRIEDADES DE FAIXA
  // ==========================================================================
  setTrackVolume: (trackId: string, volume: number) => void;
  setTrackPan: (trackId: string, pan: number) => void;
  toggleTrackMute: (trackId: string) => void;
  toggleTrackSolo: (trackId: string) => void;
  toggleTrackArm: (trackId: string) => void;
  setTrackEffects: (trackId: string, effects: EffectParams) => void;
  
  // ==========================================================================
  // CLIP ACTIONS / AÇÕES DE CLIPS
  // ==========================================================================
  addClip: (trackId: string, clip: Omit<ClipState, 'id'>) => string;
  removeClip: (trackId: string, clipId: string) => void;
  moveClip: (clipId: string, newStartTime: number, targetTrackId?: string) => void;
  resizeClip: (clipId: string, newDuration: number) => void;
  duplicateClip: (trackId: string, clipId: string) => string;
  selectClip: (clipId: string | null) => void;
  selectClips: (clipIds: string[]) => void;
  
  // ==========================================================================
  // TRANSPORT ACTIONS / AÇÕES DE TRANSPORTE
  // ==========================================================================
  play: () => void;
  pause: () => void;
  stop: () => void;
  togglePlayPause: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  setCurrentTime: (time: number) => void;
  setLoopEnabled: (enabled: boolean) => void;
  setLoopPoints: (start: number, end: number) => void;
  toggleLoop: () => void;
  toggleMetronome: () => void;
  toggleCountIn: () => void;
  
  // ==========================================================================
  // TIMELINE ACTIONS / AÇÕES DA LINHA DO TEMPO
  // ==========================================================================
  setZoomLevel: (level: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setScrollPosition: (position: number) => void;
  setShowGrid: (show: boolean) => void;
  setSnapEnabled: (enabled: boolean) => void;
  setGridSize: (size: number) => void;
  
  // ==========================================================================
  // SELECTION ACTIONS / AÇÕES DE SELEÇÃO
  // ==========================================================================
  clearSelection: () => void;
  selectAll: () => void;
  selectRange: (startTime: number, endTime: number) => void;
  deleteSelection: () => void;
  
  // ==========================================================================
  // PANEL ACTIONS / AÇÕES DE PAINÉIS
  // ==========================================================================
  togglePanel: (panel: keyof PanelsVisibility) => void;
  setPanels: (panels: Partial<PanelsVisibility>) => void;
  toggleSidebar: () => void;
  
  // ==========================================================================
  // THEME ACTIONS / AÇÕES DE TEMA
  // ==========================================================================
  setTheme: (theme: Partial<ThemeConfig>) => void;
  toggleDarkMode: () => void;
  
  // ==========================================================================
  // ASSET BROWSER ACTIONS / AÇÕES DO NAVEGADOR DE ATIVOS
  // ==========================================================================
  searchAssets: (options: SearchOptions) => void;
  setSelectedAsset: (asset: AssetMetadata | null) => void;
  addToFavorites: (assetId: string) => void;
  removeFromFavorites: (assetId: string) => void;
  clearSearch: () => void;
  
  // ==========================================================================
  // HISTORY ACTIONS / AÇÕES DE HISTÓRICO
  // ==========================================================================
  pushHistory: (action: string, description: string) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  
  // ==========================================================================
  // NOTIFICATION ACTIONS / AÇÕES DE NOTIFICAÇÃO
  // ==========================================================================
  addNotification: (notification: Omit<NotificationMessage, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // ==========================================================================
  // MODAL ACTIONS / AÇÕES DE MODAL
  // ==========================================================================
  openModal: (modal: keyof DuckLabState['modals'], data?: unknown) => void;
  closeModal: (modal: keyof DuckLabState['modals']) => void;
  closeAllModals: () => void;
  
  // ==========================================================================
  // CONTEXT MENU ACTIONS / AÇÕES DE MENU DE CONTEXTO
  // ==========================================================================
  openContextMenu: (x: number, y: number, items: ContextMenuItem[]) => void;
  closeContextMenu: () => void;
  
  // ==========================================================================
  // CLIPBOARD ACTIONS / AÇÕES DE ÁREA DE TRANSFERÊNCIA
  // ==========================================================================
  copy: () => void;
  cut: () => void;
  paste: () => void;
  
  // ==========================================================================
  // UTILITY ACTIONS / AÇÕES UTILITÁRIAS
  // ==========================================================================
  setLoading: (loading: boolean) => void;
  initialize: () => void;
  reset: () => void;
  getStateSnapshot: () => DuckLabState;
}

// ============================================================================
// DEFAULT VALUES / VALORES PADRÃO
// ============================================================================

const DEFAULT_PROJECT: ProjectInfo = {
  id: '',
  name: 'Projeto Sem Título',
  description: '',
  artist: '',
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
  duration: 0,
  bpm: 120,
  timeSignature: { beatsPerMeasure: 4, beatUnit: 4 },
  key: 'C',
  genre: null,
};

const DEFAULT_TIMELINE: TimelineViewState = {
  zoomLevel: 50, // pixels per second
  scrollPosition: 0,
  verticalOffset: 0,
  showGrid: true,
  snapEnabled: true,
  gridSize: 4, // Snap to beat (4 = quarter note)
  showMarkers: true,
};

const DEFAULT_PANELS: PanelsVisibility = {
  mixer: true,
  assetBrowser: false,
  transportExpanded: true,
  pianoRoll: false,
  automation: false,
  masterStrip: true,
  infoPanel: false,
};

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#10B981', // Emerald Green
  accentColor: '#34D399',
  backgroundColor: '#061A16',
  surfaceColor: '#0B2720',
  textColor: '#ECFDF5',
  waveformColor: '#34D399',
  gridColor: '#1F4D3D',
  darkMode: true,
};

const DEFAULT_SELECTION: SelectionState = {
  tracks: [],
  clips: [],
  startTime: 0,
  endTime: 0,
  active: false,
};

const DEFAULT_MODALS: DuckLabState['modals'] = {
  newProject: false,
  export: false,
  settings: false,
  about: false,
  keyboardShortcuts: false,
  trackSettings: null,
};

// ============================================================================
// HELPER FUNCTIONS / FUNÇÕES AUXILIARES
// ============================================================================

/** Generate unique ID */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/** Generate default track color from index */
function getTrackColor(index: number): string {
  const colors = [
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#8B5CF6', // Violet
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#6366F1', // Indigo
  ];
  return colors[index % colors.length];
}

/** Create a new track with defaults */
function createDefaultTrack(index: number, options?: Partial<TrackOptions>): TrackState {
  return {
    id: options?.id || generateId(),
    name: options?.name || `Faixa ${index + 1}`,
    color: (options as TrackState)?.color || getTrackColor(index),
    volume: options?.volume ?? 1.0,
    pan: options?.pan ?? 0,
    muted: options?.muted ?? false,
    solo: options?.solo ?? false,
    armed: options?.armed ?? false,
    selected: false,
    effects: {},
    clips: [],
  };
}

function applyTrackStateToEngine(track: TrackState): void {
  const engineTrack = getAudioEngine().getTrack(track.id);
  if (!engineTrack) return;

  engineTrack.setVolume(track.volume);
  engineTrack.setPan(track.pan);
  engineTrack.setMuted(track.muted);
  engineTrack.setSolo(track.solo);
  engineTrack.setArmed(track.armed);
  engineTrack.setEffects(track.effects);
}

async function prepareAudioEngine(tracks: TrackState[]) {
  const engine = getAudioEngine();

  if (!engine.getContext()) {
    await engine.initialize();
  }

  for (const track of tracks) {
    if (!engine.getTrack(track.id)) {
      engine.createTrack({
        id: track.id,
        name: track.name,
        color: track.color,
        volume: track.volume,
        pan: track.pan,
        muted: track.muted,
        solo: track.solo,
        armed: track.armed,
      });
    }
    applyTrackStateToEngine(track);
  }

  return engine;
}

// ============================================================================
// STORE CREATION / CRIAÇÃO DO STORE
// ============================================================================

type DuckLabStore = DuckLabState & DuckLabActions;

export const useDuckLabStore = create<DuckLabStore>()(
  devtools(
    persist(
      (set, get) => ({
        // ====================================================================
        // INITIAL STATE / ESTADO INICIAL
        // ====================================================================
        project: { ...DEFAULT_PROJECT },
        tracks: [],
        selectedTrackId: null,
        
        transportState: 'stopped',
        currentTime: 0,
        loopEnabled: false,
        loopStart: 0,
        loopEnd: 16, // Default 16 bars at 120 BPM
        isMetronomeEnabled: false,
        countInEnabled: false,
        countInBeats: 2,
        
        timeline: { ...DEFAULT_TIMELINE },
        selection: { ...DEFAULT_SELECTION },
        panels: { ...DEFAULT_PANELS },
        theme: { ...DEFAULT_THEME },
        
        assetBrowserSearch: {},
        assetBrowserResults: null,
        assetBrowserSelectedAsset: null,
        assetBrowserFavorites: [],
        
        history: [],
        historyIndex: -1,
        maxHistorySize: 50,
        
        notifications: [],
        
        isLoading: false,
        isInitialized: false,
        sidebarOpen: true,
        contextMenu: null,
        
        modals: { ...DEFAULT_MODALS },
        
        clipboard: null,

        // ====================================================================
        // PROJECT ACTIONS / AÇÕES DO PROJETO
        // ====================================================================
        createNewProject: (name?: string) => {
          const now = new Date().toISOString();
          set((state) => ({
            project: {
              ...DEFAULT_PROJECT,
              id: generateId(),
              name: name || 'Projeto Sem Título',
              createdAt: now,
              modifiedAt: now,
            },
            tracks: [],
            selectedTrackId: null,
            currentTime: 0,
            transportState: 'stopped',
          }));
          
          get().pushHistory('Novo Projeto', `Projeto "${name || 'Projeto Sem Título'}" criado`);
        },

        loadProject: (projectData) => {
          set((state) => ({
            project: { ...state.project, ...projectData, modifiedAt: new Date().toISOString() },
          }));
        },

        updateProject: (updates) => {
          set((state) => ({
            project: {
              ...state.project,
              ...updates,
              modifiedAt: new Date().toISOString(),
            },
          }));
        },

        setBPM: (bpm) => {
          const clampedBpm = Math.max(20, Math.min(300, bpm));
          getAudioEngine().setBPM(clampedBpm);
          set((state) => ({
            project: { ...state.project, bpm: clampedBpm },
          }));
          get().pushHistory('Alterar BPM', `BPM alterado para ${clampedBpm}`);
        },

        setTimeSignature: (beatsPerMeasure, beatUnit) => {
          const normalizedBeats = Math.max(1, Math.min(32, beatsPerMeasure));
          const normalizedUnit = Math.max(1, Math.min(32, beatUnit));
          getAudioEngine().setTimeSignature(normalizedBeats, normalizedUnit);
          set((state) => ({
            project: {
              ...state.project,
              timeSignature: {
                beatsPerMeasure: normalizedBeats,
                beatUnit: normalizedUnit,
              },
            },
          }));
        },

        // ====================================================================
        // TRACK ACTIONS / AÇÕES DE FAIXAS
        // ====================================================================
        addTrack: (options) => {
          const state = get();
          const newIndex = state.tracks.length;
          const newTrack = createDefaultTrack(newIndex, options);
          
          set((state) => ({
            tracks: [...state.tracks, newTrack],
            selectedTrackId: newTrack.id,
          }));

          const engine = getAudioEngine();
          if (engine.getContext() && !engine.getTrack(newTrack.id)) {
            engine.createTrack({
              id: newTrack.id,
              name: newTrack.name,
              color: newTrack.color,
              volume: newTrack.volume,
              pan: newTrack.pan,
              muted: newTrack.muted,
              solo: newTrack.solo,
              armed: newTrack.armed,
            });
          }
          applyTrackStateToEngine(newTrack);
          
          get().pushHistory('Adicionar Faixa', `Faixa "${newTrack.name}" adicionada`);
          return newTrack.id;
        },

        removeTrack: (trackId) => {
          const state = get();
          const track = state.tracks.find(t => t.id === trackId);
          
          set((state) => ({
            tracks: state.tracks.filter(t => t.id !== trackId),
            selectedTrackId: state.selectedTrackId === trackId ? null : state.selectedTrackId,
          }));
          getAudioEngine().removeTrack(trackId);
          
          if (track) {
            get().pushHistory('Remover Faixa', `Faixa "${track.name}" removida`);
          }
        },

        duplicateTrack: (trackId) => {
          const state = get();
          const trackIndex = state.tracks.findIndex(t => t.id === trackId);
          const track = state.tracks[trackIndex];
          
          if (!track) return '';
          
          const duplicatedTrack: TrackState = {
            ...track,
            id: generateId(),
            name: `${track.name} (cópia)`,
            clips: track.clips.map(clip => ({ ...clip, id: generateId() })),
          };
          
          const newTracks = [...state.tracks];
          newTracks.splice(trackIndex + 1, 0, duplicatedTrack);
          
          set({ tracks: newTracks });
          get().pushHistory('Duplicar Faixa', `Faixa "${track.name}" duplicada`);
          
          return duplicatedTrack.id;
        },

        selectTrack: (trackId) => {
          set((state) => ({
            selectedTrackId: trackId,
            tracks: state.tracks.map(t => ({
              ...t,
              selected: t.id === trackId,
            })),
          }));
        },

        selectMultipleTracks: (trackIds) => {
          set((state) => ({
            tracks: state.tracks.map(t => ({
              ...t,
              selected: trackIds.includes(t.id),
            })),
            selection: {
              ...state.selection,
              tracks: trackIds,
            },
          }));
        },

        updateTrack: (trackId, updates) => {
          const track = get().tracks.find((item) => item.id === trackId);
          if (!track) return;

          const updatedTrack = { ...track, ...updates };
          set((state) => ({
            tracks: state.tracks.map((item) =>
              item.id === trackId ? updatedTrack : item
            ),
          }));
          applyTrackStateToEngine(updatedTrack);
        },

        reorderTracks: (fromIndex, toIndex) => {
          set((state) => {
            const newTracks = [...state.tracks];
            const [movedTrack] = newTracks.splice(fromIndex, 1);
            newTracks.splice(toIndex, 0, movedTrack);
            return { tracks: newTracks };
          });
        },

        // ====================================================================
        // TRACK PROPERTY ACTIONS / AÇÕES DE PROPRIEDADES DE FAIXA
        // ====================================================================
        setTrackVolume: (trackId, volume) => {
          const clampedVolume = Math.max(0, Math.min(1, volume));
          get().updateTrack(trackId, { volume: clampedVolume });
        },

        setTrackPan: (trackId, pan) => {
          const clampedPan = Math.max(-1, Math.min(1, pan));
          get().updateTrack(trackId, { pan: clampedPan });
        },

        toggleTrackMute: (trackId) => {
          const state = get();
          const track = state.tracks.find(t => t.id === trackId);
          if (track) {
            get().updateTrack(trackId, { muted: !track.muted });
          }
        },

        toggleTrackSolo: (trackId) => {
          const state = get();
          const track = state.tracks.find(t => t.id === trackId);
          if (track) {
            get().updateTrack(trackId, { solo: !track.solo });
          }
        },

        toggleTrackArm: (trackId) => {
          const state = get();
          const track = state.tracks.find(t => t.id === trackId);
          if (track) {
            get().updateTrack(trackId, { armed: !track.armed });
          }
        },

        setTrackEffects: (trackId, effects) => {
          get().updateTrack(trackId, { effects });
        },

        // ====================================================================
        // CLIP ACTIONS / AÇÕES DE CLIPS
        // ====================================================================
        addClip: (trackId, clipData) => {
          const clipId = generateId();
          const clip: ClipState = {
            ...clipData,
            id: clipId,
          };

          set((state) => ({
            tracks: state.tracks.map(t =>
              t.id === trackId
                ? { ...t, clips: [...t.clips, clip].sort((a, b) => a.startTime - b.startTime) }
                : t
            ),
          }));

          get().pushHistory('Adicionar Clip', `Clip adicionado à faixa`);
          return clipId;
        },

        removeClip: (trackId, clipId) => {
          set((state) => ({
            tracks: state.tracks.map(t =>
              t.id === trackId
                ? { ...t, clips: t.clips.filter(c => c.id !== clipId) }
                : t
            ),
            selection: {
              ...state.selection,
              clips: state.selection.clips.filter(id => id !== clipId),
            },
          }));
          
          get().pushHistory('Remover Clip', 'Clip removido');
        },

        moveClip: (clipId, newStartTime, targetTrackId) => {
          set((state) => {
            let movedClip: ClipState | null = null;
            
            // Find and remove clip from current location
            const updatedTracks = state.tracks.map(t => {
              const clipIndex = t.clips.findIndex(c => c.id === clipId);
              if (clipIndex >= 0) {
                movedClip = { ...t.clips[clipIndex], startTime: newStartTime };
                return { ...t, clips: t.clips.filter(c => c.id !== clipId) };
              }
              return t;
            });

            // Add clip to target track (or same track)
            if (movedClip) {
              const destTrackId = targetTrackId || state.tracks.find(t => 
                t.clips.some(c => c.id === clipId)
              )?.id;
              
              if (destTrackId) {
                return {
                  tracks: updatedTracks.map(t =>
                    t.id === destTrackId
                      ? { ...t, clips: [...t.clips, movedClip!].sort((a, b) => a.startTime - b.startTime) }
                      : t
                  ),
                };
              }
            }

            return { tracks: updatedTracks };
          });

          get().pushHistory('Mover Clip', 'Clip movido');
        },

        resizeClip: (clipId, newDuration) => {
          set((state) => ({
            tracks: state.tracks.map(t => ({
              ...t,
              clips: t.clips.map(c =>
                c.id === clipId ? { ...c, duration: Math.max(0.1, newDuration) } : c
              ),
            })),
          }));
        },

        duplicateClip: (trackId, clipId) => {
          const state = get();
          const track = state.tracks.find(t => t.id === trackId);
          const clip = track?.clips.find(c => c.id === clipId);

          if (!clip) return '';

          const newClip: ClipState = {
            ...clip,
            id: generateId(),
            startTime: clip.startTime + clip.duration,
          };

          set((state) => ({
            tracks: state.tracks.map(t =>
              t.id === trackId
                ? { ...t, clips: [...t.clips, newClip].sort((a, b) => a.startTime - b.startTime) }
                : t
            ),
          }));

          get().pushHistory('Duplicar Clip', 'Clip duplicado');
          return newClip.id;
        },

        selectClip: (clipId) => {
          set((state) => ({
            selection: {
              ...state.selection,
              clips: clipId ? [clipId] : [],
              active: !!clipId,
            },
          }));
        },

        selectClips: (clipIds) => {
          set((state) => ({
            selection: {
              ...state.selection,
              clips: clipIds,
              active: clipIds.length > 0,
            },
          }));
        },

        // ====================================================================
        // TRANSPORT ACTIONS / AÇÕES DE TRANSPORTE
        // ====================================================================
        play: () => {
          void prepareAudioEngine(get().tracks)
            .then((engine) => {
              const state = get();
              engine.setBPM(state.project.bpm);
              engine.setLoopEnabled(state.loopEnabled);
              engine.setLoopPoints(state.loopStart, state.loopEnd);
              engine.setCurrentTime(state.currentTime);
              engine.play();
              set({ transportState: engine.getTransportState() });
            })
            .catch(() => {
              get().addNotification({
                type: 'error',
                title: 'Áudio indisponível',
                message: 'Não foi possível iniciar o motor de áudio. Verifique as permissões do navegador.',
              });
            });
        },

        pause: () => {
          const engine = getAudioEngine();
          engine.pause();
          set({ transportState: engine.getTransportState() });
        },

        stop: () => {
          const engine = getAudioEngine();
          engine.stop();
          set({
            transportState: engine.getTransportState(),
            currentTime: 0,
          });
        },

        togglePlayPause: () => {
          if (get().transportState === 'playing') {
            get().pause();
          } else {
            get().play();
          }
        },

        startRecording: () => {
          const armedTracks = get().tracks.filter((track) => track.armed);
          if (armedTracks.length === 0) {
            get().addNotification({
              type: 'warning',
              title: 'Nenhuma faixa armada',
              message: 'Arme ao menos uma faixa antes de iniciar a gravação.',
            });
            return;
          }

          void prepareAudioEngine(get().tracks)
            .then(async (engine) => {
              engine.setCurrentTime(0);
              await engine.startRecording();
              set({ transportState: engine.getTransportState(), currentTime: 0 });
              get().addNotification({
                type: 'info',
                title: 'Gravação iniciada',
                message: 'Gravando nas faixas armadas.',
              });
            })
            .catch(() => {
              get().addNotification({
                type: 'error',
                title: 'Gravação indisponível',
                message: 'Permita o acesso ao microfone e tente novamente.',
              });
            });
        },

        stopRecording: () => {
          const engine = getAudioEngine();
          const recordedBuffers = engine.stopRecording();
          set({ transportState: engine.getTransportState() });
          get().addNotification({
            type: recordedBuffers.size > 0 ? 'success' : 'warning',
            title: recordedBuffers.size > 0 ? 'Gravação finalizada' : 'Nenhum áudio capturado',
            message: recordedBuffers.size > 0
              ? 'A captura foi encerrada com sucesso.'
              : 'Nenhuma faixa recebeu áudio durante a gravação.',
          });
        },

        setCurrentTime: (time) => {
          const currentTime = Math.max(0, time);
          getAudioEngine().setCurrentTime(currentTime);
          set({ currentTime });
        },

        setLoopEnabled: (enabled) => {
          getAudioEngine().setLoopEnabled(enabled);
          set({ loopEnabled: enabled });
        },

        setLoopPoints: (start, end) => {
          const loopStart = Math.max(0, start);
          const loopEnd = Math.max(loopStart, end);
          getAudioEngine().setLoopPoints(loopStart, loopEnd);
          set({ loopStart, loopEnd });
        },

        toggleLoop: () => {
          const enabled = !get().loopEnabled;
          getAudioEngine().setLoopEnabled(enabled);
          set({ loopEnabled: enabled });
        },

        toggleMetronome: () => {
          set((state) => ({ isMetronomeEnabled: !state.isMetronomeEnabled }));
        },

        toggleCountIn: () => {
          set((state) => ({ countInEnabled: !state.countInEnabled }));
        },

        // ====================================================================
        // TIMELINE ACTIONS / AÇÕES DA LINHA DO TEMPO
        // ====================================================================
        setZoomLevel: (level) => {
          const clampedLevel = Math.max(5, Math.min(500, level));
          set((state) => ({
            timeline: { ...state.timeline, zoomLevel: clampedLevel },
          }));
        },

        zoomIn: () => {
          set((state) => ({
            timeline: {
              ...state.timeline,
              zoomLevel: Math.min(500, state.timeline.zoomLevel * 1.25),
            },
          }));
        },

        zoomOut: () => {
          set((state) => ({
            timeline: {
              ...state.timeline,
              zoomLevel: Math.max(5, state.timeline.zoomLevel * 0.8),
            },
          }));
        },

        resetZoom: () => {
          set((state) => ({
            timeline: { ...state.timeline, zoomLevel: DEFAULT_TIMELINE.zoomLevel },
          }));
        },

        setScrollPosition: (position) => {
          set((state) => ({
            timeline: { ...state.timeline, scrollPosition: Math.max(0, position) },
          }));
        },

        setShowGrid: (show) => {
          set((state) => ({
            timeline: { ...state.timeline, showGrid: show },
          }));
        },

        setSnapEnabled: (enabled) => {
          set((state) => ({
            timeline: { ...state.timeline, snapEnabled: enabled },
          }));
        },

        setGridSize: (size) => {
          set((state) => ({
            timeline: { ...state.timeline, gridSize: size },
          }));
        },

        // ====================================================================
        // SELECTION ACTIONS / AÇÕES DE SELEÇÃO
        // ====================================================================
        clearSelection: () => {
          set((state) => ({
            selection: { ...DEFAULT_SELECTION },
            tracks: state.tracks.map(t => ({ ...t, selected: false })),
            selectedTrackId: null,
          }));
        },

        selectAll: () => {
          set((state) => ({
            tracks: state.tracks.map(t => ({ ...t, selected: true })),
            selection: {
              tracks: state.tracks.map(t => t.id),
              clips: state.tracks.flatMap(t => t.clips.map(c => c.id)),
              startTime: 0,
              endTime: state.project.duration || 60,
              active: true,
            },
          }));
        },

        selectRange: (startTime, endTime) => {
          set((state) => ({
            selection: {
              ...state.selection,
              startTime: Math.min(startTime, endTime),
              endTime: Math.max(startTime, endTime),
              active: true,
            },
          }));
        },

        deleteSelection: () => {
          const state = get();
          const { clips: selectedClips } = state.selection;

          if (selectedClips.length > 0) {
            set((state) => ({
              tracks: state.tracks.map(t => ({
                ...t,
                clips: t.clips.filter(c => !selectedClips.includes(c.id)),
              })),
              selection: { ...DEFAULT_SELECTION },
            }));
            get().pushHistory('Excluir Seleção', 'Itens selecionados excluídos');
          }
        },

        // ====================================================================
        // PANEL ACTIONS / AÇÕES DE PAINÉIS
        // ====================================================================
        togglePanel: (panel) => {
          set((state) => ({
            panels: { ...state.panels, [panel]: !state.panels[panel] },
          }));
        },

        setPanels: (panels) => {
          set((state) => ({
            panels: { ...state.panels, ...panels },
          }));
        },

        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }));
        },

        // ====================================================================
        // THEME ACTIONS / AÇÕES DE TEMA
        // ====================================================================
        setTheme: (themeUpdates) => {
          set((state) => ({
            theme: { ...state.theme, ...themeUpdates },
          }));
        },

        toggleDarkMode: () => {
          set((state) => ({
            theme: {
              ...state.theme,
              darkMode: !state.theme.darkMode,
              backgroundColor: state.theme.darkMode ? '#FFFFFF' : '#1F2937',
              surfaceColor: state.theme.darkMode ? '#F9FAFB' : '#374151',
              textColor: state.theme.darkMode ? '#111827' : '#F9FAFB',
              gridColor: state.theme.darkMode ? '#E5E7EB' : '#4B5563',
            },
          }));
        },

        // ====================================================================
        // ASSET BROWSER ACTIONS / AÇÕES DO NAVEGADOR DE ATIVOS
        // ====================================================================
        searchAssets: async (options) => {
          set({ isLoading: true });
          
          try {
            // Import dynamically to avoid circular dependencies
            const { getAssetsLibrary } = await import('./assets-library');
            const library = getAssetsLibrary();
            
            if (!library.isInitialized()) {
              await library.initialize();
            }
            
            const results = library.search(options);
            
            set((state) => ({
              assetBrowserSearch: options,
              assetBrowserResults: results,
              isLoading: false,
            }));
          } catch (error) {
            console.error('Erro ao pesquisar ativos:', error);
            set({ isLoading: false });
            get().addNotification({
              type: 'error',
              title: 'Erro na Pesquisa',
              message: 'Não foi possível carregar os ativos.',
            });
          }
        },

        setSelectedAsset: (asset) => {
          set({ assetBrowserSelectedAsset: asset });
        },

        addToFavorites: (assetId) => {
          set((state) => ({
            assetBrowserFavorites: [...new Set([...state.assetBrowserFavorites, assetId])],
          }));
        },

        removeFromFavorites: (assetId) => {
          set((state) => ({
            assetBrowserFavorites: state.assetBrowserFavorites.filter(id => id !== assetId),
          }));
        },

        clearSearch: () => {
          set({
            assetBrowserSearch: {},
            assetBrowserResults: null,
            assetBrowserSelectedAsset: null,
          });
        },

        // ====================================================================
        // HISTORY ACTIONS / AÇÕES DE HISTÓRICO
        // ====================================================================
        pushHistory: (action, description) => {
          const state = get();
          const entry: HistoryEntry = {
            id: generateId(),
            timestamp: Date.now(),
            action,
            description,
            previousState: {},
          };

          // Trim future history if we're not at the end
          const newHistory = [
            ...state.history.slice(0, state.historyIndex + 1),
            entry,
          ].slice(-state.maxHistorySize);

          set({
            history: newHistory,
            historyIndex: newHistory.length - 1,
          });
        },

        undo: () => {
          const state = get();
          if (state.historyIndex <= 0) return;

          const newIndex = state.historyIndex - 1;
          set({ historyIndex: newIndex });
          
          get().addNotification({
            type: 'info',
            title: 'Desfazer',
            message: state.history[newIndex]?.description || 'Ação desfeita',
          });
        },

        redo: () => {
          const state = get();
          if (state.historyIndex >= state.history.length - 1) return;

          const newIndex = state.historyIndex + 1;
          set({ historyIndex: newIndex });
          
          get().addNotification({
            type: 'info',
            title: 'Refazer',
            message: state.history[newIndex]?.description || 'Ação refeita',
          });
        },

        clearHistory: () => {
          set({ history: [], historyIndex: -1 });
        },

        // ====================================================================
        // NOTIFICATION ACTIONS / AÇÕES DE NOTIFICAÇÃO
        // ====================================================================
        addNotification: (notification) => {
          const newNotification: NotificationMessage = {
            ...notification,
            id: generateId(),
            timestamp: Date.now(),
            duration: notification.duration || 5000,
          };

          set((state) => ({
            notifications: [...state.notifications, newNotification],
          }));

          // Auto-remove after duration
          if (newNotification.duration && newNotification.duration > 0) {
            setTimeout(() => {
              get().removeNotification(newNotification.id);
            }, newNotification.duration);
          }
        },

        removeNotification: (id) => {
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id),
          }));
        },

        clearNotifications: () => {
          set({ notifications: [] });
        },

        // ====================================================================
        // MODAL ACTIONS / AÇÕES DE MODAL
        // ====================================================================
        openModal: (modal) => {
          set((state) => ({
            modals: { ...state.modals, [modal]: true },
          }));
        },

        closeModal: (modal) => {
          set((state) => ({
            modals: { ...state.modals, [modal]: modal === 'trackSettings' ? null : false },
          }));
        },

        closeAllModals: () => {
          set({ modals: { ...DEFAULT_MODALS } });
        },

        // ====================================================================
        // CONTEXT MENU ACTIONS / AÇÕES DE MENU DE CONTEXTO
        // ====================================================================
        openContextMenu: (x, y, items) => {
          set({
            contextMenu: { open: true, x, y, items },
          });
        },

        closeContextMenu: () => {
          set({ contextMenu: null });
        },

        // ====================================================================
        // CLIPBOARD ACTIONS / AÇÕES DE ÁREA DE TRANSFERÊNCIA
        // ====================================================================
        copy: () => {
          const state = get();
          const selectedClips: ClipState[] = [];
          
          for (const track of state.tracks) {
            for (const clip of track.clips) {
              if (state.selection.clips.includes(clip.id)) {
                selectedClips.push({ ...clip });
              }
            }
          }

          if (selectedClips.length > 0) {
            set({
              clipboard: {
                clips: selectedClips,
                tracks: [],
                type: 'copy',
              },
            });
            get().addNotification({
              type: 'info',
              title: 'Copiar',
              message: `${selectedClips.length} clip(s) copiado(s)`,
            });
          }
        },

        cut: () => {
          const state = get();
          const selectedClips: ClipState[] = [];
          
          set((state) => ({
            tracks: state.tracks.map(t => ({
              ...t,
              clips: t.clips.filter(c => {
                if (state.selection.clips.includes(c.id)) {
                  selectedClips.push({ ...c });
                  return false;
                }
                return true;
              }),
            })),
            clipboard: {
              clips: selectedClips,
              tracks: [],
              type: 'cut',
            },
          }));

          if (selectedClips.length > 0) {
            get().pushHistory('Cortar', `${selectedClips.length} clip(s) cortado(s)`);
          }
        },

        paste: () => {
          const state = get();
          if (!state.clipboard?.clips.length) return;

          const trackId = state.selectedTrackId || state.tracks[0]?.id;
          if (!trackId) return;

          const pasteOffset = state.currentTime;

          set((state) => ({
            tracks: state.tracks.map(t => {
              if (t.id !== trackId) return t;

              const pastedClips = state.clipboard!.clips.map(clip => ({
                ...clip,
                id: generateId(),
                startTime: clip.startTime + pasteOffset,
              }));

              return {
                ...t,
                clips: [...t.clips, ...pastedClips].sort((a, b) => a.startTime - b.startTime),
              };
            }),
          }));

          get().pushHistory('Colar', `${state.clipboard.clips.length} clip(s) colado(s)`);
        },

        // ====================================================================
        // UTILITY ACTIONS / AÇÕES UTILITÁRIAS
        // ====================================================================
        setLoading: (loading) => {
          set({ isLoading: loading });
        },

        initialize: () => {
          set((state) => {
            if (state.isInitialized) return {};

            const tracks = state.tracks.length > 0
              ? state.tracks
              : [createDefaultTrack(0, { name: 'Faixa 1', color: '#10B981' })];

            return {
              isInitialized: true,
              tracks,
              selectedTrackId: state.selectedTrackId ?? tracks[0]?.id ?? null,
            };
          });
        },

        reset: () => {
          set({
            project: { ...DEFAULT_PROJECT, id: generateId(), createdAt: new Date().toISOString() },
            tracks: [],
            selectedTrackId: null,
            transportState: 'stopped',
            currentTime: 0,
            loopEnabled: false,
            history: [],
            historyIndex: -1,
            notifications: [],
            clipboard: null,
            contextMenu: null,
          });
        },

        getStateSnapshot: () => {
          return get();
        },
      }),
      {
        name: 'ducklab-storage',
        version: 1,
        partialize: (state) => ({
          project: state.project,
          tracks: state.tracks,
          theme: state.theme,
          panels: state.panels,
          timeline: state.timeline,
          assetBrowserFavorites: state.assetBrowserFavorites,
        }),
      }
    ),
    { name: 'DuckLabStore' }
  )
);

// ============================================================================
// SELECTORS / SELETORES
// ============================================================================

/** Get selected track */
export function useSelectedTrack() {
  return useDuckLabStore((state) =>
    state.tracks.find(t => t.id === state.selectedTrackId) || null
  );
}

/** Get all clips across all tracks */
export function useAllClips() {
  return useDuckLabStore((state) =>
    state.tracks.flatMap(t => t.clips.map(c => ({ ...c, trackId: t.id, trackName: t.name })))
  );
}

/** Get total project duration based on clips */
export function useProjectDuration() {
  return useDuckLabStore((state) => {
    let maxEnd = 0;
    for (const track of state.tracks) {
      for (const clip of track.clips) {
        const clipEnd = clip.startTime + clip.duration;
        if (clipEnd > maxEnd) maxEnd = clipEnd;
      }
    }
    return maxEnd || state.project.duration;
  });
}

/** Check if any track is soloed */
export function useHasSoloTrack() {
  return useDuckLabStore((state) => state.tracks.some(t => t.solo));
}

/** Get audible tracks (considering mute/solo) */
export function useAudibleTracks() {
  return useDuckLabStore((state) => {
    const hasSolo = state.tracks.some(t => t.solo);
    if (hasSolo) {
      return state.tracks.filter(t => t.solo && !t.muted);
    }
    return state.tracks.filter(t => !t.muted);
  });
}

/** Get armed tracks for recording */
export function useArmedTracks() {
  return useDuckLabStore((state) => state.tracks.filter(t => t.armed));
}

/** Format time display helper */
export function formatTimeDisplay(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

/** Format BPM display */
export function formatBPMDisplay(bpm: number): string {
  return `${Math.round(bpm)} BPM`;
}

/** Format time signature display */
export function formatTimeSignatureDisplay(ts: TimeSignature): string {
  return `${ts.beatsPerMeasure}/${ts.beatUnit}`;
}
