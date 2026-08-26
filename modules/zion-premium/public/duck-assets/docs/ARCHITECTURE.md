# Arquitetura do Projeto DUCK PROD

## Visão Geral

```
┌─────────────────────────────────────────────┐
│                  index.html                  │
│            (Página Principal)                │
├─────────────┬──────────────┬────────────────┤
│   css/      │     js/      │    data.js     │
│  (19 file)  │   (5 files)  │  (Dados)       │
├─────────────┴──────────────┴────────────────┤
│              Dependências CDN               │
│  GSAP 3.12 · Lenis 1.3 · Web Audio API     │
└─────────────────────────────────────────────┘
```

## CSS Architecture

### Design Tokens (`tokens.css`)
Paleta de cores, escala tipográfica, spacing, shadows, transitions.

### Módulos (em ordem de carregamento)
1. `tokens.css` — Variáveis CSS
2. `tokens-premium.css` — Tokens extras
3. `base.css` — Reset + estilos base
4. `utilities.css` — Classes utilitárias
5. `accessibility.css` — Skip nav, focus, ARIA
6. `navigation.css` — Nav sticky, hamburger
7. `hero.css` — Hero section
8. `sections.css` — Seções gerais
9. `instruments.css` — Piano, rhythm, voice
10. `components.css` — Componentes genéricos
11. `buttons.css` — Botões base
12. `buttons-premium.css` — Botões animados
13. `cards.css` — Cards base
14. `cards-premium.css` — Cards com tilt/glass
15. `forms.css` — Formulários
16. `modals.css` — Modais e overlays
17. `animations-premium.css` — Keyframes
18. `cursor.css` — Custom cursor
19. `responsive.css` — Media queries

## JS Architecture

### Módulos
1. `data.js` — Dados centralizados (info, stats, singles, traduções)
2. `animations.js` — GSAP ScrollTrigger, parallax, reveals
3. `hover-effects.js` — Magnetic buttons, tilt cards
4. `micro-interactions.js` — Toggle, ripple, loading states
5. `particles.js` — Particle system para hero
6. `main.js` — Orquestrador, init, event listeners

### Fluxo de Inicialização
```
DOMContentLoaded
  → initLenis()        // Smooth scroll
  → initGSAP()         // ScrollTrigger setup
  → initParticles()    // Hero particles
  → initPiano()        // Web Audio API
  → initRhythm()       // Beat sequencer
  → initVoice()        // Voice visualizer
  → initRecorder()     // Audio recorder
  → initLanguage()     // i18n system
  → initNav()          // Navigation
  → initCursor()       // Custom cursor
```

## Data Flow

```
data.js (DUCK_DATA)
  ├── translations → applyLanguage(lang)
  ├── singles → renderSingles()
  ├── services → renderServices()
  ├── stations → renderStations()
  └── pianoNotes → initPiano()
```

## Performance Strategy

1. **Lazy loading** — Imagens com `loading="lazy"`
2. **Preload** — Fontes críticas, hero image
3. **Deferred JS** — Todos os scripts com `defer`
4. **CSS modular** — Carregamento sob demanda
5. **CDN** — GSAP, Lenis, Google Fonts
