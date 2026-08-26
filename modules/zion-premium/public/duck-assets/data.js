// DUCK — Musical Producer Portfolio Data
// Data.js - All project data for the Duck website

const DUCK_DATA = {
  // Basic Info
  name: "Duck",
  location: "Aracaju, Brasil",
  coordinates: { lat: -10.9091, lng: -37.0671 },
  node: "ARACAJU-PRIMARY",
  status: "ONLINE",
  
  // Stats
  stats: {
    streams: 36000000,
    releases: 40,
    followers: 1400,
    yearsActive: 12,
    startYear: 2012
  },
  
  // Hero Backgrounds
  heroBackgrounds: [
    "images/VERDE/capa-1920x1080.jpg",
    "images/VERDE/capa-3-1920x1080.jpg",
    "images/VERDE/capa-4-1920x1080.jpg",
    "images/VERDE/setup-2-1920x1280.jpg",
    "images/VERDE/mix-3-1920x1280.jpg"
  ],
  
  // Services
  services: [
    {
      id: 1,
      title: "Beatmaking",
      description: "Criação de beats originais do zero. Trap, Pop, MPB, Funk. Cada beat é uma peça única projetada para sua visão.",
      icon: "🎹"
    },
    {
      id: 2,
      title: "Mixagem",
      description: "EQ dinâmico, compressão paralela, automação de panning. Cada instrumento ocupa exatamente o espaço que merece.",
      icon: "🎚️"
    },
    {
      id: 3,
      title: "Masterização",
      description: "Loudness competitivo para Spotify e todas as plataformas. O toque final que separa o bom do épico.",
      icon: "🔊"
    },
    {
      id: 4,
      title: "Arranjos",
      description: "Transformo ideias simples em produções completas. Arranjo, instrumentação e direção criativa.",
      icon: "🎵"
    },
    {
      id: 5,
      title: "Som para Vídeo",
      description: "Trilhas sonoras, sound design e mixagem para conteúdo audiovisual. Do curta-metragem ao anúncio publicitário.",
      icon: "🎬"
    },
    {
      id: 6,
      title: "Consultoria",
      description: "Sessões de orientação para artistas emergentes. Te ajudo a encontrar seu som e se posicionar no mercado.",
      icon: "💡"
    }
  ],
  
  // Singles
  singles: [
    {
      id: 1,
      title: "Slip N Slide",
      artist: "Duck4x, Naeedy, Luh One, Maal4km",
      type: "SINGLE",
      cover: "images/covers/track_slip-n-slide.jpg",
      link: "https://music.apple.com/us/album/slip-n-slide/1747165417",
      genre: "Trap"
    },
    {
      id: 2,
      title: "Cold",
      artist: "feat. Big Murdda",
      type: "SINGLE",
      cover: "images/covers/cold-feat-duck4x.jpg",
      link: "https://music.apple.com/us/album/cold-feat-duck4x/1895058889",
      genre: "Hip-Hop"
    },
    {
      id: 3,
      title: "Posturadona",
      artist: "Luiz Cinnamon",
      type: "PRODUCTION",
      cover: "images/covers/posturadona-256x255.png",
      link: "#",
      genre: "MPB"
    },
    {
      id: 4,
      title: "Tititi",
      artist: "Leones",
      type: "PRODUCTION",
      cover: "images/covers/tititi-254x256.png",
      link: "#",
      genre: "Pop"
    },
    {
      id: 5,
      title: "De Fininho",
      artist: "Leones",
      type: "PRODUCTION",
      cover: "images/covers/leones-254x256.png",
      link: "#",
      genre: "Pop"
    },
    {
      id: 6,
      title: "I Wrote a Song",
      artist: "Belentani",
      type: "PRODUCTION",
      cover: "images/covers/whrote-256x255.png",
      link: "#",
      genre: "R&B"
    },
    {
      id: 7,
      title: "Lento",
      artist: "Belentani",
      type: "PRODUCTION",
      cover: "images/covers/lento-256x256.jpg",
      link: "#",
      genre: "R&B"
    },
    {
      id: 8,
      title: "Mon Amour",
      artist: "Belentani",
      type: "PRODUCTION",
      cover: "images/covers/heart-256x255.png",
      link: "#",
      genre: "R&B"
    }
  ],
  
  // Tools/Ecosystem
  tools: [
    { icon: "🎛️", title: "MIDI CONTROLLER", description: "AKAI MPK Mini para programar beats y melodías directamente desde el hardware." },
    { icon: "🎚️", title: "MIXING CONSOLE", description: "Focusrite Scarlett 18i20 con 18 entradas y 20 salidas para sesiones completas." },
    { icon: "🔊", title: "MONITORES DE REFERENCIA", description: "Genelec 8040B para mezclas precisas en cada frecuencia." },
    { icon: "🎹", title: "SINTETIZADOR ANALÓGICO", description: "Moog Sub 37 para sonidos cálidos y texturas únicas." },
    { icon: "🥁", title: "DRUM MACHINE", description: "Elektron Digitakt para ritmos programables y samples." },
    { icon: "🎤", title: "CABINA DE GRAVAÇÃO", description: "Tratamiento acústico profesional con Neumann U87 y Shure SM7B." },
    { icon: "💻", title: "DAW PROFESIONAL", description: "Ableton Live Suite + Logic Pro para producción y mezcla." },
    { icon: "🎧", title: "AURICULARES", description: "Beyerdynamic DT 990 Pro para monitoreo detallado." },
    { icon: "📡", title: "INTERFAZ USB", description: "Universal Audio Apollo x8 para conversión AD/DA de alta resolución." },
    { icon: "🎸", title: "GUITARRA ELÉCTRICA", description: "Fender Stratocaster para grabar riffs y arreglos directos." },
    { icon: "🎻", title: "VIOLÍN / CUERDAS", description: "Muestras de cuerdas orquestales para capas cinematográficas." },
    { icon: "🎺", title: "SINTETIZADOR MODULAR", description: "Eurorack para sonidos experimentales y texturas únicas." },
    { icon: "🪘", title: "PERCUSIÓN ACÚSTICA", description: "Congas, bongós, cajón para ritmos orgánicos y world music." },
    { icon: "🎛️", title: "OUTBOARD GEAR", description: "Compresores analógicos y EQs para color y warmth en la cadena." },
    { icon: "💿", title: "SAMPLE LIBRARIES", description: "Spitfire, Native Instruments, Output para orquesta y sound design." },
    { icon: "🎹", title: "MIDI SEQUENCER", description: "Secuenciador MIDI para programar patrones complejos y automatizaciones." },
    { icon: "🎛️", title: "ANALIZADOR DE ESPECTRO", description: "Visualizacion de frecuencias en tiempo real para ajustes precisos." },
    { icon: "🎚️", title: "COMPRESOR MULTIBANDA", description: "Control dinamico por bandas de frecuencia para mezclas equilibradas." },
    { icon: "🔊", title: "REVERBERACION ESPACIAL", description: "Simulacion de espacios acusticos: estudio, concierto, iglesia, caverna." },
    { icon: "🎤", title: "DEESSER Y GATE", description: "Eliminacion de sibilancia y ruido de fondo en voces." },
    { icon: "🎧", title: "MONITORES DE CALLE", description: "Prueba de mezcla en auriculares baratos y parlantes de celular." },
    { icon: "🎹", title: "CHORD PROGRESSION", description: "Generador automatico de progresiones de acordes por tonalidad y genero." },
    { icon: "🔊", title: "SIDECHAIN COMPRESSION", description: "Efecto de \"bombeo\" para crear groove y movimiento en la mezcla." },
    { icon: "🎛️", title: "STEREO IMAGER", description: "Control del ancho estereo para crear amplitud y profundidad espacial." },
    { icon: "🎤", title: "TUNER Y PITCH CORRECTION", description: "Afinacion automatica y correccion de tono en tiempo real." }
  ],
  
  // Studio Stations
  stations: [
    {
      id: 1,
      name: "HOME STUDIO",
      description: "O coração da criação. Monitores de referência e tratamento acústico profissional.",
      image: "images/studio/setup-2-1440x960.jpg",
      specs: ["Genelec 8040B", "Universal Audio Apollo"]
    },
    {
      id: 2,
      name: "MIX STATION",
      description: "Onde a engenharia se torna arte. EQ, compressão, reverberação espacial.",
      image: "images/studio/setup-3-1440x960.jpg",
      specs: ["Yamaha HS8", "Focusrite Scarlett"]
    },
    {
      id: 3,
      name: "PRODUCTION",
      description: "Sintetizadores analógicos e controladores MIDI. O laboratório de sons.",
      image: "images/studio/setup-4-1440x960.jpg",
      specs: ["Moog Sub 37", "Elektron Digitakt"]
    },
    {
      id: 4,
      name: "RECORDING",
      description: "Cabine de gravação com tratamento acústico. Microfones de condensador e dinâmicos.",
      image: "images/studio/setup-5-1440x960.jpg",
      specs: ["Neumann U87", "Shure SM7B"]
    },
    {
      id: 5,
      name: "MIXING",
      description: "O refinamento final. Equalização, compressão, efeitos e automação.",
      image: "images/studio/mix-3-1440x960.jpg",
      specs: ["Slate VTM", "Soundtoys 5"]
    },
    {
      id: 6,
      name: "MASTERING",
      description: "O selo de qualidade. Loudness competitivo para todas as plataformas.",
      image: "images/studio/mix-6-1440x960.jpg",
      specs: ["iZotope Ozone 11", "Weiss DS1-MK3"]
    }
  ],
  
  // Gear Categories
  gear: {
    microphones: [
      { name: "Neumann U87 Ai", type: "Condensador" },
      { name: "Shure SM7B", type: "Dinâmico" }
    ],
    monitors: [
      { name: "Genelec 8040B", type: "Referência" },
      { name: "Yamaha HS8", type: "Near-field" }
    ],
    instruments: [
      { name: "Moog Sub 37", type: "Sintetizador" },
      { name: "Elektron Digitakt", type: "Drum Machine" }
    ],
    plugins: [
      { name: "Waves Mercury", type: "Bundle" },
      { name: "FabFilter Pro-Q 3", type: "EQ" }
    ]
  },
  
  // Testimonials
  testimonials: [
    {
      quote: "Duck não apenas produz beats, constrói universos sonoros. Cada frequência tem um propósito.",
      author: "Luiz Cinnamon",
      track: "Posturadona"
    },
    {
      quote: "A capacidade do Duck de interpretar o que quero e transformar em som é algo que não encontrei em nenhum outro produtor.",
      author: "Leones",
      track: "Tititi / De Fininho"
    },
    {
      quote: "Profissionalismo de outro nível. Desde a primeira reunião soube que estava em boas mãos.",
      author: "Belentani",
      track: "I Wrote a Song / Lento"
    }
  ],
  
  // Piano Notes
  pianoNotes: [
    { note: "C4", type: "white", key: "C" },
    { note: "C#4", type: "black", key: "C#", left: 42 },
    { note: "D4", type: "white", key: "D" },
    { note: "D#4", type: "black", key: "D#", left: 102 },
    { note: "E4", type: "white", key: "E" },
    { note: "F4", type: "white", key: "F" },
    { note: "F#4", type: "black", key: "F#", left: 222 },
    { note: "G4", type: "white", key: "G" },
    { note: "G#4", type: "black", key: "G#", left: 282 },
    { note: "A4", type: "white", key: "A" },
    { note: "A#4", type: "black", key: "A#", left: 342 },
    { note: "B4", type: "white", key: "B" },
    { note: "C5", type: "white", key: "C" }
  ],
  
  // Sound Frequencies (Hz)
  frequencies: {
    C4: 261.63,
    "C#4": 277.18,
    D4: 293.66,
    "D#4": 311.13,
    E4: 329.63,
    F4: 349.23,
    "F#4": 369.99,
    G4: 392.0,
    "G#4": 415.3,
    A4: 440.0,
    "A#4": 466.16,
    B4: 493.88,
    C5: 523.25
  },
  
  // Voice Effects Presets
  voicePresets: {
    normal: { autotune: 0, reverb: 0, pitch: 100, echo: 0, robot: 0 },
    singer: { autotune: 30, reverb: 40, pitch: 100, echo: 20, robot: 0 },
    chipmunk: { autotune: 0, reverb: 20, pitch: 180, echo: 0, robot: 0 },
    deep: { autotune: 0, reverb: 30, pitch: 70, echo: 0, robot: 0 },
    robot: { autotune: 0, reverb: 20, pitch: 100, echo: 30, robot: 80 },
    concert: { autotune: 0, reverb: 80, pitch: 100, echo: 40, robot: 0 }
  },
  
  // Ticker Messages
  tickerMessages: [
    "BEATMAKER",
    "MIXAGEM",
    "MASTERIZAÇÃO",
    "PRODUÇÃO MUSICAL",
    "ARACAJU",
    "36M+ STREAMS",
    "40+ LANÇAMENTOS",
    "DESDE 2012",
    "TRAP",
    "POP",
    "MPB",
    "FUNK",
    "R&B",
    "ESTÚDIO PROFISSIONAL",
    "EQUIPAMENTO DE ALTA"
  ],
  
  // Social Links
  social: {
    instagram: "https://instagram.com/duck4s",
    spotify: "#",
    soundcloud: "#",
    youtube: "#"
  },
  
  // Contact
  contact: {
    email: "contato@duckmusic.com.br",
    whatsapp: "+5579999999999",
    location: "Aracaju, SE, Brasil"
  },
  
  // Translations
  translations: {
    pt: {
      nav_about: "Sobre",
      nav_services: "Serviços",
      nav_portfolio: "Portfolio",
      nav_studio: "Estúdio",
      nav_instruments: "Instrumentos",
      nav_contact: "Contato",
      hero_sub: "Beatmaker · Mixagem · Masterização · 36M+ Streams",
      hero_desc: "Transformo a intenção do artista em arquitetura sonora de elite. Produção musical para artistas de nível nacional e internacional.",
      hero_cta1: "EXPLORAR ESTÚDIO",
      hero_cta2: "CONTRATAR →",
      about_lbl: "// 001 — SOBRE MIM",
      about_h: "ONDE O SOM SE TORNA ARTE",
      about_p1: "Sou Duck — beatmaker, produtor musical e engenheiro de som de Aracaju, Sergipe. Desde 2012, dedico minha vida a transformar a visão dos artistas em experiências sonoras que marcam. Com mais de 36 milhões de streams e 40 lançamentos, construí minha carreira na interseção entre tecnologia de ponta e sensibilidade artística.",
      about_p2: "Não produzo apenas beats — construo universos sonoros. Cada frequência tem propósito, cada textura conta uma história. Meu processo começa muito antes do primeiro acorde: escuto o artista, entendo a intenção, e depois arquiteto o som que vai conectar com milhões de ouvintes.",
      about_p3: "Do beatmaking à mixagem, da masterização aos arranjos completos — ofereço um ecossistema de produção musical completo. Trabalho com artistas emergentes e consolidados do Brasil e do exterior, sempre com o mesmo compromisso: excelência em cada frequência.",
      tl1: "Primeiras produções. Aprendendo as bases do beatmaking e da engenharia de som.",
      tl2: "Primeiro milhão de streams. O reconhecimento chega e os artistas começam a procurar.",
      tl3: "Estúdio profissional com 6 estações de trabalho. Capacidad de entrega completa.",
      tl5: "36M+ streams. Produções para artistas do Brasil e exterior.",
      svc_lbl: "// 002 — SERVIÇOS",
      svc_h: "O QUE FAÇO",
      studio_lbl: "// 008 — ESTÚDIO",
      studio_h: "ONDE A MÁGICA ACONTECE",
      inst_h: "Instrumentos Interativos",
      inst_p: "Experimente o estúdio pelo navegador",
      piano_t: "Piano",
      piano_t2: "Interativo",
      rhythm_t: "Rhythm",
      rhythm_t2: "Box",
      voice_t: "Voz",
      voice_t2: "Sintetizada",
      rec_t: "Voz",
      rec_t2: "Gravador",
      test_h: "O QUE DIZEM",
      test_p: "Artistas que confiaram no processo.",
      cta_h: "PRONTO PARA CRIAR?",
      cta_p: "Cada grande música começa com uma conversa. Me conte sua visão e transformemos em realidade.",
      cta1: "AGENDAR SESSÃO",
      cta2: "VER MAIS NO INSTAGRAM"
    },
    en: {
      nav_about: "About",
      nav_services: "Services",
      nav_portfolio: "Portfolio",
      nav_studio: "Studio",
      nav_instruments: "Instruments",
      nav_contact: "Contact",
      hero_sub: "Beatmaker · Mixing · Mastering · 36M+ Streams",
      hero_desc: "I transform the artist's intention into elite sound architecture. Musical production for national and international artists.",
      hero_cta1: "EXPLORE STUDIO",
      hero_cta2: "CONTACT →",
      about_lbl: "// 001 — ABOUT ME",
      about_h: "WHERE SOUND BECOMES ART",
      about_p1: "I'm Duck — beatmaker, music producer and sound engineer from Aracaju, Sergipe. Since 2012, I've dedicated my life to transforming artists' visions into impactful sonic experiences. With over 36 million streams and 40 releases, I built my career at the intersection of cutting-edge technology and artistic sensitivity.",
      about_p2: "I don't just produce beats — I build sonic universes. Every frequency has purpose, every texture tells a story. My process begins long before the first chord: I listen to the artist, understand the intention, and then architect the sound that will connect with millions of listeners.",
      about_p3: "From beatmaking to mixing, mastering to full arrangements — I offer a complete music production ecosystem. I work with emerging and established artists from Brazil and abroad, always with the same commitment: excellence in every frequency.",
      tl1: "First productions. Learning the foundations of beatmaking and sound engineering.",
      tl2: "First million streams. Recognition arrives and artists start seeking me out.",
      tl3: "Professional studio with 6 workstations. Complete delivery capability.",
      tl5: "36M+ streams. Productions for artists from Brazil and abroad.",
      svc_lbl: "// 002 — SERVICES",
      svc_h: "WHAT I DO",
      studio_lbl: "// 008 — STUDIO",
      studio_h: "WHERE MAGIC HAPPENS",
      inst_h: "Interactive Instruments",
      inst_p: "Experience the studio from your browser",
      piano_t: "Piano",
      piano_t2: "Interactive",
      rhythm_t: "Rhythm",
      rhythm_t2: "Box",
      voice_t: "Voice",
      voice_t2: "Synthesized",
      rec_t: "Voice",
      rec_t2: "Recorder",
      test_h: "WHAT THEY SAY",
      test_p: "Artists who trusted the process.",
      cta_h: "READY TO CREATE?",
      cta_p: "Every great song starts with a conversation. Tell me your vision and let's make it reality.",
      cta1: "BOOK SESSION",
      cta2: "SEE MORE ON INSTAGRAM"
    },
    es: {
      nav_about: "Sobre",
      nav_services: "Servicios",
      nav_portfolio: "Portfolio",
      nav_studio: "Estudio",
      nav_instruments: "Instrumentos",
      nav_contact: "Contacto",
      hero_sub: "Beatmaker · Mezcla · Masterización · 36M+ Streams",
      hero_desc: "Transformo la intención del artista en arquitectura sonora de élite. Producción musical para artistas de nivel nacional e internacional.",
      hero_cta1: "EXPLORAR ESTUDIO",
      hero_cta2: "CONTACTAR →",
      about_lbl: "// 001 — SOBRE MÍ",
      about_h: "DONDE EL SONIDO SE CONVIERTE EN ARTE",
      about_p1: "Soy Duck — beatmaker, productor musical e ingeniero de sonido de Aracaju, Sergipe. Desde 2012, dedico mi vida a transformar la visión de los artistas en experiencias sonoras impactantes. Con más de 36 millones de streams y 40 lanzamientos, construí mi carrera en la intersección entre tecnología de punta y sensibilidad artística.",
      about_p2: "No solo produzco beats — construyo universos sonoros. Cada frecuencia tiene propósito, cada textura cuenta una historia. Mi proceso comienza mucho antes del primer acorde: escucho al artista, entiendo la intención, y luego arquitecto el sonido que va a conectar con millones de oyentes.",
      about_p3: "Del beatmaking a la mezcla, de la masterización a los arreglos completos — ofrezco un ecosistema de producción musical completo. Trabajo con artistas emergentes y consolidados de Brasil y del exterior, siempre con el mismo compromiso: excelencia en cada frecuencia.",
      tl1: "Primeras producciones. Aprendiendo las bases del beatmaking y la ingeniería de sonido.",
      tl2: "Primer millón de streams. Llega el reconocimiento y los artistas empiezan a buscarme.",
      tl3: "Estudio profesional con 6 estaciones de trabajo. Capacidad de entrega completa.",
      tl5: "36M+ streams. Producciones para artistas de Brasil y el exterior.",
      svc_lbl: "// 002 — SERVICIOS",
      svc_h: "QUÉ HAGO",
      studio_lbl: "// 008 — ESTUDIO",
      studio_h: "DONDE OCURRE LA MAGIA",
      inst_h: "Instrumentos Interactivos",
      inst_p: "Experimenta el estudio desde tu navegador",
      piano_t: "Piano",
      piano_t2: "Interactivo",
      rhythm_t: "Rhythm",
      rhythm_t2: "Box",
      voice_t: "Voz",
      voice_t2: "Sintetizada",
      rec_t: "Voz",
      rec_t2: "Grabadora",
      test_h: "LO QUE DICEN",
      test_p: "Artistas que confiaron en el proceso.",
      cta_h: "¿LISTO PARA CREAR?",
      cta_p: "Toda gran canción comienza con una conversación. Cuéntame tu visión y hagámosla realidad.",
      cta1: "AGENDAR SESIÓN",
      cta2: "VER MÁS EN INSTAGRAM"
    },
    fr: {
      nav_about: "À propos",
      nav_services: "Services",
      nav_portfolio: "Portfolio",
      nav_studio: "Studio",
      nav_instruments: "Instruments",
      nav_contact: "Contact",
      hero_sub: "Beatmaker · Mixage · Mastering · 36M+ Streams",
      hero_desc: "Je transforme l'intention de l'artiste en architecture sonore d'élite. Production musicale pour des artistes de niveau national et international.",
      hero_cta1: "EXPLORER LE STUDIO",
      hero_cta2: "CONTACTER →",
      about_lbl: "// 001 — À PROPOS",
      about_h: "OÙ LE SON DEVIENT ART",
      about_p1: "Je suis Duck — beatmaker, producteur musical et ingénieur du son d'Aracaju, Sergipe. Depuis 2012, je consacre ma vie à transformer la vision des artistes en expériences sonores marquantes. Avec plus de 36 millions de streams et 40 sorties, j'ai construit ma carrière à l'intersection de la technologie de pointe et de la sensibilité artistique.",
      about_p2: "Je ne produis pas seulement des beats — je construis des univers sonores. Chaque fréquence a un but, chaque texture raconte une histoire. Mon processus commence bien avant le premier accord : j'écoute l'artiste, je comprends l'intention, puis j'architecte le son qui va connecter avec des millions d'auditeurs.",
      about_p3: "Du beatmaking au mixage, du mastering aux arrangements complets — j'offre un écosystème de production musicale complet. Je travaille avec des artistes émergents et établis du Brésil et de l'étranger, toujours avec le même engagement : l'excellence dans chaque fréquence.",
      tl1: "Premières productions. Apprentissage des bases du beatmaking et de l'ingénierie sonore.",
      tl2: "Premier million de streams. La reconnaissance arrive et les artistes commencent à me chercher.",
      tl3: "Studio professionnel avec 6 postes de travail. Capacité de livraison complète.",
      tl5: "36M+ streams. Productions pour des artistes du Brésil et de l'étranger.",
      svc_lbl: "// 002 — SERVICES",
      svc_h: "CE QUE JE FAIS",
      studio_lbl: "// 008 — STUDIO",
      studio_h: "OÙ LA MAGIE ARRIVE",
      inst_h: "Instruments Interactifs",
      inst_p: "Expérimentez le studio depuis votre navigateur",
      piano_t: "Piano",
      piano_t2: "Interactif",
      rhythm_t: "Rhythm",
      rhythm_t2: "Box",
      voice_t: "Voix",
      voice_t2: "Synthétisée",
      rec_t: "Voix",
      rec_t2: "Enregistreur",
      test_h: "CE QU'ILS DISENT",
      test_p: "Artistes qui ont fait confiance au processus.",
      cta_h: "PRÊT À CRÉER?",
      cta_p: "Toute grande chanson commence par une conversation. Parlez-moi de votre vision et réalisons-la.",
      cta1: "RÉSERVER UNE SESSION",
      cta2: "VOIR PLUS SUR INSTAGRAM"
    }
  },
  
  // Keyboard Shortcuts
  keyboardShortcuts: {
    piano: {
      "a": "C4",
      "w": "C#4",
      "s": "D4",
      "e": "D#4",
      "d": "E4",
      "f": "F4",
      "t": "F#4",
      "g": "G4",
      "y": "G#4",
      "h": "A4",
      "u": "A#4",
      "j": "B4",
      "k": "C5"
    }
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DUCK_DATA;
}
