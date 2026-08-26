/**
 * Duck Lab - Professional Web Audio Engine
 * Motor de Áudio Web Profissional para DAW
 * 
 * This module provides a comprehensive Web Audio API-based audio engine
 * for the Duck Lab Digital Audio Workstation.
 */

// ============================================================================
// TYPE DEFINITIONS / DEFINIÇÕES DE TIPO
// ============================================================================

/** Audio track configuration options */
export interface TrackOptions {
  id: string;
  name: string;
  color?: string;
  volume?: number;        // 0.0 to 1.0 (default: 1.0)
  pan?: number;           // -1.0 to 1.0 (default: 0)
  muted?: boolean;
  solo?: boolean;
  armed?: boolean;        // Ready for recording
}

/** Effect parameters interface */
export interface EffectParams {
  /** Reverb: wet level 0-1 */
  reverbWet?: number;
  /** Reverb: decay time in seconds */
  reverbDecay?: number;
  /** Delay: wet level 0-1 */
  delayWet?: number;
  /** Delay: time in seconds */
  delayTime?: number;
  /** Delay: feedback 0-1 */
  delayFeedback?: number;
  /** Compression: threshold in dB */
  compThreshold?: number;
  /** Compression: ratio */
  compRatio?: number;
  /** Compression: attack in seconds */
  compAttack?: number;
  /** Compression: release in seconds */
  compRelease?: number;
  /** Distortion: amount 0-1 */
  distortionAmount?: number;
  /** EQ: low gain in dB (-12 to 12) */
  eqLowGain?: number;
  /** EQ: mid gain in dB (-12 to 12) */
  eqMidGain?: number;
  /** EQ: high gain in dB (-12 to 12) */
  eqHighGain?: number;
  /** EQ: low frequency cutoff */
  eqLowFreq?: number;
  /** EQ: high frequency cutoff */
  eqHighFreq?: number;
}

/** Waveform data point for visualization */
export interface WaveformData {
  /** Sample values normalized to -1 to 1 */
  samples: Float32Array;
  /** Peak values for display (min, max pairs) */
  peaks: Array<{ min: number; max: number }>;
  /** Duration of the waveform data in seconds */
  duration: number;
  /** Sample rate used */
  sampleRate: number;
}

/** Transport state */
export type TransportState = 'stopped' | 'playing' | 'paused' | 'recording';

/** Time signature configuration */
export interface TimeSignature {
  beatsPerMeasure: number;   // e.g., 4 for 4/4 time
  beatUnit: number;          // e.g., 4 for quarter note
}

/** Project tempo and timing info */
export interface TempoInfo {
  bpm: number;
  timeSignature: TimeSignature;
}

/** Recording state callback data */
export interface RecordingData {
  isRecording: boolean;
  duration: number;
  peakLevel: number;
}

/** Engine event types */
export type EngineEventType = 
  | 'ready'
  | 'play'
  | 'pause'
  | 'stop'
  | 'record:start'
  | 'record:stop'
  | 'record:data'
  | 'timeupdate'
  | 'loop:change'
  | 'bpm:change'
  | 'track:add'
  | 'track:remove'
  | 'track:select'
  | 'effect:change'
  | 'error';

/** Engine event listener callback */
export type EngineEventListener = (event: EngineEventType, data?: unknown) => void;

/** Audio buffer with metadata */
export interface AudioBufferWithMeta {
  buffer: AudioBuffer;
  name: string;
  duration: number;
  sampleRate: number;
  numberOfChannels: number;
}

/** Export options */
export interface ExportOptions {
  format: 'wav' | 'mp3' | 'ogg';
  sampleRate?: number;
  bitDepth?: 16 | 24 | 32;
  normalize?: boolean;
  includeEffects?: boolean;
}

// ============================================================================
// TRACK CLASS / CLASSE DE FAIXA
// ============================================================================

/**
 * Represents an individual audio track in the DAW
 * Representa uma faixa de áudio individual no DAW
 */
export class AudioTrack {
  public readonly id: string;
  public name: string;
  public color: string;
  
  // Gain nodes for volume control
  private _volumeGainNode!: GainNode;
  private _panNode!: StereoPannerNode;
  
  // Effects chain nodes
  private _eqLowNode!: BiquadFilterNode;
  private _eqMidNode!: BiquadFilterNode;
  private _eqHighNode!: BiquadFilterNode;
  private _compressorNode!: DynamicsCompressorNode;
  private _distortionNode!: WaveShaperNode;
  private _delayNode!: DelayNode;
  private _delayFeedbackGain!: GainNode;
  private _delayWetGain!: GainNode;
  private _delayDryGain!: GainNode;
  private _convolverNode!: ConvolverNode;
  private _reverbWetGain!: GainNode;
  private _reverbDryGain!: GainNode;
  
  // Input and output nodes
  public inputNode: GainNode;
  public outputNode: GainNode;
  
  // Track state
  private _muted: boolean = false;
  private _solo: boolean = false;
  private _armed: boolean = false;
  private _volume: number = 1.0;
  private _pan: number = 0;
  
  // Clips on this track
  private _clips: Map<string, AudioBufferSourceNode> = new Map();
  private _clipBuffers: Map<string, AudioBuffer> = new Map();
  
  // Recording
  private _mediaStream: MediaStream | null = null;
  private _mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  private _recordingBuffer: Float32Array[] = [];
  private _isRecording: boolean = false;
  private _recordingProcessor: ScriptProcessorNode | AudioWorkletNode | null = null;

  constructor(
    private context: AudioContext,
    options: TrackOptions,
    private masterBusInput: AudioNode
  ) {
    this.id = options.id;
    this.name = options.name;
    this.color = options.color || '#10B981';
    this._muted = options.muted ?? false;
    this._solo = options.solo ?? false;
    this._armed = options.armed ?? false;
    this._volume = options.volume ?? 1.0;
    this._pan = options.pan ?? 0;
    
    // Create main input node
    this.inputNode = context.createGain();
    this.inputNode.gain.value = 1.0;
    
    // Create effects chain
    this._createEffectChain(context);
    
    // Create output node
    this.outputNode = context.createGain();
    this.outputNode.gain.value = 1.0;
    
    // Connect chain: input -> effects -> output -> master bus
    this._connectChain();
    
    // Set initial values
    this.setVolume(this._volume);
    this.setPan(this._pan);
  }

  /**
   * Create the complete effects processing chain
   */
  private _createEffectChain(context: AudioContext): void {
    // EQ Section - Low shelf filter
    this._eqLowNode = context.createBiquadFilter();
    this._eqLowNode.type = 'lowshelf';
    this._eqLowNode.frequency.value = 200;
    this._eqLowNode.gain.value = 0;
    
    // EQ Section - Peaking filter for mids
    this._eqMidNode = context.createBiquadFilter();
    this._eqMidNode.type = 'peaking';
    this._eqMidNode.frequency.value = 1000;
    this._eqMidNode.Q.value = 1;
    this._eqMidNode.gain.value = 0;
    
    // EQ Section - High shelf filter
    this._eqHighNode = context.createBiquadFilter();
    this._eqHighNode.type = 'highshelf';
    this._eqHighNode.frequency.value = 4000;
    this._eqHighNode.gain.value = 0;
    
    // Compressor
    this._compressorNode = context.createDynamicsCompressor();
    this._compressorNode.threshold.value = -24;
    this._compressorNode.knee.value = 30;
    this._compressorNode.ratio.value = 4;
    this._compressorNode.attack.value = 0.003;
    this._compressorNode.release.value = 0.25;
    
    // Distortion using WaveShaper
    this._distortionNode = context.createWaveShaper();
    this._distortionNode.curve = this._makeDistortionCurve(0);
    this._distortionNode.oversample = '4x';
    
    // Delay effect
    this._delayNode = context.createDelay(2.0);
    this._delayNode.delayTime.value = 0.3;
    this._delayFeedbackGain = context.createGain();
    this._delayFeedbackGain.gain.value = 0.3;
    this._delayWetGain = context.createGain();
    this._delayWetGain.gain.value = 0;
    this._delayDryGain = context.createGain();
    this._delayDryGain.gain.value = 1;
    
    // Reverb (convolver)
    this._convolverNode = context.createConvolver();
    this._reverbWetGain = context.createGain();
    this._reverbWetGain.gain.value = 0;
    this._reverbDryGain = context.createGain();
    this._reverbDryGain.gain.value = 1;
    
    // Volume and Pan (at end of chain)
    this._volumeGainNode = context.createGain();
    this._volumeGainNode.gain.value = this._muted ? 0 : this._volume;
    this._panNode = context.createStereoPanner();
    this._panNode.pan.value = this._pan;
    
    // Generate impulse response for reverb
    this._generateReverbIR(context);
  }

  /**
   * Connect all nodes in the effects chain
   */
  private _connectChain(): void {
    const ctx = this.context;
    
    // Main signal path through effects
    this.inputNode.connect(this._eqLowNode);
    this._eqLowNode.connect(this._eqMidNode);
    this._eqMidNode.connect(this._eqHighNode);
    this._eqHighNode.connect(this._compressorNode);
    this._compressorNode.connect(this._distortionNode);
    
    // Delay (parallel wet/dry)
    this._distortionNode.connect(this._delayDryGain);
    this._distortionNode.connect(this._delayNode);
    this._delayNode.connect(this._delayFeedbackGain);
    this._delayFeedbackGain.connect(this._delayNode);
    this._delayNode.connect(this._delayWetGain);
    this._delayDryGain.connect(this._reverbDryGain);
    this._delayWetGain.connect(this._reverbDryGain);
    
    // Reverb (parallel wet/dry)
    this._reverbDryGain.connect(this._convolverNode);
    this._convolverNode.connect(this._reverbWetGain);
    this._reverbDryGain.connect(this._volumeGainNode);
    this._reverbWetGain.connect(this._volumeGainNode);
    
    // Final output
    this._volumeGainNode.connect(this._panNode);
    this._panNode.connect(this.outputNode);
    this.outputNode.connect(this.masterBusInput);
  }

  /**
   * Generate distortion curve for waveshaper
   */
  private _makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    
    return curve;
  }

  /**
   * Generate impulse response for reverb
   */
  private async _generateReverbIR(context: AudioContext): Promise<void> {
    const sampleRate = context.sampleRate;
    const length = sampleRate * 2.5; // 2.5 second reverb tail
    const decay = 2.5;
    const impulse = context.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    
    this._convolverNode.buffer = impulse;
  }

  // ==========================================================================
  // VOLUME AND PAN CONTROLS / CONTROLES DE VOLUME E PAN
  // ==========================================================================

  /** Set track volume (0.0 to 1.0) */
  setVolume(value: number): void {
    this._volume = Math.max(0, Math.min(1, value));
    if (!this._muted) {
      this._volumeGainNode.gain.setTargetAtTime(
        this._volume,
        this.context.currentTime,
        0.01
      );
    }
  }

  /** Get current volume */
  getVolume(): number {
    return this._volume;
  }

  /** Set stereo pan (-1.0 left to 1.0 right) */
  setPan(value: number): void {
    this._pan = Math.max(-1, Math.min(1, value));
    this._panNode.pan.setTargetAtTime(
      this._pan,
      this.context.currentTime,
      0.01
    );
  }

  /** Get current pan position */
  getPan(): number {
    return this._pan;
  }

  // ==========================================================================
  // MUTE AND SOLO / MUTE E SOLO
  // ==========================================================================

  /** Toggle or set mute state */
  setMuted(muted: boolean): void {
    this._muted = muted;
    this._volumeGainNode.gain.setTargetAtTime(
      muted ? 0 : this._volume,
      this.context.currentTime,
      0.01
    );
  }

  /** Check if track is muted */
  isMuted(): boolean {
    return this._muted;
  }

  /** Toggle or set solo state */
  setSolo(solo: boolean): void {
    this._solo = solo;
  }

  /** Check if track is soloed */
  isSolo(): boolean {
    return this._solo;
  }

  /** Toggle or set arm state for recording */
  setArmed(armed: boolean): void {
    this._armed = armed;
  }

  /** Check if track is armed for recording */
  isArmed(): boolean {
    return this._armed;
  }

  // ==========================================================================
  // EFFECTS CONTROLS / CONTROLES DE EFEITOS
  // ==========================================================================

  /** Apply effect parameters to this track */
  setEffects(params: EffectParams): void {
    const now = this.context.currentTime;
    
    // EQ settings
    if (params.eqLowGain !== undefined) {
      this._eqLowNode.gain.setTargetAtTime(params.eqLowGain, now, 0.01);
    }
    if (params.eqMidGain !== undefined) {
      this._eqMidNode.gain.setTargetAtTime(params.eqMidGain, now, 0.01);
    }
    if (params.eqHighGain !== undefined) {
      this._eqHighNode.gain.setTargetAtTime(params.eqHighGain, now, 0.01);
    }
    if (params.eqLowFreq !== undefined) {
      this._eqLowNode.frequency.setTargetAtTime(params.eqLowFreq, now, 0.01);
    }
    if (params.eqHighFreq !== undefined) {
      this._eqHighNode.frequency.setTargetAtTime(params.eqHighFreq, now, 0.01);
    }
    
    // Compressor settings
    if (params.compThreshold !== undefined) {
      this._compressorNode.threshold.setTargetAtTime(params.compThreshold, now, 0.01);
    }
    if (params.compRatio !== undefined) {
      this._compressorNode.ratio.setTargetAtTime(params.compRatio, now, 0.01);
    }
    if (params.compAttack !== undefined) {
      this._compressorNode.attack.setTargetAtTime(params.compAttack, now, 0.01);
    }
    if (params.compRelease !== undefined) {
      this._compressorNode.release.setTargetAtTime(params.compRelease, now, 0.01);
    }
    
    // Distortion
    if (params.distortionAmount !== undefined) {
      this._distortionNode.curve = this._makeDistortionCurve(params.distortionAmount * 100);
    }
    
    // Delay settings
    if (params.delayTime !== undefined) {
      this._delayNode.delayTime.setTargetAtTime(params.delayTime, now, 0.01);
    }
    if (params.delayFeedback !== undefined) {
      this._delayFeedbackGain.gain.setTargetAtTime(params.delayFeedback, now, 0.01);
    }
    if (params.delayWet !== undefined) {
      this._delayWetGain.gain.setTargetAtTime(params.delayWet, now, 0.01);
      this._delayDryGain.gain.setTargetAtTime(1 - params.delayWet, now, 0.01);
    }
    
    // Reverb settings
    if (params.reverbWet !== undefined) {
      this._reverbWetGain.gain.setTargetAtTime(params.reverbWet, now, 0.01);
      this._reverbDryGain.gain.setTargetAtTime(1 - params.reverbWet, now, 0.01);
    }
  }

  /** Get current effect parameters */
  getEffects(): EffectParams {
    return {
      eqLowGain: this._eqLowNode.gain.value,
      eqMidGain: this._eqMidNode.gain.value,
      eqHighGain: this._eqHighNode.gain.value,
      eqLowFreq: this._eqLowNode.frequency.value,
      eqHighFreq: this._eqHighNode.frequency.value,
      compThreshold: this._compressorNode.threshold.value,
      compRatio: this._compressorNode.ratio.value,
      compAttack: this._compressorNode.attack.value,
      compRelease: this._compressorNode.release.value,
      delayTime: this._delayNode.delayTime.value,
      delayFeedback: this._delayFeedbackGain.gain.value,
      delayWet: this._delayWetGain.gain.value,
      reverbWet: this._reverbWetGain.gain.value,
    };
  }

  // ==========================================================================
  // CLIP MANAGEMENT / GERENCIAMENTO DE CLIPS
  // ==========================================================================

  /** Add an audio buffer as a clip to this track */
  addClip(id: string, buffer: AudioBuffer): void {
    this._clipBuffers.set(id, buffer);
  }

  /** Remove a clip from this track */
  removeClip(id: string): void {
    this._clipBuffers.delete(id);
    const source = this._clips.get(id);
    if (source) {
      try { source.stop(); } catch { /* ignore */ }
      source.disconnect();
      this._clips.delete(id);
    }
  }

  /** Get all clip IDs on this track */
  getClipIds(): string[] {
    return Array.from(this._clipBuffers.keys());
  }

  /** Get a clip's audio buffer */
  getClipBuffer(id: string): AudioBuffer | undefined {
    return this._clipBuffers.get(id);
  }

  /** Play a clip at a specific offset */
  playClip(id: string, when: number = 0, offset: number = 0, duration?: number): void {
    const buffer = this._clipBuffers.get(id);
    if (!buffer) return;
    
    // Stop existing instance of this clip
    this.stopClip(id);
    
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.inputNode);
    
    source.start(this.context.currentTime + when, offset, duration);
    source.onended = () => {
      this._clips.delete(id);
    };
    
    this._clips.set(id, source);
  }

  /** Stop a specific clip */
  stopClip(id: string): void {
    const source = this._clips.get(id);
    if (source) {
      try { source.stop(); } catch { /* ignore */ }
      source.disconnect();
      this._clips.delete(id);
    }
  }

  /** Stop all clips on this track */
  stopAllClips(): void {
    for (const [id] of this._clips) {
      this.stopClip(id);
    }
  }

  // ==========================================================================
  // RECORDING / GRAVAÇÃO
  // ==========================================================================

  /** Start recording from microphone */
  async startRecording(): Promise<void> {
    if (this._isRecording) return;
    
    try {
      // Request microphone access
      this._mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: this.context.sampleRate,
        },
        video: false,
      });
      
      // Create media stream source
      this._mediaStreamSource = this.context.createMediaStreamSource(this._mediaStream);
      this._mediaStreamSource.connect(this.inputNode);
      
      // Initialize recording buffers
      const numChannels = 2; // Stereo recording
      this._recordingBuffer = [];
      for (let i = 0; i < numChannels; i++) {
        this._recordingBuffer.push(new Float32Array(0));
      }
      
      // Create script processor for capturing audio
      const bufferSize = 4096;
      this._recordingProcessor = this.context.createScriptProcessor(bufferSize, numChannels, numChannels);
      
      this._recordingProcessor.onaudioprocess = (event) => {
        if (!this._isRecording) return;
        
        for (let channel = 0; channel < numChannels; channel++) {
          const inputData = event.inputBuffer.getChannelData(channel);
          const existingData = this._recordingBuffer[channel];
          const newData = new Float32Array(existingData.length + inputData.length);
          newData.set(existingData);
          newData.set(inputData, existingData.length);
          this._recordingBuffer[channel] = newData;
        }
      };
      
      this._mediaStreamSource.connect(this._recordingProcessor);
      this._recordingProcessor.connect(this.context.destination);
      
      this._isRecording = true;
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      throw new Error('Permissão de microfone negada ou não disponível');
    }
  }

  /** Stop recording and return the recorded audio buffer */
  stopRecording(): AudioBuffer | null {
    if (!this._isRecording) return null;
    
    this._isRecording = false;
    
    // Disconnect and cleanup recording nodes
    if (this._mediaStreamSource) {
      this._mediaStreamSource.disconnect();
      this._mediaStreamSource = null;
    }
    
    if (this._recordingProcessor) {
      this._recordingProcessor.disconnect();
      this._recordingProcessor = null;
    }
    
    // Stop media stream tracks
    if (this._mediaStream) {
      this._mediaStream.getTracks().forEach(track => track.stop());
      this._mediaStream = null;
    }
    
    // Create audio buffer from recorded data
    if (this._recordingBuffer[0].length === 0) return null;
    
    const numChannels = this._recordingBuffer.length;
    const length = this._recordingBuffer[0].length;
    const buffer = this.context.createBuffer(numChannels, length, this.context.sampleRate);
    
    for (let channel = 0; channel < numChannels; channel++) {
      buffer.getChannelData(channel).set(this._recordingBuffer[channel]);
    }
    
    return buffer;
  }

  /** Check if currently recording */
  isCurrentlyRecording(): boolean {
    return this._isRecording;
  }

  /** Get recording duration in seconds */
  getRecordingDuration(): number {
    if (this._recordingBuffer.length === 0 || !this._isRecording) return 0;
    return this._recordingBuffer[0].length / this.context.sampleRate;
  }

  // ==========================================================================
  // CLEANUP / LIMPEZA
  // ==========================================================================

  /** Disconnect and clean up all nodes */
  dispose(): void {
    this.stopAllClips();
    
    if (this._isRecording) {
      this.stopRecording();
    }
    
    try {
      this.inputNode.disconnect();
      this.outputNode.disconnect();
      this._volumeGainNode.disconnect();
      this._panNode.disconnect();
      this._eqLowNode.disconnect();
      this._eqMidNode.disconnect();
      this._eqHighNode.disconnect();
      this._compressorNode.disconnect();
      this._distortionNode.disconnect();
      this._delayNode.disconnect();
      this._delayFeedbackGain.disconnect();
      this._delayWetGain.disconnect();
      this._delayDryGain.disconnect();
      this._convolverNode.disconnect();
      this._reverbWetGain.disconnect();
      this._reverbDryGain.disconnect();
    } catch {
      // Ignore disconnect errors during cleanup
    }
  }
}

// ============================================================================
// MASTER BUS CLASS / CLASSE DO BARRAMENTO PRINCIPAL
// ============================================================================

/**
 * Master bus with limiter and final output
 * Barramento principal com limitador e saída final
 */
export class MasterBus {
  private _inputNode: GainNode;
  private _limiterNode: DynamicsCompressorNode;
  private _masterGainNode: GainNode;
  private _analyserNode: AnalyserNode;
  private _outputNode: GainNode;
  
  private _volume: number = 1.0;

  constructor(private context: AudioContext) {
    // Input node (receives from all tracks)
    this._inputNode = context.createGain();
    this._inputNode.gain.value = 1.0;
    
    // Limiter (acts as master compressor/limiter)
    this._limiterNode = context.createDynamicsCompressor();
    this._limiterNode.threshold.value = -1; // Start limiting at -1dB
    this._limiterNode.knee.value = 0;
    this._limiterNode.ratio.value = 20;     // High ratio for limiting
    this._limiterNode.attack.value = 0.001;  // Fast attack
    this._limiterNode.release.value = 0.1;   // Moderate release
    
    // Master volume
    this._masterGainNode = context.createGain();
    this._masterGainNode.gain.value = this._volume;
    
    // Analyser for metering
    this._analyserNode = context.createAnalyser();
    this._analyserNode.fftSize = 2048;
    this._analyserNode.smoothingTimeConstant = 0.8;
    
    // Output node
    this._outputNode = context.createGain();
    this._outputNode.gain.value = 1.0;
    
    // Connect chain: input -> limiter -> master gain -> analyser -> output -> destination
    this._inputNode.connect(this._limiterNode);
    this._limiterNode.connect(this._masterGainNode);
    this._masterGainNode.connect(this._analyserNode);
    this._analyserNode.connect(this._outputNode);
    this._outputNode.connect(context.destination);
  }

  /** Get input node for tracks to connect to */
  get inputNode(): AudioNode {
    return this._inputNode;
  }

  /** Set master volume (0.0 to 1.0) */
  setVolume(value: number): void {
    this._volume = Math.max(0, Math.min(1, value));
    this._masterGainNode.gain.setTargetAtTime(
      this._volume,
      this.context.currentTime,
      0.01
    );
  }

  /** Get master volume */
  getVolume(): number {
    return this._volume;
  }

  /** Set limiter threshold (in dB, typically -1 to -12) */
  setLimiterThreshold(db: number): void {
    this._limiterNode.threshold.setTargetAtTime(
      db,
      this.context.currentTime,
      0.01
    );
  }

  /** Get current levels for metering */
  getLevels(): { peak: number; rms: number } {
    const dataArray = new Float32Array(this._analyserNode.fftSize);
    this._analyserNode.getFloatTimeDomainData(dataArray);
    
    let sumSquares = 0;
    let peak = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      const absValue = Math.abs(dataArray[i]);
      sumSquares += dataArray[i] * dataArray[i];
      if (absValue > peak) peak = absValue;
    }
    
    const rms = Math.sqrt(sumSquares / dataArray.length);
    
    return { peak, rms };
  }

  /** Get frequency data for spectrum analyzer */
  getFrequencyData(): Uint8Array {
    const dataArray = new Uint8Array(this._analyserNode.frequencyBinCount);
    this._analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }

  /** Get waveform data for visualization */
  getWaveformFloatData(): Float32Array {
    const dataArray = new Float32Array(this._analyserNode.fftSize);
    this._analyserNode.getFloatTimeDomainData(dataArray);
    return dataArray;
  }

  /** Dispose of all nodes */
  dispose(): void {
    this._inputNode.disconnect();
    this._limiterNode.disconnect();
    this._masterGainNode.disconnect();
    this._analyserNode.disconnect();
    this._outputNode.disconnect();
  }
}

// ============================================================================
// MAIN AUDIO ENGINE CLASS / CLASSE PRINCIPAL DO MOTOR DE ÁUDIO
// ============================================================================

/**
 * Duck Lab Audio Engine - Complete Web Audio API implementation
 * Motor de Áudio Duck Lab - Implementação completa da Web Audio API
 */
export class DuckLabAudioEngine {
  private _context: AudioContext | null = null;
  private _masterBus: MasterBus | null = null;
  private _tracks: Map<string, AudioTrack> = new Map();
  
  // Transport state
  private _transportState: TransportState = 'stopped';
  private _currentTime: number = 0;
  private _loopEnabled: boolean = false;
  private _loopStart: number = 0;
  private _loopEnd: number = 4; // Default 4 bars
  
  // Tempo and timing
  private _bpm: number = 120;
  private _timeSignature: TimeSignature = { beatsPerMeasure: 4, beatUnit: 4 };
  
  // Playback scheduling
  private _playbackTimer: ReturnType<typeof setInterval> | null = null;
  private _schedulerInterval: number = 25; // ms between scheduling ticks
  
  // Event listeners
  private _listeners: Map<EngineEventType, Set<EngineEventListener>> = new Map();
  
  // Recording
  private _recordingTracks: Set<string> = new Set();

  constructor() {
    // Initialize will be called explicitly
  }

  // ==========================================================================
  // CONTEXT MANAGEMENT / GERENCIAMENTO DE CONTEXTO
  // ==========================================================================

  /**
   * Initialize the audio context (must be called after user gesture)
   * Inicializa o contexto de áudio (deve ser chamado após gesto do usuário)
   */
  async initialize(): Promise<void> {
    if (this._context) return;
    
    this._context = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    
    // Create master bus
    this._masterBus = new MasterBus(this._context);
    
    // Resume context if suspended
    if (this._context.state === 'suspended') {
      await this._context.resume();
    }
    
    this.emit('ready');
  }

  /** Get the audio context */
  getContext(): AudioContext | null {
    return this._context;
  }

  /** Get the sample rate */
  getSampleRate(): number {
    return this._context?.sampleRate || 44100;
  }

  /** Suspend/resume the audio context */
  async suspend(): Promise<void> {
    await this._context?.suspend();
  }

  async resume(): Promise<void> {
    await this._context?.resume();
  }

  /** Check if context is running */
  isRunning(): boolean {
    return this._context?.state === 'running';
  }

  /** Close and clean up the entire engine */
  async dispose(): Promise<void> {
    this.stop();
    
    // Dispose all tracks
    for (const [, track] of this._tracks) {
      track.dispose();
    }
    this._tracks.clear();
    
    // Dispose master bus
    this._masterBus?.dispose();
    this._masterBus = null;
    
    // Close context
    if (this._context) {
      await this._context.close();
      this._context = null;
    }
  }

  // ==========================================================================
  // TRACK MANAGEMENT / GERENCIAMENTO DE FAIXAS
  // ==========================================================================

  /**
   * Create a new audio track
   * Criar uma nova faixa de áudio
   */
  createTrack(options: TrackOptions): AudioTrack {
    if (!this._context || !this._masterBus) {
      throw new Error('Motor de áudio não inicializado');
    }
    
    const track = new AudioTrack(this._context, options, this._masterBus.inputNode);
    this._tracks.set(options.id, track);
    
    this.emit('track:add', { id: options.id, name: options.name });
    
    return track;
  }

  /** Get a track by ID */
  getTrack(id: string): AudioTrack | undefined {
    return this._tracks.get(id);
  }

  /** Get all track IDs */
  getAllTrackIds(): string[] {
    return Array.from(this._tracks.keys());
  }

  /** Get all tracks */
  getAllTracks(): AudioTrack[] {
    return Array.from(this._tracks.values());
  }

  /** Remove a track */
  removeTrack(id: string): void {
    const track = this._tracks.get(id);
    if (track) {
      track.dispose();
      this._tracks.delete(id);
      this.emit('track:remove', { id });
    }
  }

  /** Remove all tracks */
  removeAllTracks(): void {
    for (const [id] of this._tracks) {
      this.removeTrack(id);
    }
  }

  /** Get total number of tracks */
  getTrackCount(): number {
    return this._tracks.size;
  }

  // ==========================================================================
  // TRANSPORT CONTROLS / CONTROLES DE TRANSPORTE
  // ==========================================================================

  /**
   * Start playback
   * Iniciar reprodução
   */
  play(): void {
    if (!this._context || this._transportState === 'playing') return;
    
    this._transportState = 'playing';
    this._startPlaybackTimer();
    this.emit('play');
  }

  /**
   * Pause playback
   * Pausar reprodução
   */
  pause(): void {
    if (this._transportState !== 'playing') return;
    
    this._transportState = 'paused';
    this._stopPlaybackTimer();
    this.emit('pause');
  }

  /**
   * Stop playback and reset position
   * Parar reprodução e resetar posição
   */
  stop(): void {
    this._transportState = 'stopped';
    this._currentTime = 0;
    this._stopPlaybackTimer();
    
    // Stop all clips on all tracks
    for (const [, track] of this._tracks) {
      track.stopAllClips();
    }
    
    // Stop any active recordings
    this._stopAllRecordings();
    
    this.emit('stop');
  }

  /**
   * Toggle play/pause
   * Alternar reprodução/pausa
   */
  togglePlayPause(): void {
    if (this._transportState === 'playing') {
      this.pause();
    } else {
      this.play();
    }
  }

  /** Get current transport state */
  getTransportState(): TransportState {
    return this._transportState;
  }

  /** Check if currently playing */
  isPlaying(): boolean {
    return this._transportState === 'playing';
  }

  /** Check if currently paused */
  isPaused(): boolean {
    return this._transportState === 'paused';
  }

  /** Check if currently stopped */
  isStopped(): boolean {
    return this._transportState === 'stopped';
  }

  // ==========================================================================
  // TIME POSITION / POSIÇÃO DE TEMPO
  // ==========================================================================

  /** Set current playback position in seconds */
  setCurrentTime(time: number): void {
    this._currentTime = Math.max(0, time);
    this.emit('timeupdate', { time: this._currentTime });
  }

  /** Get current playback position in seconds */
  getCurrentTime(): number {
    return this._currentTime;
  }

  /** Get current position in beats */
  getCurrentBeat(): number {
    const secondsPerBeat = 60 / this._bpm;
    return this._currentTime / secondsPerBeat;
  }

  /** Get current position as bar:beat:tick */
  getPositionBBT(): { bar: number; beat: number; tick: number } {
    const beat = this.getCurrentBeat();
    const beatsPerMeasure = this._timeSignature.beatsPerMeasure;
    const ticksPerBeat = 960; // Standard MIDI resolution
    
    const totalTicks = Math.floor(beat * ticksPerBeat);
    const tick = totalTicks % ticksPerBeat;
    const totalBeats = Math.floor(totalTicks / ticksPerBeat);
    const beatInBar = (totalBeats % beatsPerMeasure) + 1;
    const bar = Math.floor(totalBeats / beatsPerMeasure) + 1;
    
    return { bar, beat: beatInBar, tick };
  }

  /** Format current time as MM:SS.mmm */
  getFormattedTime(): string {
    const totalSeconds = this._currentTime;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor((totalSeconds % 1) * 1000);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  }

  // ==========================================================================
  // LOOP CONTROL / CONTROLE DE LOOP
  // ==========================================================================

  /** Enable or disable looping */
  setLoopEnabled(enabled: boolean): void {
    this._loopEnabled = enabled;
    this.emit('loop:change', { enabled });
  }

  /** Check if loop is enabled */
  isLoopEnabled(): boolean {
    return this._loopEnabled;
  }

  /** Set loop points in seconds */
  setLoopPoints(start: number, end: number): void {
    this._loopStart = Math.max(0, start);
    this._loopEnd = Math.max(this._loopStart, end);
  }

  /** Get loop start time */
  getLoopStart(): number {
    return this._loopStart;
  }

  /** Get loop end time */
  getLoopEnd(): number {
    return this._loopEnd;
  }

  // ==========================================================================
  // TEMPO AND TIME SIGNATURE / RITMO E COMPASSO
  // ==========================================================================

  /** Set BPM (beats per minute) */
  setBPM(bpm: number): void {
    this._bpm = Math.max(20, Math.min(300, bpm));
    this.emit('bpm:change', { bpm: this._bpm });
  }

  /** Get current BPM */
  getBPM(): number {
    return this._bpm;
  }

  /** Set time signature */
  setTimeSignature(beatsPerMeasure: number, beatUnit: number): void {
    this._timeSignature = {
      beatsPerMeasure: Math.max(1, Math.min(32, beatsPerMeasure)),
      beatUnit: Math.max(1, Math.min(32, beatUnit)),
    };
  }

  /** Get current time signature */
  getTimeSignature(): TimeSignature {
    return { ...this._timeSignature };
  }

  /** Calculate duration of one bar in seconds */
  getBarDuration(): number {
    const secondsPerBeat = 60 / this._bpm;
    return secondsPerBeat * this._timeSignature.beatsPerMeasure * (4 / this._timeSignature.beatUnit);
  }

  /** Convert bars to seconds */
  barsToSeconds(bars: number): number {
    return bars * this.getBarDuration();
  }

  /** Convert seconds to bars */
  secondsToBars(seconds: number): number {
    return seconds / this.getBarDuration();
  }

  // ==========================================================================
  // RECORDING / GRAVAÇÃO
  // ==========================================================================

  /**
   * Start recording on armed tracks
   * Iniciar gravação nas faixas armadas
   */
  async startRecording(): Promise<void> {
    if (!this._context) throw new Error('Motor de áudio não inicializado');
    
    this._transportState = 'recording';
    this._recordingTracks.clear();
    
    // Find all armed tracks and start recording
    for (const [id, track] of this._tracks) {
      if (track.isArmed()) {
        try {
          await track.startRecording();
          this._recordingTracks.add(id);
        } catch (error) {
          console.error(`Erro ao iniciar gravação na faixa ${id}:`, error);
        }
      }
    }
    
    this._startPlaybackTimer();
    this.emit('record:start');
  }

  /**
   * Stop recording and return recorded buffers
   * Parar gravação e retornar buffers gravados
   */
  stopRecording(): Map<string, AudioBuffer> {
    this._transportState = 'stopped';
    this._stopPlaybackTimer();
    
    const recordedBuffers = new Map<string, AudioBuffer>();
    
    for (const id of this._recordingTracks) {
      const track = this._tracks.get(id);
      if (track) {
        const buffer = track.stopRecording();
        if (buffer) {
          recordedBuffers.set(id, buffer);
        }
      }
    }
    
    this._recordingTracks.clear();
    this.emit('record:stop', { buffers: Object.fromEntries(recordedBuffers) });
    
    return recordedBuffers;
  }

  /** Check if currently recording */
  isRecording(): boolean {
    return this._transportState === 'recording';
  }

  /** Get IDs of currently recording tracks */
  getRecordingTrackIds(): string[] {
    return Array.from(this._recordingTracks);
  }

  private _stopAllRecordings(): void {
    for (const id of this._recordingTracks) {
      const track = this._tracks.get(id);
      if (track && track.isCurrentlyRecording()) {
        track.stopRecording();
      }
    }
    this._recordingTracks.clear();
  }

  // ==========================================================================
  // WAVEFORM VISUALIZATION / VISUALIZAÇÃO DE FORMA DE ONDA
  // ==========================================================================

  /**
   * Generate waveform data from an AudioBuffer for visualization
   * Gerar dados de forma de onda de um AudioBuffer para visualização
   */
  generateWaveformData(buffer: AudioBuffer, targetPeaks: number = 1000): WaveformData {
    const rawData = buffer.getChannelData(0); // Use first channel
    const samplesPerPixel = Math.floor(rawData.length / targetPeaks);
    const peaks: Array<{ min: number; max: number }> = [];
    
    for (let i = 0; i < targetPeaks; i++) {
      const start = i * samplesPerPixel;
      const end = Math.min(start + samplesPerPixel, rawData.length);
      
      let min = 1.0;
      let max = -1.0;
      
      for (let j = start; j < end; j++) {
        const value = rawData[j];
        if (value < min) min = value;
        if (value > max) max = value;
      }
      
      peaks.push({ min, max });
    }
    
    return {
      samples: rawData,
      peaks,
      duration: buffer.duration,
      sampleRate: buffer.sampleRate,
    };
  }

  /**
   * Generate downsampled waveform for display
   * Gerar forma de onda subamostrada para exibição
   */
  generateDisplayWaveform(buffer: AudioBuffer, width: number): Float32Array {
    const rawData = buffer.getChannelData(0);
    const step = Math.floor(rawData.length / width);
    const waveform = new Float32Array(width);
    
    for (let i = 0; i < width; i++) {
      const start = i * step;
      let sum = 0;
      let count = 0;
      
      for (let j = 0; j < step && start + j < rawData.length; j++) {
        sum += Math.abs(rawData[start + j]);
        count++;
      }
      
      waveform[i] = count > 0 ? sum / count : 0;
    }
    
    return waveform;
  }

  /**
   * Get real-time waveform data from master bus
   * Obter dados de forma de onda em tempo real do barramento principal
   */
  getRealtimeWaveform(): Float32Array | null {
    return this._masterBus?.getWaveformFloatData() || null;
  }

  /**
   * Get real-time frequency data for spectrum analyzer
   * Obter dados de frequência em tempo real para analisador de espectro
   */
  getRealtimeFrequencyData(): Uint8Array | null {
    return this._masterBus?.getFrequencyData() || null;
  }

  /**
   * Get current master levels (peak and RMS)
   * Obter níveis atuais do mestre (pico e RMS)
   */
  getMasterLevels(): { peak: number; rms: number } | null {
    return this._masterBus?.getLevels() || null;
  }

  // ==========================================================================
  // MASTER BUS ACCESS / ACESSO AO BARRAMENTO PRINCIPAL
  // ==========================================================================

  /** Get the master bus instance */
  getMasterBus(): MasterBus | null {
    return this._masterBus;
  }

  /** Set master volume */
  setMasterVolume(volume: number): void {
    this._masterBus?.setVolume(volume);
  }

  /** Get master volume */
  getMasterVolume(): number {
    return this._masterBus?.getVolume() || 1;
  }

  // ==========================================================================
  // IMPORT / EXPORT / IMPORTAÇÃO / EXPORTAÇÃO
  // ==========================================================================

  /**
   * Load an audio file into an AudioBuffer
   * Carregar um arquivo de áudio em um AudioBuffer
   */
  async loadAudioFile(file: File): Promise<AudioBufferWithMeta> {
    if (!this._context) {
      throw new Error('Motor de áudio não inicializado');
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this._context.decodeAudioData(arrayBuffer);
    
    return {
      buffer: audioBuffer,
      name: file.name,
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate,
      numberOfChannels: audioBuffer.numberOfChannels,
    };
  }

  /**
   * Decode an ArrayBuffer to AudioBuffer
   * Decodificar um ArrayBuffer para AudioBuffer
   */
  async decodeAudioData(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
    if (!this._context) {
      throw new Error('Motor de áudio não inicializado');
    }
    
    return this._context.decodeAudioData(arrayBuffer);
  }

  /**
   * Export project/mix to WAV format
   * Exportar projeto/mix para formato WAV
   */
  async exportToWAV(options?: Partial<ExportOptions>): Promise<Blob> {
    if (!this._context) {
      throw new Error('Motor de áudio não inicializado');
    }
    
    const exportOptions: ExportOptions = {
      format: 'wav',
      sampleRate: options?.sampleRate || this._context.sampleRate,
      bitDepth: options?.bitDepth || 16,
      normalize: options?.normalize || true,
      includeEffects: options?.includeEffects || true,
      ...options,
    };
    
    // Collect all clips from all tracks
    const allBuffers: { buffer: AudioBuffer; startTime: number; offset: number }[] = [];
    
    for (const [, track] of this._tracks) {
      for (const clipId of track.getClipIds()) {
        const buffer = track.getClipBuffer(clipId);
        if (buffer) {
          allBuffers.push({ buffer, startTime: 0, offset: 0 });
        }
      }
    }
    
    if (allBuffers.length === 0) {
      // Return empty WAV if no content
      return this._createEmptyWAV(exportOptions.sampleRate!);
    }
    
    // Find maximum duration
    let maxDuration = 0;
    for (const { buffer } of allBuffers) {
      if (buffer.duration > maxDuration) {
        maxDuration = buffer.duration;
      }
    }
    
    // Create offline context for rendering
    const offlineCtx = new OfflineAudioContext(
      2, // Stereo
      Math.ceil(maxDuration * exportOptions.sampleRate!),
      exportOptions.sampleRate!
    );
    
    // Mix all buffers together
    const destination = offlineCtx.destination;
    
    for (const { buffer } of allBuffers) {
      const source = offlineCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(destination);
      source.start(0);
    }
    
    // Render
    const renderedBuffer = await offlineCtx.startRendering();
    
    // Normalize if requested
    if (exportOptions.normalize) {
      this._normalizeBuffer(renderedBuffer);
    }
    
    // Convert to WAV blob
    return this._audioBufferToWav(renderedBuffer, exportOptions.bitDepth!);
  }

  /**
   * Create empty WAV file
   */
  private _createEmptyWAV(sampleRate: number): Blob {
    const numChannels = 2;
    const length = sampleRate; // 1 second of silence
    const buffer = new ArrayBuffer(44 + length * numChannels * 2);
    const view = new DataView(buffer);
    
    // WAV header
    this._writeWAVHeader(view, numChannels, length, sampleRate, 16);
    
    return new Blob([buffer], { type: 'audio/wav' });
  }

  /**
   * Write WAV file header
   */
  private _writeWAVHeader(
    view: DataView,
    numChannels: number,
    numSamples: number,
    sampleRate: number,
    bitDepth: number
  ): void {
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const dataSize = numSamples * blockAlign;
    const headerSize = 44;
    
    // RIFF header
    this._writeString(view, 0, 'RIFF');
    view.setUint32(4, headerSize + dataSize - 8, true);
    this._writeString(view, 8, 'WAVE');
    
    // fmt chunk
    this._writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // chunk size
    view.setUint16(20, 1, true);  // PCM format
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    
    // data chunk
    this._writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);
  }

  /**
   * Write string to DataView
   */
  private _writeString(view: DataView, offset: number, str: string): void {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  /**
   * Normalize audio buffer
   */
  private _normalizeBuffer(buffer: AudioBuffer): void {
    const numChannels = buffer.numberOfChannels;
    let maxAmplitude = 0;
    
    // Find peak amplitude
    for (let ch = 0; ch < numChannels; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < data.length; i++) {
        const abs = Math.abs(data[i]);
        if (abs > maxAmplitude) maxAmplitude = abs;
      }
    }
    
    // Normalize to -0.99 dB (just below full scale)
    if (maxAmplitude > 0) {
      const normalizationFactor = 0.99 / maxAmplitude;
      for (let ch = 0; ch < numChannels; ch++) {
        const data = buffer.getChannelData(ch);
        for (let i = 0; i < data.length; i++) {
          data[i] *= normalizationFactor;
        }
      }
    }
  }

  /**
   * Convert AudioBuffer to WAV Blob
   */
  private _audioBufferToWav(buffer: AudioBuffer, bitDepth: number = 16): Blob {
    const numChannels = buffer.numberOfChannels;
    const length = buffer.length;
    const sampleRate = buffer.sampleRate;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const dataSize = length * blockAlign;
    const headerSize = 44;
    const totalSize = headerSize + dataSize;
    
    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);
    
    // Write header
    this._writeWAVHeader(view, numChannels, length, sampleRate, bitDepth);
    
    // Write interleaved samples
    let offset = headerSize;
    const channels: Float32Array[] = [];
    for (let ch = 0; ch < numChannels; ch++) {
      channels.push(buffer.getChannelData(ch));
    }
    
    for (let i = 0; i < length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        const sample = Math.max(-1, Math.min(1, channels[ch][i]));
        
        if (bitDepth === 16) {
          const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
          view.setInt16(offset, intSample, true);
          offset += 2;
        } else if (bitDepth === 24) {
          const intSample = sample < 0 ? sample * 0x800000 : sample * 0x7FFFFF;
          view.setInt32(offset, intSample << 8, true);
          offset += 3;
        } else if (bitDepth === 32) {
          view.setFloat32(offset, sample, true);
          offset += 4;
        }
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  /**
   * Download exported WAV file
   * Baixar arquivo WAV exportado
   */
  async downloadAsWAV(filename: string = 'ducklab-mix.wav'): Promise<void> {
    const blob = await this.exportToWAV();
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ==========================================================================
  // EVENT SYSTEM / SISTEMA DE EVENTOS
  // ==========================================================================

  /** Add event listener */
  on(event: EngineEventType, listener: EngineEventListener): void {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event)!.add(listener);
  }

  /** Remove event listener */
  off(event: EngineEventType, listener: EngineEventListener): void {
    this._listeners.get(event)?.delete(listener);
  }

  /** Emit event */
  private emit(event: EngineEventType, data?: unknown): void {
    this._listeners.get(event)?.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  // ==========================================================================
  // PLAYBACK TIMER / TEMPORIZADOR DE REPRODUÇÃO
  // ==========================================================================

  private _startPlaybackTimer(): void {
    this._stopPlaybackTimer();
    
    const lastTickTime = performance.now();
    
    this._playbackTimer = setInterval(() => {
      if (this._transportState !== 'playing' && this._transportState !== 'recording') {
        return;
      }
      
      const now = performance.now();
      const delta = (now - lastTickTime) / 1000;
      this._currentTime += delta;
      
      // Handle loop points
      if (this._loopEnabled && this._currentTime >= this._loopEnd) {
        this._currentTime = this._loopStart + (this._currentTime - this._loopEnd);
      }
      
      this.emit('timeupdate', { time: this._currentTime });
      
      // Emit recording data if recording
      if (this._transportState === 'recording') {
        const recordingData: RecordingData = {
          isRecording: true,
          duration: this._currentTime,
          peakLevel: this.getMasterLevels()?.peak || 0,
        };
        this.emit('record:data', recordingData);
      }
    }, this._schedulerInterval);
  }

  private _stopPlaybackTimer(): void {
    if (this._playbackTimer) {
      clearInterval(this._playbackTimer);
      this._playbackTimer = null;
    }
  }

  // ==========================================================================
  // UTILITY FUNCTIONS / FUNÇÕES UTILITÁRIAS
  // ==========================================================================

  /**
   * Generate a simple tone/sine wave for testing
   * Gerar um tom simples/onda senoidal para testes
   */
  generateTone(
    frequency: number = 440,
    duration: number = 1,
    type: OscillatorType = 'sine'
  ): AudioBuffer {
    if (!this._context) {
      throw new Error('Motor de áudio não inicializado');
    }
    
    const sampleRate = this._context.sampleRate;
    const numSamples = Math.floor(duration * sampleRate);
    const buffer = this._context.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      switch (type) {
        case 'sine':
          data[i] = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          data[i] = Math.sign(Math.sin(2 * Math.PI * frequency * t));
          break;
        case 'sawtooth':
          data[i] = 2 * ((frequency * t) % 1) - 1;
          break;
        case 'triangle':
          data[i] = 2 * Math.abs(2 * ((frequency * t) % 1) - 1) - 1;
          break;
      }
    }
    
    return buffer;
  }

  /**
   * Generate white noise
   * Gerar ruído branco
   */
  generateNoise(duration: number = 1, type: 'white' | 'pink' | 'brown' = 'white'): AudioBuffer {
    if (!this._context) {
      throw new Error('Motor de áudio não inicializado');
    }
    
    const sampleRate = this._context.sampleRate;
    const numSamples = Math.floor(duration * sampleRate);
    const buffer = this._context.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);
    
    if (type === 'white') {
      for (let i = 0; i < numSamples; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < numSamples; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0;
      for (let i = 0; i < numSamples; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    }
    
    return buffer;
  }

  /**
   * Generate click/metronome sound
   * Gerar som de clique/metronomo
   */
  generateClick(strong: boolean = true): AudioBuffer {
    if (!this._context) {
      throw new Error('Motor de áudio não inicializado');
    }
    
    const sampleRate = this._context.sampleRate;
    const duration = strong ? 0.05 : 0.03;
    const numSamples = Math.floor(duration * sampleRate);
    const buffer = this._context.createBuffer(1, numSamples, sampleRate);
    const data = buffer.getChannelData(0);
    
    const frequency = strong ? 1000 : 1500;
    const amplitude = strong ? 1 : 0.7;
    
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 80);
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * amplitude;
    }
    
    return buffer;
  }

  /**
   * Play a metronome click
   * Tocar clique do metrônomo
   */
  playMetronomeClick(): void {
    if (!this._context || !this._masterBus) return;
    
    const beat = this.getCurrentBeat();
    const isDownbeat = Math.round(beat) % this._timeSignature.beatsPerMeasure === 0;
    
    const clickBuffer = this.generateClick(isDownbeat);
    const source = this._context.createBufferSource();
    source.buffer = clickBuffer;
    
    const gainNode = this._context.createGain();
    gainNode.gain.value = 0.5;
    
    source.connect(gainNode);
    gainNode.connect(this._masterBus.inputNode);
    source.start();
  }
}

// ============================================================================
// SINGLETON INSTANCE / INSTÂNCIA SINGLETON
// ============================================================================

/**
 * Global audio engine singleton instance
 * Instância global singleton do motor de áudio
 */
let engineInstance: DuckLabAudioEngine | null = null;

/**
 * Get or create the audio engine singleton
 * Obter ou criar o singleton do motor de áudio
 */
export function getAudioEngine(): DuckLabAudioEngine {
  if (!engineInstance) {
    engineInstance = new DuckLabAudioEngine();
  }
  return engineInstance;
}

/**
 * Reset the audio engine singleton (for testing/cleanup)
 * Resetar o singleton do motor de áudio (para testes/limpeza)
 */
export function resetAudioEngine(): void {
  if (engineInstance) {
    engineInstance.dispose().catch(console.error);
    engineInstance = null;
  }
}

// ============================================================================
// UTILITY FUNCTIONS / FUNÇÕES UTILITÁRIAS
// ============================================================================

/**
 * Format seconds to MM:SS.ms
 * Formatar segundos para MM:SS.ms
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

/**
 * Format dB value for display
 * Formatar valor dB para exibição
 */
export function formatDB(value: number): string {
  if (value <= 0) return '-∞ dB';
  return `${Math.round(20 * Math.log10(value))} dB`;
}

/**
 * Linear to dB conversion
 * Conversão linear para dB
 */
export function linearToDB(linear: number): number {
  if (linear <= 0) return -Infinity;
  return 20 * Math.log10(linear);
}

/**
 * dB to linear conversion
 * Conversão dB para linear
 */
export function dbToLinear(db: number): number {
  if (db <= -Infinity) return 0;
  return Math.pow(10, db / 20);
}

/**
 * Clamp value between min and max
 * Restringir valor entre min e max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Generate unique ID
 * Gerar ID único
 */
export function generateId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
