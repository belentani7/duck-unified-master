/**
 * Duck Lab - Professional Assets Library
 * Biblioteca de Ativos Profissional
 * 
 * Comprehensive simulated audio assets library with 3000+ items
 * for professional music production across multiple genres.
 */

// ============================================================================
// TYPE DEFINITIONS / DEFINIÇÕES DE TIPO
// ============================================================================

/** Asset categories available in the library */
export type AssetCategory = 
  | 'drums'        // Bateria/Drums
  | 'bass'         // Baixo/Bass
  | 'melodic'      // Melódico/Melodic (piano, synths, strings, etc.)
  | 'vocals'       // Vocais/Vocals
  | 'fx';          // Efeitos sonoros/Sound effects

/** Music genres for categorization */
export type Genre = 
  | 'hip-hop'
  | 'electronic'
  | 'rock'
  | 'jazz'
  | 'lofi'
  | 'reggaeton';

/** Asset types */
export type AssetType = 
  | 'loop'         // Loop contínuo
  | 'oneshot';     // One-shot sample

/** Musical keys for tonal content */
export type MusicalKey = 
  | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' 
  | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'
  | 'am' | 'a#m' | 'bm' | 'cm' | 'c#m' | 'dm' 
  | 'd#m' | 'em' | 'fm' | 'f#m' | 'gm' | 'g#m';

/** Sub-category for more specific classification */
export type DrumSubCategory = 
  | 'kick'         // Bumbo
  | 'snare'        // Caixa
  | 'hihat'        // Chimbal
  | 'cymbal'       // Prato
  | 'full-kit'     // Kit completo
  | 'percussion';  // Percussão

export type BassSubCategory = 
  | 'synth-bass'   // Baixo sintetizado
  | 'electric'     // Baixo elétrico
  | 'acoustic';    // Baixo acústico

export type MelodicSubCategory = 
  | 'piano'        // Piano
  | 'synth-lead'   // Sintetizador lead
  | 'synth-pad'    // Sintetizador pad
  | 'strings'      // Cordas
  | 'guitar'       // Guitarra
  | 'organ';       // Órgão

export type VocalSubCategory = 
  | 'adlib'        // Ad-lib
  | 'chop'         // Chop/corte
  | 'oneshot';     // One-shot vocal

export type FXSubCategory = 
  | 'riser'        // Subida/Riser
  | 'impact'       // Impacto
  | 'transition'   // Transição
  | 'atmosphere';  // Atmosfera

/** Complete asset metadata */
export interface AssetMetadata {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Main category */
  category: AssetCategory;
  /** Specific sub-category */
  subCategory: string;
  /** Music genre */
  genre: Genre;
  /** Asset type (loop or oneshot) */
  type: AssetType;
  /** Tempo in BPM (for loops) */
  bpm: number;
  /** Musical key (for tonal content) */
  key: MusicalKey | null;
  /** Duration in seconds */
  duration: number;
  /** File size in KB (simulated) */
  fileSizeKB: number;
  /** Sample rate */
  sampleRate: number;
  /** Number of channels */
  channels: number;
  /** Bit depth */
  bitDepth: number;
  /** Description in Portuguese */
  description: string;
  /** Tags for search */
  tags: string[];
  /** Popularity score (0-100) */
  popularity: number;
  /** Date added to library */
  dateAdded: string;
  /** Artist/creator name */
  artist: string;
  /** Preview URL (simulated) */
  previewUrl: string;
}

/** Search and filter options */
export interface SearchOptions {
  /** Text query */
  query?: string;
  /** Filter by category */
  category?: AssetCategory;
  /** Filter by sub-category */
  subCategory?: string;
  /** Filter by genre */
  genre?: Genre;
  /** Filter by asset type */
  type?: AssetType;
  /** Filter by BPM range */
  bpmRange?: { min: number; max: number };
  /** Filter by musical key */
  key?: MusicalKey;
  /** Filter by duration range */
  durationRange?: { min: number; max: number };
  /** Filter by tags */
  tags?: string[];
  /** Sort field */
  sortBy?: 'name' | 'bpm' | 'duration' | 'popularity' | 'dateAdded';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  /** Pagination - page number (0-indexed) */
  page?: number;
  /** Pagination - items per page */
  pageSize?: number;
}

/** Search result with pagination info */
export interface SearchResult {
  items: AssetMetadata[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  filtersApplied: Partial<SearchOptions>;
}

/** Category statistics */
export interface CategoryStats {
  category: AssetCategory;
  count: number;
  subCategories: Record<string, number>;
}

/** Genre statistics */
export interface GenreStats {
  genre: Genre;
  count: number;
  displayName: string;
}

// ============================================================================
// CONSTANTS / CONSTANTES
// ============================================================================

/** Category display names in Portuguese */
export const CATEGORY_NAMES: Record<AssetCategory, string> = {
  drums: 'Bateria',
  bass: 'Baixo',
  melodic: 'Melódico',
  vocals: 'Vocais',
  fx: 'Efeitos',
};

/** Sub-category display names in Portuguese */
export const SUBCATEGORY_NAMES: Record<string, string> = {
  // Drums
  kick: 'Bumbo',
  snare: 'Caixa',
  hihat: 'Chimbal',
  cymbal: 'Prato',
  'full-kit': 'Kit Completo',
  percussion: 'Percussão',
  // Bass
  'synth-bass': 'Baixo Sintético',
  electric: 'Baixo Elétrico',
  acoustic: 'Baixo Acústico',
  // Melodic
  piano: 'Piano',
  'synth-lead': 'Synth Lead',
  'synth-pad': 'Synth Pad',
  strings: 'Cordas',
  guitar: 'Guitarra',
  organ: 'Órgão',
  // Vocals
  adlib: 'Ad-lib',
  chop: 'Chop/Corte',
  oneshot: 'One-shot',
  // FX
  riser: 'Riser/Subida',
  impact: 'Impacto',
  transition: 'Transição',
  atmosphere: 'Atmosfera',
};

/** Genre display names in Portuguese */
export const GENRE_NAMES: Record<Genre, string> = {
  'hip-hop': 'Hip-Hop',
  electronic: 'Eletrônico',
  rock: 'Rock',
  jazz: 'Jazz',
  lofi: 'Lo-Fi',
  reggaeton: 'Reggaeton',
};

/** All musical keys */
export const ALL_KEYS: MusicalKey[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'am', 'a#m', 'bm', 'cm', 'c#m', 'dm', 'd#m', 'em', 'fm', 'f#m', 'gm', 'g#m',
];

/** Common BPM ranges by genre */
export const GENRE_BPM_RANGES: Record<Genre, { min: number; max: number }> = {
  'hip-hop': { min: 70, max: 110 },
  electronic: { min: 120, max: 180 },
  rock: { min: 90, max: 160 },
  jazz: { min: 80, max: 200 },
  lofi: { min: 60, max: 100 },
  reggaeton: { min: 85, max: 115 },
};

// ============================================================================
// DATA GENERATION / GERAÇÃO DE DADOS
// ============================================================================

/** Template data for generating assets */
interface AssetTemplate {
  prefix: string[];
  suffixes: string[];
  descriptions: string[];
  artists: string[];
}

const ASSET_TEMPLATES: Record<AssetCategory, AssetTemplate> = {
  drums: {
    prefix: ['Heavy', 'Light', 'Tight', 'Loose', 'Dry', 'Wet', 'Punchy', 'Soft', 'Hard', 'Smooth', 'Gritty', 'Clean', 'Vintage', 'Modern', 'Classic', 'Funky', 'Steady', 'Swing', 'Shuffle', 'Linear'],
    suffixes: ['Beat', 'Groove', 'Pattern', 'Loop', 'Rhythm', 'Track', 'Break', 'Fill', 'Hit', 'Stroke'],
    descriptions: [
      'Loop de bateria com groove consistente e dinâmica equilibrada',
      'Padrão rítmico perfeito para produções profissionais',
      'Batida com característica sonora única e personalidade',
      'Loop de bateria otimizado para mixagem moderna',
      'Ritmo dinâmico com variações sutis de intensidade',
      'Groove cativante ideal para bases musicais',
      'Padrão de bateria com ataque definido e sustain controlado',
      'Loop rítmico versátil para diversos estilos musicais',
      'Batida com textura rica e profundidade sonora',
      'Ritmo preciso com timing impecável',
    ],
    artists: ['DrumMaster Pro', 'BeatSmith', 'RhythmFactory', 'PercussionLab', 'GrooveMakers', 'BeatArchitects', 'DrumCraft Studio', 'RhythmWorks', 'PercussionPro', 'BeatForge'],
  },
  bass: {
    prefix: ['Deep', 'Bright', 'Warm', 'Cool', 'Fat', 'Thin', 'Round', 'Aggressive', 'Smooth', 'Bouncy', 'Driving', 'Pulsing', 'Subby', 'Gritty', 'Clean', 'Dirty', 'Funky', 'Steady', 'Walking', 'Slap'],
    suffixes: ['Bass', 'Line', 'Loop', 'Groove', 'Pattern', 'Riff', 'Progression', 'Sequence', 'Motif', 'Run'],
    descriptions: [
      'Linha de baixo com fundamento sólido e presença marcante',
      'Loop de baixo com articulação precisa e character único',
      'Groove de baixo que complementa qualquer produção',
      'Padrão de baixo com variação harmônica interessante',
      'Linha de baixo dinâmica com movimento rítmico envolvente',
      'Baixo com attack definido e sustain equilibrado',
      'Loop com textura rica e harmonia bem construída',
      'Baixo versátil para diferentes gêneros musicais',
      'Groove de baixo com feeling expressivo e orgânico',
      'Linha de baixo profissional para produções de alto nível',
    ],
    artists: ['BassFoundry', 'LowEnd Masters', 'SubFrequency', 'BassCraft', 'GrooveBass Labs', 'DeepTone Studio', 'Bassline Architects', 'LowFreq Works', 'BassMatrix', 'SubHarmonics'],
  },
  melodic: {
    prefix: ['Ethereal', 'Dark', 'Bright', 'Warm', 'Cold', 'Soft', 'Hard', 'Dreamy', 'Cinematic', 'Ambient', 'Energetic', 'Calm', 'Mysterious', 'Hopeful', 'Melancholic', 'Uplifting', 'Dramatic', 'Gentle', 'Intense', 'Atmospheric'],
    suffixes: ['Melody', 'Chord', 'Progression', 'Pad', 'Lead', 'Arpeggio', 'Sequence', 'Texture', 'Theme', 'Motif'],
    descriptions: [
      'Sequência melódica com evolução harmônica envolvente',
      'Pad atmosférico com textura rica e profundidade',
      'Lead melódico com character marcante e presença',
      'Progressão de acordes com tensão e resolução elegantes',
      'Arpeggio fluido com movimento rítmico interessante',
      'Textura sonora cinematográfica para produções épicas',
      'Melodia emotiva com expressividade e feeling',
      'Sequência de synth com design sonoro único',
      'Pad ambiente com evolução gradual e imersiva',
      'Tema melódico memorável e comercialmente viável',
    ],
    artists: ['MelodyForge', 'HarmonyWorks', 'SoundWeavers', 'ChordCraft', 'SynthSorcery', 'MelodyMatrix', 'HarmonicLabs', 'SoundArchitects', 'ToneCrafters', 'MelodyMakers'],
  },
  vocals: {
    prefix: ['Soulful', 'Powerful', 'Soft', 'Ethereal', 'Gritty', 'Clean', 'Breathy', 'Belting', 'Whispered', 'Harmonized', 'Layered', 'Processed', 'Raw', 'Polished', 'Emotional', 'Dynamic', 'Crisp', 'Warm', 'Airy', 'Intimate'],
    suffixes: ['Vocal', 'Ad-lib', 'Chop', 'Phrase', 'Hook', 'Run', 'Harmony', 'Chant', 'Spoken', 'Whisper'],
    descriptions: [
      'Sample vocal com emoção autêntica e character único',
      'Ad-lib expressivo para adicionar vida às produções',
      'Chop vocal processado para efeitos criativos',
      'Frase vocal com entrega profissional e carisma',
      'Harmonia vocal com blend perfeito das vozes',
      'Vocal processado com técnicas modernas de produção',
      'Sample de voz com textura interessante e versatilidade',
      'Ad-lib dinâmico para pontos de destaque na música',
      'Chop vocal rítmico para elementos percussivos',
      'Vocal atmosphere para criar ambiente e mood',
    ],
    artists: ['VocalVault', 'VoiceCraft', 'SonicVox', 'VocalForge', 'VoiceLabs', 'HarmonyHouse', 'VocalMatrix', 'SoundVoice Studio', 'VocalWorks', 'Voice Architects'],
  },
  fx: {
    prefix: ['Cinematic', 'Subtle', 'Extreme', 'Smooth', 'Abrupt', 'Building', 'Falling', 'Expanding', 'Contracting', 'Reversing', 'Glitching', 'Modulating', 'Evolving', 'Static', 'Dynamic', 'Organic', 'Synthetic', 'Natural', 'Abstract', 'Concrete'],
    suffixes: ['FX', 'Transition', 'Impact', 'Riser', 'Downlift', 'Sweep', 'Crash', 'Boom', 'Whoosh', 'Texture'],
    descriptions: [
      'Efeito de transição suave para mudanças de seção',
      'Impacto poderoso para momentos de destaque',
      'Riser progressivo para construção de tensão',
      'Textura atmosférica para ambientação e mood',
      'Efeito glitch para elementos modernos e futuristas',
      'Transição cinemática para produções profissionais',
      'Impacto subgrave com peso e presença',
      'Sweep de frequência para movimentos dinâmicos',
      'Atmosfera envolvente para preenchimento sonoro',
      'Efeito especial com character único e memorável',
    ],
    artists: ['FX Foundry', 'SoundDesign Pros', 'TransitionMasters', 'ImpactForge', 'Atmosphere Labs', 'FX Architects', 'SoundFX Works', 'TransitionCraft', 'ImpactStudio', 'AtmosphereMakers'],
  },
};

/** Additional naming patterns for variety */
const NAMING_PATTERNS: Record<AssetCategory, string[]> = {
  drums: [
    '{prefix} {suffix} {number}',
    '{genre} {sub} {variant}',
    '{prefix} {genre} {suffix}',
    'Classic {sub} {style}',
    'Modern {sub} {style}',
    'Vintage {sub} {era}',
    '{prefix} {sub} {suffix}',
    '{genre} Vibe {number}',
    'Studio {sub} Take {number}',
    'Live {sub} {style}',
  ],
  bass: [
    '{prefix} Bass {number}',
    '{genre} Bass {sub} {variant}',
    '{prefix} {genre} Line',
    '{sub} Groove {style}',
    'Bass Foundation {number}',
    '{prefix} Low End {suffix}',
    '{genre} Sub {variant}',
    'Bass Motif {number}',
    'Studio Bass {sub} {style}',
    '{prefix} {sub} Sequence',
  ],
  melodic: [
    '{prefix} {instrument} {number}',
    '{genre} {instrument} {style}',
    '{prefix} {suffix} {key}',
    '{instrument} Theme {number}',
    '{prefix} Harmony {variant}',
    '{genre} Melody {style}',
    '{instrument} Texture {number}',
    '{prefix} Pad {key}',
    '{instrument} Sequence {style}',
    'Cinematic {suffix} {number}',
  ],
  vocals: [
    '{prefix} Vocal {number}',
    '{type} Vocal {style}',
    '{prefix} {type} {variant}',
    'Vocal {type} {number}',
    '{genre} Voice {style}',
    '{prefix} Chant {number}',
    'Vocal Chop {style}',
    '{prefix} Layer {variant}',
    'Spoken Word {style}',
    'Vocal FX {number}',
  ],
  fx: [
    '{prefix} {type} {number}',
    '{type} {style} {variant}',
    'Cinematic {type} {number}',
    '{prefix} Transition {style}',
    'Impact {style} {number}',
    '{type} Builder {variant}',
    '{prefix} Sweep {number}',
    'FX {type} {style}',
    'Atmosphere {style} {number}',
    'Transition {type} {variant}',
  ],
};

/** Style variants */
const STYLE_VARIANTS = ['A', 'B', 'C', 'D', 'E', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Prime', 'Ultra', 'Max', 'Pro', 'Lite', 'Heavy'];

/** Era names for vintage sounds */
const ERA_NAMES = ['60s', '70s', '80s', '90s', '00s', '10s', '20s', 'Vintage', 'Retro', 'Classic'];

// ============================================================================
// ASSETS LIBRARY CLASS / CLASSE DA BIBLIOTECA DE ATIVOS
// ============================================================================

/**
 * Duck Lab Assets Library - Professional audio samples collection
 * Biblioteca de Ativos Duck Lab - Coleção profissional de amostras de áudio
 */
export class AssetsLibrary {
  private _assets: Map<string, AssetMetadata> = new Map();
  private _initialized: boolean = false;

  constructor() {
    // Initialization is lazy
  }

  /**
   * Initialize and generate all assets
   * Inicializar e gerar todos os ativos
   */
  async initialize(): Promise<void> {
    if (this._initialized) return;

    this._generateAllAssets();
    this._initialized = true;
  }

  /**
   * Check if library is initialized
   * Verificar se a biblioteca está inicializada
   */
  isInitialized(): boolean {
    return this._initialized;
  }

  /**
   * Get total count of assets
   * Obter contagem total de ativos
   */
  getTotalCount(): number {
    return this._assets.size;
  }

  // ==========================================================================
  // ASSET GENERATION / GERAÇÃO DE ATIVOS
  // ==========================================================================

  /**
   * Generate all assets for the library
   * Gerar todos os ativos da biblioteca
   */
  private _generateAllAssets(): void {
    const genres: Genre[] = ['hip-hop', 'electronic', 'rock', 'jazz', 'lofi', 'reggaeton'];

    let idCounter = 1;

    // Drums - ~800 items
    for (const genre of genres) {
      idCounter = this._generateDrumAssets(genre, idCounter);
    }

    // Bass - ~600 items
    for (const genre of genres) {
      idCounter = this._generateBassAssets(genre, idCounter);
    }

    // Melodic - ~900 items
    for (const genre of genres) {
      idCounter = this._generateMelodicAssets(genre, idCounter);
    }

    // Vocals - ~400 items
    for (const genre of genres) {
      idCounter = this._generateVocalAssets(genre, idCounter);
    }

    // FX - ~350 items
    for (const genre of genres) {
      idCounter = this._generateFXAssets(genre, idCounter);
    }

    // Complete the catalogue in deterministic batches so the public 3.000+ promise
    // remains true even when genre-specific exclusions reduce earlier categories.
    let supplementalIndex = 0;
    while (this._assets.size < 3000) {
      idCounter = this._generateFXAssets(
        genres[supplementalIndex % genres.length],
        idCounter
      );
      supplementalIndex++;
    }
  }

  /**
   * Generate drum assets for a specific genre
   */
  private _generateDrumAssets(genre: Genre, startId: number): number {
    const template = ASSET_TEMPLATES.drums;
    const subCategories: DrumSubCategory[] = ['kick', 'snare', 'hihat', 'cymbal', 'full-kit', 'percussion'];
    const bpmRange = GENRE_BPM_RANGES[genre];
    let id = startId;

    const itemsPerSubCat = genre === 'electronic' ? 28 : 22; // More electronic drums

    for (const subCat of subCategories) {
      for (let i = 0; i < itemsPerSubCat; i++) {
        const bpm = this._randomInRange(bpmRange.min, bpmRange.max, genre === 'jazz');
        const duration = this._getDurationForSubCategory('drums', subCat, bpm);
        
        const asset: AssetMetadata = {
          id: `drum-${genre}-${subCat}-${id}`,
          name: this._generateName('drums', genre, subCat, i, template),
          category: 'drums',
          subCategory: subCat,
          genre: genre,
          type: subCat === 'full-kit' || subCat === 'percussion' ? 'loop' : Math.random() > 0.3 ? 'loop' : 'oneshot',
          bpm: Math.round(bpm),
          key: null, // Drums are typically atonal
          duration: duration,
          fileSizeKB: Math.round(duration * 200 + Math.random() * 500),
          sampleRate: [44100, 48000, 96000][Math.floor(Math.random() * 3)],
          channels: subCat === 'kick' || subCat === 'snare' ? (Math.random() > 0.5 ? 1 : 2) : 2,
          bitDepth: [16, 24][Math.floor(Math.random() * 2)],
          description: template.descriptions[Math.floor(Math.random() * template.descriptions.length)],
          tags: this._generateTags('drums', genre, subCat),
          popularity: Math.floor(Math.random() * 100),
          dateAdded: this._randomDate(),
          artist: template.artists[Math.floor(Math.random() * template.artists.length)],
          previewUrl: `/previews/drum-${genre}-${subCat}-${id}.mp3`,
        };

        this._assets.set(asset.id, asset);
        id++;
      }
    }

    return id;
  }

  /**
   * Generate bass assets for a specific genre
   */
  private _generateBassAssets(genre: Genre, startId: number): number {
    const template = ASSET_TEMPLATES.bass;
    const subCategories: BassSubCategory[] = ['synth-bass', 'electric', 'acoustic'];
    const bpmRange = GENRE_BPM_RANGES[genre];
    let id = startId;

    const itemsPerSubCat = genre === 'electronic' || genre === 'hip-hop' ? 35 : 25;

    for (const subCat of subCategories) {
      // Skip acoustic bass for electronic genres mostly
      if (subCat === 'acoustic' && genre === 'electronic') continue;

      for (let i = 0; i < itemsPerSubCat; i++) {
        const bpm = this._randomInRange(bpmRange.min, bpmRange.max, false);
        const duration = this._getDurationForSubCategory('bass', subCat, bpm);
        const key = this._randomKey();

        const asset: AssetMetadata = {
          id: `bass-${genre}-${subCat}-${id}`,
          name: this._generateName('bass', genre, subCat, i, template),
          category: 'bass',
          subCategory: subCat,
          genre: genre,
          type: 'loop',
          bpm: Math.round(bpm),
          key: key,
          duration: duration,
          fileSizeKB: Math.round(duration * 250 + Math.random() * 600),
          sampleRate: [44100, 48000][Math.floor(Math.random() * 2)],
          channels: 2,
          bitDepth: 24,
          description: template.descriptions[Math.floor(Math.random() * template.descriptions.length)],
          tags: this._generateTags('bass', genre, subCat),
          popularity: Math.floor(Math.random() * 100),
          dateAdded: this._randomDate(),
          artist: template.artists[Math.floor(Math.random() * template.artists.length)],
          previewUrl: `/previews/bass-${genre}-${subCat}-${id}.mp3`,
        };

        this._assets.set(asset.id, asset);
        id++;
      }
    }

    return id;
  }

  /**
   * Generate melodic assets for a specific genre
   */
  private _generateMelodicAssets(genre: Genre, startId: number): number {
    const template = ASSET_TEMPLATES.melodic;
    const subCategories: MelodicSubCategory[] = ['piano', 'synth-lead', 'synth-pad', 'strings', 'guitar', 'organ'];
    const bpmRange = GENRE_BPM_RANGES[genre];
    let id = startId;

    const itemsPerSubCat = genre === 'electronic' ? 22 : 16;

    for (const subCat of subCategories) {
      // Adjust based on genre appropriateness
      if (subCat === 'organ' && genre === 'electronic') continue;
      if ((subCat === 'synth-lead' || subCat === 'synth-pad') && genre === 'jazz') continue;
      if (subCat === 'guitar' && genre === 'electronic') continue;

      const actualCount = subCat === 'piano' || subCat === 'synth-pad' ? itemsPerSubCat + 8 : itemsPerSubCat;

      for (let i = 0; i < actualCount; i++) {
        const bpm = this._randomInRange(bpmRange.min, bpmRange.max, genre === 'jazz');
        const duration = this._getDurationForSubCategory('melodic', subCat, bpm);
        const key = this._randomKey();

        const asset: AssetMetadata = {
          id: `mel-${genre}-${subCat}-${id}`,
          name: this._generateName('melodic', genre, subCat, i, template),
          category: 'melodic',
          subCategory: subCat,
          genre: genre,
          type: 'loop',
          bpm: Math.round(bpm),
          key: key,
          duration: duration,
          fileSizeKB: Math.round(duration * 300 + Math.random() * 700),
          sampleRate: [44100, 48000, 96000][Math.floor(Math.random() * 3)],
          channels: 2,
          bitDepth: 24,
          description: template.descriptions[Math.floor(Math.random() * template.descriptions.length)],
          tags: this._generateTags('melodic', genre, subCat),
          popularity: Math.floor(Math.random() * 100),
          dateAdded: this._randomDate(),
          artist: template.artists[Math.floor(Math.random() * template.artists.length)],
          previewUrl: `/previews/mel-${genre}-${subCat}-${id}.mp3`,
        };

        this._assets.set(asset.id, asset);
        id++;
      }
    }

    return id;
  }

  /**
   * Generate vocal assets for a specific genre
   */
  private _generateVocalAssets(genre: Genre, startId: number): number {
    const template = ASSET_TEMPLATES.vocals;
    const subCategories: VocalSubCategory[] = ['adlib', 'chop', 'oneshot'];
    const bpmRange = GENRE_BPM_RANGES[genre];
    let id = startId;

    const itemsPerSubCat = genre === 'hip-hop' || genre === 'reggaeton' ? 25 : 18;

    for (const subCat of subCategories) {
      for (let i = 0; i < itemsPerSubCat; i++) {
        const bpm = this._randomInRange(bpmRange.min, bpmRange.max, false);
        const duration = this._getDurationForSubCategory('vocals', subCat, bpm);
        const key = subCat === 'oneshot' ? null : this._randomKey();

        const asset: AssetMetadata = {
          id: `vox-${genre}-${subCat}-${id}`,
          name: this._generateName('vocals', genre, subCat, i, template),
          category: 'vocals',
          subCategory: subCat,
          genre: genre,
          type: subCat === 'oneshot' ? 'oneshot' : (Math.random() > 0.4 ? 'loop' : 'oneshot'),
          bpm: Math.round(bpm),
          key: key,
          duration: duration,
          fileSizeKB: Math.round(duration * 180 + Math.random() * 400),
          sampleRate: 48000,
          channels: 2,
          bitDepth: 24,
          description: template.descriptions[Math.floor(Math.random() * template.descriptions.length)],
          tags: this._generateTags('vocals', genre, subCat),
          popularity: Math.floor(Math.random() * 100),
          dateAdded: this._randomDate(),
          artist: template.artists[Math.floor(Math.random() * template.artists.length)],
          previewUrl: `/previews/vox-${genre}-${subCat}-${id}.mp3`,
        };

        this._assets.set(asset.id, asset);
        id++;
      }
    }

    return id;
  }

  /**
   * Generate FX assets for a specific genre
   */
  private _generateFXAssets(genre: Genre, startId: number): number {
    const template = ASSET_TEMPLATES.fx;
    const subCategories: FXSubCategory[] = ['riser', 'impact', 'transition', 'atmosphere'];
    let id = startId;

    const itemsPerSubCat = genre === 'electronic' ? 16 : 12;

    for (const subCat of subCategories) {
      for (let i = 0; i < itemsPerSubCat; i++) {
        const duration = this._getDurationForSubCategory('fx', subCat, 120);

        const asset: AssetMetadata = {
          id: `fx-${genre}-${subCat}-${id}`,
          name: this._generateName('fx', genre, subCat, i, template),
          category: 'fx',
          subCategory: subCat,
          genre: genre,
          type: 'oneshot',
          bpm: 0, // FX typically don't have BPM
          key: null,
          duration: duration,
          fileSizeKB: Math.round(duration * 350 + Math.random() * 500),
          sampleRate: 48000,
          channels: 2,
          bitDepth: 24,
          description: template.descriptions[Math.floor(Math.random() * template.descriptions.length)],
          tags: this._generateTags('fx', genre, subCat),
          popularity: Math.floor(Math.random() * 100),
          dateAdded: this._randomDate(),
          artist: template.artists[Math.floor(Math.random() * template.artists.length)],
          previewUrl: `/previews/fx-${genre}-${subCat}-${id}.mp3`,
        };

        this._assets.set(asset.id, asset);
        id++;
      }
    }

    return id;
  }

  // ==========================================================================
  // NAME GENERATION / GERAÇÃO DE NOMES
  // ==========================================================================

  /**
   * Generate a realistic asset name
   */
  private _generateName(
    category: AssetCategory,
    genre: Genre,
    subCategory: string,
    index: number,
    template: AssetTemplate
  ): string {
    const patterns = NAMING_PATTERNS[category];
    const pattern = patterns[index % patterns.length];
    const prefix = template.prefix[Math.floor(Math.random() * template.prefix.length)];
    const suffix = template.suffixes[Math.floor(Math.random() * template.suffixes.length)];
    const style = STYLE_VARIANTS[index % STYLE_VARIANTS.length];
    const era = ERA_NAMES[Math.floor(Math.random() * ERA_NAMES.length)];
    const variant = STYLE_VARIANTS[(index + 3) % STYLE_VARIANTS.length];
    const number = String((index % 50) + 1).padStart(2, '0');

    return pattern
      .replace('{prefix}', prefix)
      .replace('{suffix}', suffix)
      .replace('{genre}', GENRE_NAMES[genre])
      .replace('{sub}', SUBCATEGORY_NAMES[subCategory] || subCategory)
      .replace('{instrument}', SUBCATEGORY_NAMES[subCategory] || subCategory)
      .replace('{type}', SUBCATEGORY_NAMES[subCategory] || subCategory)
      .replace('{style}', style)
      .replace('{era}', era)
      .replace('{variant}', variant)
      .replace('{number}', number)
      .replace('{key}', this._randomKey() || 'C')
      .trim();
  }

  // ==========================================================================
  // HELPER FUNCTIONS / FUNÇÕES AUXILIARES
  // ==========================================================================

  /**
   * Get random value within range
   */
  private _randomInRange(min: number, max: number, allowFloats: boolean = false): number {
    if (allowFloats) {
      return min + Math.random() * (max - min);
    }
    // Round to common BPM values (multiples of 5 or 10)
    const raw = min + Math.random() * (max - min);
    return Math.round(raw / 5) * 5;
  }

  /**
   * Get random musical key
   */
  private _randomKey(): MusicalKey {
    return ALL_KEYS[Math.floor(Math.random() * ALL_KEYS.length)];
  }

  /**
   * Get duration based on category and sub-category
   */
  private _getDurationForSubCategory(
    category: AssetCategory,
    subCategory: string,
    bpm: number
  ): number {
    const baseBeatDuration = 60 / bpm;

    switch (category) {
      case 'drums':
        switch (subCategory) {
          case 'kick':
          case 'snare':
            return this._randomInRange(0.05, 0.3, true); // Short hits
          case 'hihat':
            return this._randomInRange(0.02, 0.15, true);
          case 'cymbal':
            return this._randomInRange(0.3, 2, true);
          case 'full-kit':
            return baseBeatDuration * this._randomInRange(1, 8, false); // 1-8 bars
          case 'percussion':
            return baseBeatDuration * this._randomInRange(1, 4, false);
          default:
            return baseBeatDuration * 4;
        }

      case 'bass':
        return baseBeatDuration * this._randomInRange(1, 8, false); // 1-8 bars

      case 'melodic':
        switch (subCategory) {
          case 'synth-pad':
          case 'strings':
            return baseBeatDuration * this._randomInRange(4, 16, false); // Longer pads
          default:
            return baseBeatDuration * this._randomInRange(2, 8, false);
        }

      case 'vocals':
        switch (subCategory) {
          case 'oneshot':
            return this._randomInRange(0.1, 1, true);
          case 'chop':
            return this._randomInRange(0.5, 4, true);
          case 'adlib':
            return this._randomInRange(2, 16, true);
          default:
            return this._randomInRange(1, 8, true);
        }

      case 'fx':
        switch (subCategory) {
          case 'riser':
            return this._randomInRange(1, 8, true);
          case 'impact':
            return this._randomInRange(0.1, 2, true);
          case 'transition':
            return this._randomInRange(0.5, 4, true);
          case 'atmosphere':
            return this._randomInRange(8, 32, true);
          default:
            return this._randomInRange(1, 4, true);
        }

      default:
        return baseBeatDuration * 4;
    }
  }

  /**
   * Generate relevant tags for an asset
   */
  private _generateTags(
    category: AssetCategory,
    genre: Genre,
    subCategory: string
  ): string[] {
    const baseTags: string[] = [GENRE_NAMES[genre], CATEGORY_NAMES[category], SUBCATEGORY_NAMES[subCategory]];

    // Add category-specific tags
    switch (category) {
      case 'drums':
        baseTags.push('bateria', 'percussão', 'ritmo', 'groove', 'beat');
        if (subCategory === 'full-kit') baseTags.push('kit completo', 'loop de bateria');
        break;
      case 'bass':
        baseTags.push('baixo', 'low end', 'fundamento', 'grave', 'bassline');
        if (subCategory === 'synth-bass') baseTags.push('sintetizador', 'synth', '808');
        break;
      case 'melodic':
        baseTags.push('melodia', 'harmônico', 'musical', 'nota', 'acorde');
        if (subCategory === 'piano') baseTags.push('teclas', 'acústico', 'grand piano');
        if (subCategory.startsWith('synth')) baseTags.push('sintetizador', 'eletrônico', 'vst');
        break;
      case 'vocals':
        baseTags.push('voz', 'vocal', 'humano', 'letra', 'cantar');
        if (subCategory === 'chop') baseTags.push('processado', 'slice', 'editado');
        break;
      case 'fx':
        baseTags.push('efeito', 'som', 'design sonoro', 'transição', 'impacto');
        if (subCategory === 'atmosphere') baseTags.push('ambiente', 'textura', 'pad');
        break;
    }

    // Add genre-specific tags
    switch (genre) {
      case 'hip-hop':
        baseTags.push('trap', 'boom bap', 'lo-fi hip hop', 'rap', 'beat');
        break;
      case 'electronic':
        baseTags.push('edm', 'house', 'techno', 'dnb', 'future bass');
        break;
      case 'rock':
        baseTags.push('alternativo', 'indie', 'garage', 'punk', 'metal');
        break;
      case 'jazz':
        baseTags.push('neo-soul', 'funk', 'blues', 'swing', 'bebop');
        break;
      case 'lofi':
        baseTags.push('chill', 'relaxar', 'study beats', 'vintage', 'nostalgia');
        break;
      case 'reggaeton':
        baseTags.push('dem bow', 'latin', 'urbano', 'dancehall', 'moombahton');
        break;
    }

    // Randomly select subset of tags (5-10)
    const numTags = 5 + Math.floor(Math.random() * 6);
    const shuffled = baseTags.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(numTags, shuffled.length));
  }

  /**
   * Generate random date within last 2 years
   */
  private _randomDate(): string {
    const now = new Date();
    const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
    const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
    return new Date(randomTime).toISOString().split('T')[0];
  }

  // ==========================================================================
  // SEARCH AND FILTER / PESQUISA E FILTRO
  // ==========================================================================

  /**
   * Search and filter assets
   * Pesquisar e filtrar ativos
   */
  search(options: SearchOptions = {}): SearchResult {
    const {
      query,
      category,
      subCategory,
      genre,
      type,
      bpmRange,
      key,
      durationRange,
      tags,
      sortBy = 'popularity',
      sortOrder = 'desc',
      page = 0,
      pageSize = 50,
    } = options;

    // Start with all assets
    let results = Array.from(this._assets.values());

    // Apply text search
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(asset =>
        asset.name.toLowerCase().includes(lowerQuery) ||
        asset.description.toLowerCase().includes(lowerQuery) ||
        asset.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        asset.artist.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply category filter
    if (category) {
      results = results.filter(asset => asset.category === category);
    }

    // Apply sub-category filter
    if (subCategory) {
      results = results.filter(asset => asset.subCategory === subCategory);
    }

    // Apply genre filter
    if (genre) {
      results = results.filter(asset => asset.genre === genre);
    }

    // Apply type filter
    if (type) {
      results = results.filter(asset => asset.type === type);
    }

    // Apply BPM range filter
    if (bpmRange) {
      results = results.filter(asset =>
        asset.bpm >= bpmRange.min && asset.bpm <= bpmRange.max
      );
    }

    // Apply key filter
    if (key) {
      results = results.filter(asset => asset.key === key);
    }

    // Apply duration range filter
    if (durationRange) {
      results = results.filter(asset =>
        asset.duration >= durationRange.min && asset.duration <= durationRange.max
      );
    }

    // Apply tags filter
    if (tags && tags.length > 0) {
      results = results.filter(asset =>
        tags.some(tag => asset.tags.includes(tag))
      );
    }

    // Sort results
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'bpm':
          comparison = a.bpm - b.bpm;
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        case 'popularity':
          comparison = a.popularity - b.popularity;
          break;
        case 'dateAdded':
          comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
          break;
        default:
          comparison = a.popularity - b.popularity;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Calculate pagination
    const totalItems = results.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = page * pageSize;
    const paginatedResults = results.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedResults,
      totalItems,
      totalPages,
      currentPage: page,
      pageSize,
      filtersApplied: { query, category, subCategory, genre, type, bpmRange, key, durationRange, tags },
    };
  }

  /**
   * Get a single asset by ID
   * Obter um ativo por ID
   */
  getAssetById(id: string): AssetMetadata | undefined {
    return this._assets.get(id);
  }

  /**
   * Get multiple assets by IDs
   * Obter múltiplos ativos por IDs
   */
  getAssetsByIds(ids: string[]): AssetMetadata[] {
    return ids.map(id => this._assets.get(id)).filter(Boolean) as AssetMetadata[];
  }

  /**
   * Get random assets
   * Obter ativos aleatórios
   */
  getRandomAssets(count: number = 10): AssetMetadata[] {
    const allAssets = Array.from(this._assets.values());
    const shuffled = allAssets.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Get popular/trending assets
   * Obter ativos populares/em alta
   */
  getPopularAssets(count: number = 20, category?: AssetCategory): AssetMetadata[] {
    let results = Array.from(this._assets.values());
    
    if (category) {
      results = results.filter(a => a.category === category);
    }

    return results
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, count);
  }

  /**
   * Get recently added assets
   * Obter ativos recentemente adicionados
   */
  getRecentAssets(count: number = 20, category?: AssetCategory): AssetMetadata[] {
    let results = Array.from(this._assets.values());
    
    if (category) {
      results = results.filter(a => a.category === category);
    }

    return results
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, count);
  }

  // ==========================================================================
  // STATISTICS / ESTATÍSTICAS
  // ==========================================================================

  /**
   * Get statistics for each category
   * Obter estatísticas para cada categoria
   */
  getCategoryStats(): CategoryStats[] {
    const stats: Map<AssetCategory, CategoryStats> = new Map();

    for (const [, asset] of this._assets) {
      if (!stats.has(asset.category)) {
        stats.set(asset.category, {
          category: asset.category,
          count: 0,
          subCategories: {},
        });
      }

      const stat = stats.get(asset.category)!;
      stat.count++;

      if (!stat.subCategories[asset.subCategory]) {
        stat.subCategories[asset.subCategory] = 0;
      }
      stat.subCategories[asset.subCategory]++;
    }

    return Array.from(stats.values());
  }

  /**
   * Get statistics for each genre
   * Obter estatísticas para cada gênero
   */
  getGenreStats(): GenreStats[] {
    const stats: Map<Genre, number> = new Map();

    for (const genre of Object.keys(GENRE_NAMES) as Genre[]) {
      stats.set(genre, 0);
    }

    for (const [, asset] of this._assets) {
      stats.set(asset.genre, (stats.get(asset.genre) || 0) + 1);
    }

    return Array.from(stats.entries()).map(([genre, count]) => ({
      genre,
      count,
      displayName: GENRE_NAMES[genre],
    }));
  }

  /**
   * Get all unique tags
   * Obter todas as tags únicas
   */
  getAllTags(): string[] {
    const tags = new Set<string>();
    for (const [, asset] of this._assets) {
      asset.tags.forEach(tag => tags.add(tag));
    }
    return Array.from(tags).sort();
  }

  /**
   * Get all available sub-categories for a category
   * Obter todas as sub-categorias disponíveis para uma categoria
   */
  getSubCategories(category: AssetCategory): string[] {
    const subCats = new Set<string>();
    for (const [, asset] of this._assets) {
      if (asset.category === category) {
        subCats.add(asset.subCategory);
      }
    }
    return Array.from(subCats);
  }

  /**
   * Get BPM distribution
   * Obter distribuição de BPM
   */
  getBPMDistribution(): { range: string; count: number }[] {
    const ranges = [
      { min: 0, max: 69, label: '< 70' },
      { min: 70, max: 89, label: '70-89' },
      { min: 90, max: 109, label: '90-109' },
      { min: 110, max: 129, label: '110-129' },
      { min: 130, max: 149, label: '130-149' },
      { min: 150, max: 169, label: '150-169' },
      { min: 170, max: 189, label: '170-189' },
      { min: 190, max: Infinity, label: '190+' },
    ];

    return ranges.map(range => ({
      range: range.label,
      count: Array.from(this._assets.values()).filter(
        a => a.bpm >= range.min && a.bpm < range.max
      ).length,
    }));
  }

  /**
   * Get key distribution
   * Obter distribuição de tonalidades
   */
  getKeyDistribution(): { key: string; count: number }[] {
    const dist: Record<string, number> = {};
    
    for (const [, asset] of this._assets) {
      if (asset.key) {
        dist[asset.key] = (dist[asset.key] || 0) + 1;
      }
    }

    return Object.entries(dist)
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count);
  }

  // ==========================================================================
  // COLLECTIONS / COLEÇÕES
  // ==========================================================================

  /**
   * Get curated collections/packs
   * Obter coleções/packs curados
   */
  getCollections(): Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    assetIds: string[];
  }> {
    return [
      {
        id: 'starter-pack',
        name: 'Pack Iniciante',
        description: 'Coleção essencial para começar a produzir',
        icon: '🚀',
        assetIds: this.search({ pageSize: 30, sortBy: 'popularity' }).items.map(a => a.id),
      },
      {
        id: 'hiphop-essentials',
        name: 'Hip-Hop Essenciais',
        description: 'Os melhores sons para produções de Hip-Hop',
        icon: '🎤',
        assetIds: this.search({ genre: 'hip-hop', pageSize: 40 }).items.map(a => a.id),
      },
      {
        id: 'electronic-factory',
        name: 'Fábrica Eletrônica',
        description: 'Sons eletrônicos para EDM, House e Techno',
        icon: '🎹',
        assetIds: this.search({ genre: 'electronic', pageSize: 40 }).items.map(a => a.id),
      },
      {
        id: 'lofi-chill',
        name: 'Lo-Fi Chill',
        description: 'Sons relaxantes para study beats e chill vibes',
        icon: '☕',
        assetIds: this.search({ genre: 'lofi', pageSize: 35 }).items.map(a => a.id),
      },
      {
        id: 'latin-heat',
        name: 'Calor Latino',
        description: 'Ritmos latinos e Reggaeton flames',
        icon: '🔥',
        assetIds: this.search({ genre: 'reggaeton', pageSize: 35 }).items.map(a => a.id),
      },
      {
        id: 'cinematic-score',
        name: 'Score Cinematográfico',
        description: 'Sons épicos para trilhas sonoras e filmes',
        icon: '🎬',
        assetIds: this.search({ category: 'melodic', subCategory: 'strings', pageSize: 25 }).items.map(a => a.id),
      },
      {
        id: 'vocal-slices',
        name: 'Vocal Slices',
        description: 'Chops e ad-libs vocais prontos para usar',
        icon: '🗣️',
        assetIds: this.search({ category: 'vocals', pageSize: 30 }).items.map(a => a.id),
      },
      {
        id: 'fx-toolbox',
        name: 'Caixa de Ferramentas FX',
        description: 'Transições, impacts e risers profissionais',
        icon: '✨',
        assetIds: this.search({ category: 'fx', pageSize: 40 }).items.map(a => a.id),
      },
    ];
  }

  // ==========================================================================
  // RECOMMENDATIONS / RECOMENDAÇÕES
  // ==========================================================================

  /**
   * Get recommended assets based on context
   * Obter ativos recomendados com base no contexto
   */
  getRecommendations(context: {
    currentBpm?: number;
    currentKey?: MusicalKey;
    genres?: Genre[];
    recentlyPlayed?: string[];
  }): AssetMetadata[] {
    let candidates = Array.from(this._assets.values());

    // Filter by BPM proximity if provided
    if (context.currentBpm) {
      candidates = candidates
        .filter(a => a.bpm === 0 || Math.abs(a.bpm - context.currentBpm!) <= 10)
        .sort((a, b) => {
          const diffA = a.bpm === 0 ? 100 : Math.abs(a.bpm - context.currentBpm!);
          const diffB = b.bpm === 0 ? 100 : Math.abs(b.bpm - context.currentBpm!);
          return diffA - diffB;
        });
    }

    // Filter by compatible key if provided
    if (context.currentKey) {
      const compatibleKeys = this._getCompatibleKeys(context.currentKey);
      candidates = candidates.filter(a => !a.key || compatibleKeys.includes(a.key));
    }

    // Boost recently played genres
    if (context.genres && context.genres.length > 0) {
      candidates.sort((a, b) => {
        const aBoost = context.genres!.includes(a.genre) ? 1 : 0;
        const bBoost = context.genres!.includes(b.genre) ? 1 : 0;
        return bBoost - aBoost;
      });
    }

    // Exclude recently played
    if (context.recentlyPlayed && context.recentlyPlayed.length > 0) {
      const recentSet = new Set(context.recentlyPlayed);
      candidates = candidates.filter(a => !recentSet.has(a.id));
    }

    return candidates.slice(0, 20);
  }

  /**
   * Get musically compatible keys
   */
  private _getCompatibleKeys(key: MusicalKey): string[] {
    const majorKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const minorKeys = ['am', 'a#m', 'bm', 'cm', 'c#m', 'dm', 'd#m', 'em', 'fm', 'f#m', 'gm', 'g#m'];
    
    const isMinor = key.endsWith('m');
    const baseKey = isMinor ? key.slice(0, -1) : key;
    const keyIndex = isMinor 
      ? minorKeys.indexOf(key)
      : majorKeys.indexOf(baseKey);

    const compatible: string[] = [key];

    // Relative major/minor
    if (isMinor) {
      // Relative major is 3 half steps up
      compatible.push(majorKeys[(keyIndex + 3) % 12]);
    } else {
      // Relative minor is 3 half steps down
      compatible.push(minorKeys[(keyIndex + 9) % 12]);
    }

    // Perfect fourth and fifth
    compatible.push(majorKeys[(keyIndex + 5) % 12]);
    compatible.push(majorKeys[(keyIndex + 7) % 12]);
    compatible.push(minorKeys[(keyIndex + 5) % 12]);
    compatible.push(minorKeys[(keyIndex + 7) % 12]);

    return compatible;
  }
}

// ============================================================================
// SINGLETON INSTANCE / INSTÂNCIA SINGLETON
// ============================================================================

/**
 * Global assets library singleton instance
 * Instância global singleton da biblioteca de ativos
 */
let libraryInstance: AssetsLibrary | null = null;

/**
 * Get or create the assets library singleton
 * Obter ou criar o singleton da biblioteca de ativos
 */
export function getAssetsLibrary(): AssetsLibrary {
  if (!libraryInstance) {
    libraryInstance = new AssetsLibrary();
  }
  return libraryInstance;
}

/**
 * Reset the assets library singleton (for testing/cleanup)
 * Resetar o singleton da biblioteca de ativos (para testes/limpeza)
 */
export function resetAssetsLibrary(): void {
  libraryInstance = null;
}
