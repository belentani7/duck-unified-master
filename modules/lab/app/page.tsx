'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useDuckLabStore, formatTimeDisplay, formatBPMDisplay, formatTimeSignatureDisplay } from '@/lib/store'
import { getAudioEngine, type EffectParams } from '@/lib/audio-engine'
import { getAssetsLibrary, CATEGORY_NAMES, GENRE_NAMES, SUBCATEGORY_NAMES, type AssetMetadata, type AssetCategory, type Genre } from '@/lib/assets-library'

// Icons as simple SVG components
const PlayIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
)

const PauseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
)

const StopIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 6h12v12H6z"/>
  </svg>
)

const RecordIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8"/>
  </svg>
)

const LoopIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-5 h-5 ${active ? 'text-emerald-500' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 2l4 4-4 4M3 11V9a4 4 0 014-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"/>
  </svg>
)

const MetronomeIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-5 h-5 ${active ? 'text-emerald-500' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2v20M8 6l4-4 4 4M8 18l4 4 4-4M2 12h4M18 12h4"/>
  </svg>
)

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14"/>
  </svg>
)

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
)

const VolumeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
  </svg>
)

const MuteIcon = ({ muted }: { muted: boolean }) => (
  <svg className={`w-4 h-4 ${muted ? 'text-red-500' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
    {muted && <path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>}
  </svg>
)

const SoloIcon = ({ solo }: { solo: boolean }) => (
  <span className={`px-2 py-0.5 text-xs font-bold rounded ${solo ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-yellow-400 hover:text-white'}`}>
    S
  </span>
)

const ArmIcon = ({ armed }: { armed: boolean }) => (
  <span className={`px-2 py-0.5 text-xs font-bold rounded ${armed ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700 hover:bg-red-400 hover:text-white'}`}>
    R
  </span>
)

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
  </svg>
)

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
  </svg>
)

// Main App Component
export default function DuckLabDAW() {
  const {
    project,
    tracks,
    selectedTrackId,
    transportState,
    currentTime,
    loopEnabled,
    isMetronomeEnabled,
    panels,
    theme,
    assetBrowserResults,
    isLoading,
    
    // Actions
    addTrack,
    removeTrack,
    selectTrack,
    setTrackVolume,
    setTrackPan,
    toggleTrackMute,
    toggleTrackSolo,
    toggleTrackArm,
    play,
    pause,
    stop,
    togglePlayPause,
    startRecording,
    stopRecording,
    setCurrentTime,
    toggleLoop,
    toggleMetronome,
    setBPM,
    togglePanel,
    searchAssets,
    setSelectedAsset,
    initialize,
    isInitialized,
  } = useDuckLabStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | ''>('')
  const [selectedGenre, setSelectedGenre] = useState<Genre | ''>('')

  // Initialize UI state and the catalogue. The audio context is created only
  // from a playback or recording gesture, as required by modern browsers.
  useEffect(() => {
    if (isInitialized) return

    initialize()
    void getAssetsLibrary().initialize().catch(() => {
      useDuckLabStore.getState().addNotification({
        type: 'error',
        title: 'Biblioteca indisponível',
        message: 'Não foi possível carregar os ativos de áudio.',
      })
    })
  }, [isInitialized, initialize])

  // Handle search
  const handleSearch = useCallback(() => {
    const options: Parameters<typeof searchAssets>[0] = {
      query: searchQuery || undefined,
      category: selectedCategory || undefined,
      genre: selectedGenre || undefined,
      pageSize: 50,
    }
    searchAssets(options)
  }, [searchQuery, selectedCategory, selectedGenre, searchAssets])

  // Auto-search when filters change
  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.surfaceColor }}
    >
      {/* Header / Cabeçalho */}
      <header 
        className="flex items-center justify-between px-4 py-2 border-b shadow-sm"
        style={{ backgroundColor: theme.backgroundColor, borderColor: theme.gridColor }}
      >
        {/* Logo and Project Name */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <span className="text-white font-bold text-sm">DL</span>
            </div>
            <h1 className="text-xl font-bold" style={{ color: theme.primaryColor }}>
              Duck Lab
            </h1>
          </div>
          
          {/* Project Name */}
          <input
            type="text"
            aria-label="Nome do projeto"
            value={project.name}
            onChange={(e) => useDuckLabStore.getState().updateProject({ name: e.target.value })}
            className="px-3 py-1 border rounded-md bg-transparent focus:outline-none focus:ring-2"
            style={{ 
              color: theme.textColor,
              borderColor: theme.gridColor,
              '--tw-ring-color': theme.primaryColor 
            } as React.CSSProperties}
          />
        </div>

        {/* Transport Info */}
        <div className="flex items-center gap-6">
          {/* BPM Control */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium" style={{ color: theme.textColor }}>
              BPM:
            </label>
            <input
              type="number"
              aria-label="BPM do projeto"
              value={project.bpm}
              onChange={(e) => setBPM(Number(e.target.value))}
              className="w-16 px-2 py-1 text-center border rounded-md bg-transparent focus:outline-none focus:ring-2"
              style={{ 
                color: theme.textColor,
                borderColor: theme.gridColor,
                '--tw-ring-color': theme.primaryColor 
              } as React.CSSProperties}
              min={20}
              max={300}
            />
          </div>

          {/* Time Signature */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" style={{ color: theme.textColor }}>
              {formatTimeSignatureDisplay(project.timeSignature)}
            </span>
          </div>

          {/* Current Time */}
          <div 
            className="px-3 py-1 rounded-md font-mono text-sm"
            style={{ backgroundColor: theme.surfaceColor, color: theme.textColor }}
          >
            {formatTimeDisplay(currentTime)}
          </div>
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={() => {
            void getAudioEngine().downloadAsWAV(`${project.name}.wav`)
              .then(() => {
                useDuckLabStore.getState().addNotification({
                  type: 'success',
                  title: 'Exportação concluída',
                  message: 'Arquivo WAV exportado com sucesso!',
                })
              })
              .catch(() => {
                useDuckLabStore.getState().addNotification({
                  type: 'error',
                  title: 'Exportação indisponível',
                  message: 'Inicie o áudio antes de exportar o projeto.',
                })
              })
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: theme.primaryColor }}
        >
          <DownloadIcon />
          <span className="font-medium">Exportar WAV</span>
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Track List */}
        <aside 
          className="w-64 border-r flex flex-col"
          style={{ backgroundColor: theme.backgroundColor, borderColor: theme.gridColor }}
        >
          <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: theme.gridColor }}>
            <h2 className="font-semibold" style={{ color: theme.textColor }}>Faixas</h2>
            <button
              type="button"
              onClick={() => addTrack()}
              className="p-1 rounded-md hover:bg-opacity-80 transition-colors"
              style={{ color: theme.primaryColor }}
              title="Adicionar Faixa"
              aria-label="Adicionar faixa"
            >
              <PlusIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {tracks.map((track, index) => (
              <TrackCard
                key={track.id}
                track={track}
                index={index}
                isSelected={track.id === selectedTrackId}
                onSelect={() => selectTrack(track.id)}
                onRemove={() => removeTrack(track.id)}
                onVolumeChange={(vol) => setTrackVolume(track.id, vol)}
                onPanChange={(pan) => setTrackPan(track.id, pan)}
                onToggleMute={() => toggleTrackMute(track.id)}
                onToggleSolo={() => toggleTrackSolo(track.id)}
                onToggleArm={() => toggleTrackArm(track.id)}
                theme={theme}
              />
            ))}
            
            {tracks.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">Nenhuma faixa criada</p>
                <p className="text-xs mt-1">Clique em + para adicionar</p>
              </div>
            )}
          </div>
        </aside>

        {/* Main Timeline Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Transport Controls */}
          <TransportBar
            transportState={transportState}
            currentTime={currentTime}
            loopEnabled={loopEnabled}
            metronomeEnabled={isMetronomeEnabled}
            onPlay={play}
            onPause={pause}
            onStop={stop}
            onTogglePlayPause={togglePlayPause}
            onStartRecord={startRecording}
            onStopRecord={stopRecording}
            onToggleLoop={toggleLoop}
            onToggleMetronome={toggleMetronome}
            onTimeChange={setCurrentTime}
            theme={theme}
          />

          {/* Timeline Canvas */}
          <div 
            className="flex-1 relative overflow-hidden"
            style={{ backgroundColor: theme.backgroundColor }}
          >
            {/* Timeline Grid */}
            <TimelineGrid
              bpm={project.bpm}
              timeSignature={project.timeSignature}
              zoomLevel={useDuckLabStore.getState().timeline.zoomLevel}
              currentTime={currentTime}
              loopStart={useDuckLabStore.getState().loopStart}
              loopEnd={useDuckLabStore.getState().loopEnd}
              loopEnabled={loopEnabled}
              tracks={tracks}
              onTimeClick={(time) => setCurrentTime(time)}
              theme={theme}
            />

            {/* Playhead */}
            <Playhead
              time={currentTime}
              zoomLevel={useDuckLabStore.getState().timeline.zoomLevel}
              theme={theme}
            />
          </div>
        </main>

        {/* Right Panel - Mixer */}
        {panels.mixer && (
          <aside 
            className="w-72 border-l p-4 overflow-y-auto"
            style={{ backgroundColor: theme.backgroundColor, borderColor: theme.gridColor }}
          >
            <h2 className="font-semibold mb-4" style={{ color: theme.textColor }}>
              Mixer
            </h2>
            
            {/* Master Channel */}
            <MasterChannel theme={theme} />

            {/* Track Channels */}
            <div className="space-y-4 mt-6">
              {tracks.map((track) => (
                <ChannelStrip
                  key={track.id}
                  track={track}
                  onVolumeChange={(vol) => setTrackVolume(track.id, vol)}
                  onPanChange={(pan) => setTrackPan(track.id, pan)}
                  onEffectsChange={(effects) => useDuckLabStore.getState().setTrackEffects(track.id, effects)}
                  theme={theme}
                />
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Panel - Asset Browser */}
      {panels.assetBrowser && (
        <AssetBrowserPanel
          results={assetBrowserResults}
          isLoading={isLoading}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedGenre={selectedGenre}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onGenreChange={setSelectedGenre}
          onAssetSelect={setSelectedAsset}
          theme={theme}
        />
      )}

      {/* Toggle Asset Browser Button */}
        <button
          type="button"
          onClick={() => togglePanel('assetBrowser')}
          aria-expanded={panels.assetBrowser}
          aria-controls="biblioteca-de-ativos"
          className="fixed bottom-4 right-4 px-4 py-2 rounded-full shadow-lg text-white flex items-center gap-2 z-50"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <SearchIcon />
        <span className="font-medium">{panels.assetBrowser ? 'Fechar Biblioteca' : 'Biblioteca de Sons'}</span>
      </button>
    </div>
  )
}

// Track Card Component
function TrackCard({
  track,
  index,
  isSelected,
  onSelect,
  onRemove,
  onVolumeChange,
  onPanChange,
  onToggleMute,
  onToggleSolo,
  onToggleArm,
  theme,
}: {
  track: {
    id: string
    name: string
    color: string
    volume: number
    pan: number
    muted: boolean
    solo: boolean
    armed: boolean
  }
  index: number
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  onVolumeChange: (volume: number) => void
  onPanChange: (pan: number) => void
  onToggleMute: () => void
  onToggleSolo: () => void
  onToggleArm: () => void
  theme: { primaryColor: string; textColor: string; surfaceColor: string; gridColor: string }
}) {
  return (
    <div
      className={`p-3 rounded-lg transition-all ${
        isSelected ? 'ring-2 ring-offset-1' : ''
      }`}
      style={{
        backgroundColor: isSelected ? `${track.color}20` : theme.surfaceColor,
        borderColor: isSelected ? track.color : 'transparent',
        '--tw-ring-color': track.color,
      } as React.CSSProperties}
    >
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={isSelected}
          className="flex items-center gap-2 rounded text-left focus:outline-none focus:ring-2"
          style={{ color: theme.textColor, '--tw-ring-color': track.color } as React.CSSProperties}
        >
          <span
            aria-hidden="true"
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: track.color }}
          />
          <span className="font-medium text-sm truncate">{track.name}</span>
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover ${track.name}`}
          className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500"
        >
          <TrashIcon />
        </button>
      </div>

      <div className="space-y-2">
        {/* Volume Slider */}
        <div className="flex items-center gap-2">
          <VolumeIcon />
          <input
            type="range"
            aria-label={`Volume de ${track.name}`}
            min="0"
            max="1"
            step="0.01"
            value={track.volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="flex-1 h-1 accent-current"
            style={{ color: track.color }}
          />
          <span className="text-xs w-8 text-right" style={{ color: theme.textColor }}>
            {Math.round(track.volume * 100)}%
          </span>
        </div>

        {/* Pan Slider */}
        <div className="flex items-center gap-2">
          <span className="text-xs w-4 text-center" style={{ color: theme.textColor }}>L</span>
          <input
            type="range"
            aria-label={`Panorama de ${track.name}`}
            min="-1"
            max="1"
            step="0.01"
            value={track.pan}
            onChange={(e) => onPanChange(Number(e.target.value))}
            className="flex-1 h-1 accent-current"
            style={{ color: track.color }}
          />
          <span className="text-xs w-4 text-center" style={{ color: theme.textColor }}>R</span>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleMute}
              title={track.muted ? 'Ativar som' : 'Silenciar'}
              aria-label={track.muted ? `Ativar som de ${track.name}` : `Silenciar ${track.name}`}
              aria-pressed={track.muted}
            >
              <MuteIcon muted={track.muted} />
            </button>
            <button
              type="button"
              onClick={onToggleSolo}
              title={track.solo ? 'Desativar solo' : 'Ativar solo'}
              aria-label={track.solo ? `Desativar solo de ${track.name}` : `Ativar solo de ${track.name}`}
              aria-pressed={track.solo}
            >
              <SoloIcon solo={track.solo} />
            </button>
            <button
              type="button"
              onClick={onToggleArm}
              title={track.armed ? 'Desarmar gravação' : 'Armar para gravação'}
              aria-label={track.armed ? `Desarmar gravação de ${track.name}` : `Armar ${track.name} para gravação`}
              aria-pressed={track.armed}
            >
              <ArmIcon armed={track.armed} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Transport Bar Component
function TransportBar({
  transportState,
  currentTime,
  loopEnabled,
  metronomeEnabled,
  onPlay,
  onPause,
  onStop,
  onTogglePlayPause,
  onStartRecord,
  onStopRecord,
  onToggleLoop,
  onToggleMetronome,
  onTimeChange,
  theme,
}: {
  transportState: string
  currentTime: number
  loopEnabled: boolean
  metronomeEnabled: boolean
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onTogglePlayPause: () => void
  onStartRecord: () => void
  onStopRecord: () => void
  onToggleLoop: () => void
  onToggleMetronome: () => void
  onTimeChange: (time: number) => void
  theme: { primaryColor: string; textColor: string; surfaceColor: string; gridColor: string }
}) {
  const isPlaying = transportState === 'playing'
  const isRecording = transportState === 'recording'

  return (
    <div
      className="flex items-center justify-center gap-4 px-6 py-3 border-b"
      style={{ backgroundColor: theme.surfaceColor, borderColor: theme.gridColor }}
    >
      {/* Transport Buttons */}
      <div className="flex items-center gap-2">
        {/* Record Button */}
        <button
          type="button"
          onClick={isRecording ? onStopRecord : onStartRecord}
          aria-label={isRecording ? 'Parar gravação' : 'Iniciar gravação'}
          aria-pressed={isRecording}
          className={`p-3 rounded-full transition-all ${
            isRecording ? 'bg-red-500 animate-pulse' : 'hover:bg-red-100'
          }`}
          title={isRecording ? 'Parar Gravação' : 'Iniciar Gravação'}
        >
          <RecordIcon />
        </button>

        {/* Stop Button */}
        <button
          type="button"
          onClick={onStop}
          aria-label="Parar reprodução"
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          style={{ color: theme.textColor }}
          title="Parar"
        >
          <StopIcon />
        </button>

        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={onTogglePlayPause}
          aria-label={isPlaying ? 'Pausar reprodução' : 'Reproduzir projeto'}
          aria-pressed={isPlaying}
          className="p-3 rounded-full text-white transition-all"
          style={{ backgroundColor: isPlaying ? theme.primaryColor : theme.primaryColor }}
          title={isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      {/* Loop Toggle */}
      <button
        type="button"
        onClick={onToggleLoop}
        aria-label={loopEnabled ? 'Desativar loop' : 'Ativar loop'}
        aria-pressed={loopEnabled}
        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
        style={{ color: theme.textColor }}
        title={loopEnabled ? 'Desativar Loop' : 'Ativar Loop'}
      >
        <LoopIcon active={loopEnabled} />
      </button>

      {/* Metronome Toggle */}
      <button
        type="button"
        onClick={onToggleMetronome}
        aria-label={metronomeEnabled ? 'Desativar metrônomo' : 'Ativar metrônomo'}
        aria-pressed={metronomeEnabled}
        className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
        style={{ color: theme.textColor }}
        title={metronomeEnabled ? 'Desativar Metrônomo' : 'Ativar Metrônomo'}
      >
        <MetronomeIcon active={metronomeEnabled} />
      </button>

      {/* Time Display */}
      <div className="ml-4">
        <input
          type="range"
          aria-label="Posição de reprodução"
          min="0"
          max="300"
          step="0.01"
          value={currentTime}
          onChange={(e) => onTimeChange(Number(e.target.value))}
          className="w-48 accent-current"
          style={{ color: theme.primaryColor }}
        />
      </div>
    </div>
  )
}

// Timeline Grid Component
function TimelineGrid({
  bpm,
  timeSignature,
  zoomLevel,
  currentTime,
  loopStart,
  loopEnd,
  loopEnabled,
  tracks,
  onTimeClick,
  theme,
}: {
  bpm: number
  timeSignature: { beatsPerMeasure: number; beatUnit: number }
  zoomLevel: number
  currentTime: number
  loopStart: number
  loopEnd: number
  loopEnabled: boolean
  tracks: Array<{ id: string; name: string; color: string; clips: Array<{ id: string; name: string; startTime: number; duration: number }> }>
  onTimeClick: (time: number) => void
  theme: { gridColor: string; surfaceColor: string; primaryColor: string }
}) {
  const duration = 120 // Show 2 minutes of timeline
  const pixelsPerSecond = zoomLevel
  const totalWidth = duration * pixelsPerSecond

  // Generate time markers
  const markers: number[] = []
  const secondsPerBeat = 60 / bpm
  for (let t = 0; t <= duration; t += secondsPerBeat) {
    markers.push(t)
  }

  return (
    <div className="absolute inset-0 overflow-auto">
      <div style={{ width: totalWidth, minHeight: '100%' }} className="relative">
        {/* Time Ruler */}
        <div
          className="sticky top-0 h-8 border-b flex items-end z-10"
          style={{
            backgroundColor: theme.surfaceColor,
            borderColor: theme.gridColor,
          }}
        >
          {markers.map((t) => (
            <div
              key={t}
              className="absolute bottom-0 text-xs text-gray-500"
              style={{ left: t * pixelsPerSecond }}
            >
              <div className="w-px h-2 bg-gray-300 mb-1 mx-auto" />
              <span className="whitespace-nowrap transform -translate-x-1/2 block text-center">
                {formatTimeDisplay(t)}
              </span>
            </div>
          ))}
        </div>

        {/* Loop Region */}
        {loopEnabled && (
          <div
            className="absolute top-8 h-full opacity-30 pointer-events-none"
            style={{
              left: loopStart * pixelsPerSecond,
              width: (loopEnd - loopStart) * pixelsPerSecond,
              backgroundColor: theme.primaryColor,
            }}
          />
        )}

        {/* Track Lanes */}
        <div className="pt-8">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="h-20 border-b relative"
              style={{ borderColor: theme.gridColor }}
            >
              {/* Clips */}
              {track.clips.map((clip) => (
                <div
                  key={clip.id}
                  className="absolute top-2 h-16 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  style={{
                    left: clip.startTime * pixelsPerSecond,
                    width: Math.max(clip.duration * pixelsPerSecond, 20),
                    backgroundColor: track.color,
                    opacity: 0.85,
                  }}
                >
                  <div className="px-2 py-1 h-full flex flex-col justify-between">
                    <span className="text-xs font-medium text-white truncate">
                      {clip.name || 'Clip'}
                    </span>
                    <span className="text-xs text-white/70">
                      {formatTimeDisplay(clip.duration)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Click to seek */}
        <div
          className="absolute inset-0 pt-8 cursor-crosshair"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const time = x / pixelsPerSecond
            onTimeClick(Math.max(0, time))
          }}
        />
      </div>
    </div>
  )
}

// Playhead Component
function Playhead({
  time,
  zoomLevel,
  theme,
}: {
  time: number
  zoomLevel: number
  theme: { primaryColor: string }
}) {
  return (
    <div
      className="absolute top-0 w-0.5 h-full z-20 pointer-events-none"
      style={{
        left: time * zoomLevel,
        backgroundColor: theme.primaryColor,
      }}
    >
      <div
        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45"
        style={{ backgroundColor: theme.primaryColor }}
      />
    </div>
  )
}

// Master Channel Component
function MasterChannel({
  theme,
}: {
  theme: { primaryColor: string; textColor: string; surfaceColor: string; gridColor: string }
}) {
  const [masterVolume, setMasterVolume] = useState(1)
  
  return (
    <div
      className="p-4 rounded-lg border"
      style={{ backgroundColor: theme.surfaceColor, borderColor: theme.gridColor }}
    >
      <h3 className="text-sm font-semibold mb-3 text-center" style={{ color: theme.textColor }}>
        Mestre
      </h3>
      
      {/* Volume Fader */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-mono" style={{ color: theme.textColor }}>
          {Math.round(masterVolume * 100)}%
        </span>
        
        <div className="h-32 w-6 relative">
          <input
            type="range"
            aria-label="Volume mestre"
            min="0"
            max="1"
            step="0.01"
            value={masterVolume}
            onChange={(e) => {
              setMasterVolume(Number(e.target.value))
              getAudioEngine().setMasterVolume(Number(e.target.value))
            }}
            className="absolute inset-y-0 w-full appearance-none bg-transparent orient-vertical"
            style={{
              writingMode: 'vertical-lr',
              WebkitAppearance: 'slider-vertical',
            }}
          />
          
          {/* Visual indicator */}
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t"
            style={{
              height: `${masterVolume * 100}%`,
              background: `linear-gradient(to top, ${theme.primaryColor}, #34D399)`,
              opacity: 0.3,
            }}
          />
        </div>
        
        <VolumeIcon />
      </div>

      {/* Level Meters */}
      <LevelMeter channel="master" theme={theme} />
    </div>
  )
}

// Channel Strip Component
function ChannelStrip({
  track,
  onVolumeChange,
  onPanChange,
  onEffectsChange,
  theme,
}: {
  track: {
    id: string
    name: string
    color: string
    volume: number
    pan: number
    effects: EffectParams
  }
  onVolumeChange: (volume: number) => void
  onPanChange: (pan: number) => void
  onEffectsChange: (effects: EffectParams) => void
  theme: { primaryColor: string; textColor: string; surfaceColor: string; gridColor: string }
}) {
  const [showEffects, setShowEffects] = useState(false)
  const [effects, setEffects] = useState<EffectParams>(track.effects || {})

  const updateEffect = (key: keyof EffectParams, value: number) => {
    const newEffects = { ...effects, [key]: value }
    setEffects(newEffects)
    onEffectsChange(newEffects)
  }

  return (
    <div
      className="p-3 rounded-lg border"
      style={{ backgroundColor: theme.surfaceColor, borderColor: theme.gridColor }}
    >
      {/* Track Name */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: track.color }} />
          <span className="text-xs font-medium truncate" style={{ color: theme.textColor }}>
            {track.name}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowEffects(!showEffects)}
          aria-label={showEffects ? `Ocultar efeitos de ${track.name}` : `Mostrar efeitos de ${track.name}`}
          aria-expanded={showEffects}
          className="p-1 rounded hover:bg-gray-200"
        >
          <SettingsIcon />
        </button>
      </div>

      {/* Volume Fader */}
      <div className="flex items-center gap-2">
        <div className="h-24 w-4 relative">
          <input
            type="range"
            aria-label={`Volume do canal ${track.name}`}
            min="0"
            max="1"
            step="0.01"
            value={track.volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="absolute inset-y-0 w-full appearance-none bg-transparent"
            style={{
              writingMode: 'vertical-lr',
              WebkitAppearance: 'slider-vertical',
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t"
            style={{
              height: `${track.volume * 100}%`,
              background: `linear-gradient(to top, ${track.color}, ${track.color}88)`,
              opacity: 0.4,
            }}
          />
        </div>
        
        {/* Level Meter */}
        <LevelMeter channel={track.id} theme={theme} compact />
      </div>

      {/* Pan Knob */}
      <div className="mt-2 flex items-center gap-1">
        <span className="text-xs" style={{ color: theme.textColor }}>L</span>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.01"
          value={track.pan}
          onChange={(e) => onPanChange(Number(e.target.value))}
          className="flex-1 h-1"
          style={{ accentColor: track.color }}
        />
        <span className="text-xs" style={{ color: theme.textColor }}>R</span>
      </div>

      {/* Effects Section */}
      {showEffects && (
        <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: theme.gridColor }}>
          <p className="text-xs font-semibold" style={{ color: theme.textColor }}>Efeitos</p>
          
          {/* Reverb */}
          <div>
            <label className="text-xs" style={{ color: theme.textColor }}>Reverb</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={effects.reverbWet || 0}
              onChange={(e) => updateEffect('reverbWet', Number(e.target.value))}
              className="w-full h-1"
              style={{ accentColor: theme.primaryColor }}
            />
          </div>

          {/* Delay */}
          <div>
            <label className="text-xs" style={{ color: theme.textColor }}>Delay</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={effects.delayWet || 0}
              onChange={(e) => updateEffect('delayWet', Number(e.target.value))}
              className="w-full h-1"
              style={{ accentColor: theme.primaryColor }}
            />
          </div>

          {/* EQ Low */}
          <div>
            <label className="text-xs" style={{ color: theme.textColor }}>EQ Graves</label>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.1"
              value={effects.eqLowGain || 0}
              onChange={(e) => updateEffect('eqLowGain', Number(e.target.value))}
              className="w-full h-1"
              style={{ accentColor: theme.primaryColor }}
            />
          </div>

          {/* EQ High */}
          <div>
            <label className="text-xs" style={{ color: theme.textColor }}>EQ Agudos</label>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.1"
              value={effects.eqHighGain || 0}
              onChange={(e) => updateEffect('eqHighGain', Number(e.target.value))}
              className="w-full h-1"
              style={{ accentColor: theme.primaryColor }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Level Meter Component
function LevelMeter({
  channel,
  theme,
  compact = false,
}: {
  channel: string
  theme: { primaryColor: string }
  compact?: boolean
}) {
  const [level, setLevel] = useState(0)
  const [peak, setPeak] = useState(0)

  // Simulate level updates (in real app, this would come from audio engine)
  useEffect(() => {
    const interval = setInterval(() => {
      if (channel === 'master') {
        const levels = getAudioEngine().getMasterLevels()
        if (levels) {
          setLevel(levels.rms)
          setPeak(levels.peak)
        }
      }
    }, 50)

    return () => clearInterval(interval)
  }, [channel])

  const height = compact ? 24 : 96

  return (
    <div className={`flex gap-0.5 ${compact ? 'h-6' : 'h-24'}`}>
      {/* Left Channel */}
      <div className="w-1.5 bg-gray-800 rounded-sm relative overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-75"
          style={{
            height: `${level * 100}%`,
            background: `linear-gradient(to top, ${theme.primaryColor}, #EF4444)`,
          }}
        />
        {peak > 0.9 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
        )}
      </div>
      
      {/* Right Channel */}
      <div className="w-1.5 bg-gray-800 rounded-sm relative overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-75"
          style={{
            height: `${level * 100}%`,
            background: `linear-gradient(to top, ${theme.primaryColor}, #EF4444)`,
          }}
        />
        {peak > 0.9 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
        )}
      </div>
    </div>
  )
}

// Asset Browser Panel Component
function AssetBrowserPanel({
  results,
  isLoading,
  searchQuery,
  selectedCategory,
  selectedGenre,
  onSearchChange,
  onCategoryChange,
  onGenreChange,
  onAssetSelect,
  theme,
}: {
  results: { items: AssetMetadata[]; totalItems: number; totalPages: number } | null
  isLoading: boolean
  searchQuery: string
  selectedCategory: AssetCategory | ''
  selectedGenre: Genre | ''
  onSearchChange: (query: string) => void
  onCategoryChange: (category: AssetCategory | '') => void
  onGenreChange: (genre: Genre | '') => void
  onAssetSelect: (asset: AssetMetadata | null) => void
  theme: { backgroundColor: string; textColor: string; surfaceColor: string; gridColor: string; primaryColor: string }
}) {
  const categories: Array<AssetCategory | ''> = ['', 'drums', 'bass', 'melodic', 'vocals', 'fx']
  const genres: Array<Genre | ''> = ['', 'hip-hop', 'electronic', 'rock', 'jazz', 'lofi', 'reggaeton']

  return (
    <div
      id="biblioteca-de-ativos"
      aria-label="Biblioteca de ativos"
      className="border-t max-h-80 flex flex-col"
      style={{ backgroundColor: theme.backgroundColor, borderColor: theme.gridColor }}
    >
      {/* Search Bar */}
      <div className="p-4 border-b flex gap-4" style={{ borderColor: theme.gridColor }}>
        <div className="flex-1 relative">
          <input
            type="text"
            aria-label="Buscar ativos"
            placeholder="Buscar ativos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{
              backgroundColor: theme.surfaceColor,
              color: theme.textColor,
              borderColor: theme.gridColor,
              '--tw-ring-color': theme.primaryColor,
            } as React.CSSProperties}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: theme.textColor }}>
            <SearchIcon />
          </div>
        </div>

        {/* Category Filter */}
        <select
          aria-label="Filtrar por categoria"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as AssetCategory | '')}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.surfaceColor,
            color: theme.textColor,
            borderColor: theme.gridColor,
            '--tw-ring-color': theme.primaryColor,
          } as React.CSSProperties}
        >
          <option value="">Todas Categorias</option>
          {categories.filter(Boolean).map((cat) => (
            <option key={cat} value={cat}>{CATEGORY_NAMES[cat as AssetCategory]}</option>
          ))}
        </select>

        {/* Genre Filter */}
        <select
          aria-label="Filtrar por gênero"
          value={selectedGenre}
          onChange={(e) => onGenreChange(e.target.value as Genre | '')}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.surfaceColor,
            color: theme.textColor,
            borderColor: theme.gridColor,
            '--tw-ring-color': theme.primaryColor,
          } as React.CSSProperties}
        >
          <option value="">Todos Gêneros</option>
          {genres.filter(Boolean).map((genre) => (
            <option key={genre} value={genre}>{GENRE_NAMES[genre as Genre]}</option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <div className="px-4 py-2 text-sm" style={{ color: theme.textColor }}>
        {results ? `${results.totalItems} ativos encontrados` : 'Carregando...'}
      </div>

      {/* Results Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: theme.primaryColor }} />
          </div>
        ) : results?.items && results.items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {results.items.slice(0, 24).map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onClick={() => onAssetSelect(asset)}
                theme={theme}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Nenhum ativo encontrado</p>
            <p className="text-sm mt-1">Tente ajustar os filtros de busca</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Asset Card Component
function AssetCard({
  asset,
  onClick,
  theme,
}: {
  asset: AssetMetadata
  onClick: () => void
  theme: { surfaceColor: string; textColor: string; primaryColor: string; gridColor: string }
}) {
  const categoryColors: Record<string, string> = {
    drums: '#F59E0B',
    bass: '#3B82F6',
    melodic: '#10B981',
    vocals: '#EC4899',
    fx: '#8B5CF6',
  }
  const waveformBars = Array.from({ length: 12 }, (_, index) => {
    const charCode = asset.id.charCodeAt(index % asset.id.length)
    return 30 + ((charCode * (index + 11)) % 70)
  })

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Selecionar ativo ${asset.name}`}
      className="p-3 rounded-lg border cursor-pointer text-left hover:shadow-md transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2"
      style={{
        backgroundColor: theme.surfaceColor,
        borderColor: theme.gridColor,
      }}
    >
      {/* Waveform Placeholder */}
      <div
        className="h-12 rounded mb-2 flex items-center justify-center"
        style={{ backgroundColor: `${categoryColors[asset.category]}20` }}
      >
        <div className="flex items-end gap-0.5 h-8">
          {waveformBars.map((height, i) => (
            <div
              key={i}
              className="w-1 rounded-full"
              style={{
                height: `${height}%`,
                backgroundColor: categoryColors[asset.category],
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>

      {/* Asset Info */}
      <h4 className="text-sm font-medium truncate" style={{ color: theme.textColor }}>
        {asset.name}
      </h4>
      
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs px-1.5 py-0.5 rounded" style={{ 
          backgroundColor: `${categoryColors[asset.category]}20`, 
          color: categoryColors[asset.category] 
        }}>
          {SUBCATEGORY_NAMES[asset.subCategory] || asset.subCategory}
        </span>
        
        {asset.bpm > 0 && (
          <span className="text-xs" style={{ color: theme.textColor }}>
            {asset.bpm} BPM
          </span>
        )}
      </div>

      {asset.key && (
        <span className="text-xs block mt-1" style={{ color: theme.textColor }}>
          Tom: {asset.key.toUpperCase()}
        </span>
      )}
    </button>
  )
}
