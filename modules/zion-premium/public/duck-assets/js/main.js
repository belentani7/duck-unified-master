// DUCK — Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
  console.log('DUCK Website Initialized');
  var initFunctions = [
    { name: 'preloader', fn: initPreloader },
    { name: 'cursor', fn: initCursor },
    { name: 'ticker', fn: initTicker },
    { name: 'navigation', fn: initNavigation },
    { name: 'hamburger', fn: initHamburger },
    { name: 'languageSwitcher', fn: initLanguageSwitcher },
    { name: 'scrollProgress', fn: initScrollProgress },
    { name: 'hero', fn: initHero },
    { name: 'heroWaveform', fn: initHeroWaveform },
    { name: 'stats', fn: initStats },
    { name: 'about', fn: initAbout },
    { name: 'services', fn: initServices },
    { name: 'stations', fn: initStations },
    { name: 'gear', fn: initGear },
    { name: 'testimonials', fn: initTestimonials },
    { name: 'instruments', fn: initInstruments },
    { name: 'particles', fn: initParticlesCSS },
    { name: 'contactForm', fn: initContactForm },
    { name: 'lenis', fn: initLenis },
    { name: 'scrollAnimations', fn: initScrollAnimations }
  ];
  initFunctions.forEach(function(item) {
    try { item.fn(); } catch (e) { console.warn('[DUCK] ' + item.name + ' failed:', e.message); }
  });
  setTimeout(function() {
    var preloader = document.getElementById('slime-intro');
    if (preloader) { preloader.classList.add('done'); setTimeout(function() { preloader.remove(); }, 2000); }
  }, 3000);
});

function initPreloader() {
  var preloader = document.getElementById('slime-intro');
  if (!preloader) return;
  var drops = preloader.querySelectorAll('.slime-drop');
  drops.forEach(function(drop, i) { drop.style.animationDelay = (i * 0.1) + 's'; });
}

function initCursor() {
  var cursor = document.getElementById('cursor');
  if (!cursor || window.innerWidth < 768) return;
  var mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
  document.addEventListener('mousemove', function(e) { mouseX = e.clientX; mouseY = e.clientY; });
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  document.querySelectorAll('a, button, .single-item, .svc').forEach(function(el) {
    el.addEventListener('mouseenter', function() { cursor.classList.add('on'); });
    el.addEventListener('mouseleave', function() { cursor.classList.remove('on'); });
  });
}

function initTicker() {
  var ticker = document.getElementById('ticker');
  if (!ticker || typeof DUCK_DATA === 'undefined') return;
  var messages = DUCK_DATA.tickerMessages;
  ticker.innerHTML = messages.map(function(msg) { return '<span class="ti">' + msg + '</span>'; }).join('');
  ticker.innerHTML += ticker.innerHTML;
}

function initNavigation() {
  var nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', function() { nav.classList.toggle('stuck', window.scrollY > 100); });
  document.querySelectorAll('.nav-links a').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  var sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', function() {
    var current = '';
    sections.forEach(function(section) {
      if (window.scrollY >= section.offsetTop - 100) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-links a').forEach(function(link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });
}

function initHamburger() {
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

function initLanguageSwitcher() {
  var langBtns = document.querySelectorAll('.lang-btn');
  if (!langBtns.length || typeof DUCK_DATA === 'undefined') return;
  var currentLang = localStorage.getItem('duck-lang') || 'pt';
  function updateLanguage(lang) {
    var translations = DUCK_DATA.translations[lang];
    if (!translations) return;
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (translations[key]) el.textContent = translations[key];
    });
    langBtns.forEach(function(btn) { btn.classList.toggle('active', btn.dataset.lang === lang); });
    localStorage.setItem('duck-lang', lang);
  }
  langBtns.forEach(function(btn) {
    btn.addEventListener('click', function() { updateLanguage(btn.dataset.lang); });
  });
  updateLanguage(currentLang);
}

function initScrollProgress() {
  var progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;
  window.addEventListener('scroll', function() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
  });
}

function initHero() {
  var heroBgList = document.getElementById('hero-bg-list');
  if (!heroBgList || typeof DUCK_DATA === 'undefined') return;
  var items = heroBgList.querySelectorAll('.hero-bg-item');
  var currentIndex = 0;
  setInterval(function() {
    items[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % items.length;
    items[currentIndex].classList.add('active');
  }, 5000);
  if (typeof gsap !== 'undefined') {
    gsap.from('.hero-logo-wrap', { opacity: 0, scale: 0.8, duration: 1, delay: 3.5 });
    gsap.from('.hero-h', { opacity: 0, y: 50, duration: 1, delay: 3.7 });
    gsap.from('.hero-sub', { opacity: 0, y: 30, duration: 1, delay: 3.9 });
    gsap.from('.hero-badges', { opacity: 0, y: 20, duration: 1, delay: 4.1 });
    gsap.from('.hero-btns', { opacity: 0, y: 20, duration: 1, delay: 4.3 });
  }
}

function initHeroWaveform() {
  var container = document.getElementById('heroWaveform');
  if (!container) return;
  for (var i = 0; i < 25; i++) {
    var bar = document.createElement('div');
    bar.className = 'wb';
    bar.style.setProperty('--h', (Math.random() * 30 + 10) + 'px');
    bar.style.setProperty('--d', (Math.random() * 0.5 + 0.5) + 's');
    bar.style.animationDelay = (Math.random() * 0.5) + 's';
    container.appendChild(bar);
  }
}

function initStats() {
  var stats = document.querySelectorAll('.stat-n[data-count]');
  if (!stats.length) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.count));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(function(stat) { observer.observe(stat); });
}

function animateCounter(element, target) {
  var current = 0;
  var increment = target / 50;
  var timer = setInterval(function() {
    current += increment;
    if (current >= target) {
      if (target >= 1000000) element.textContent = (target / 1000000).toFixed(0) + 'M+';
      else if (target >= 1000) element.textContent = target.toLocaleString() + '+';
      else element.textContent = target + '+';
      clearInterval(timer);
    } else {
      if (target >= 1000000) element.textContent = (current / 1000000).toFixed(0) + 'M+';
      else if (target >= 1000) element.textContent = Math.floor(current).toLocaleString() + '+';
      else element.textContent = Math.floor(current) + '+';
    }
  }, 30);
}

function initAbout() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.about-txt', { scrollTrigger: { trigger: '.about-g', start: 'top 80%' }, opacity: 0, x: -50, duration: 1 });
  gsap.from('.about-img', { scrollTrigger: { trigger: '.about-g', start: 'top 80%' }, opacity: 0, x: 50, duration: 1 });
}

function initServices() {
  var grid = document.getElementById('services-grid');
  if (!grid || typeof DUCK_DATA === 'undefined') return;
  grid.innerHTML = DUCK_DATA.services.map(function(svc, i) {
    return '<div class="svc"><div class="svc-n">' + String(i + 1).padStart(2, '0') + '</div><h3>' + svc.title + '</h3><p>' + svc.description + '</p></div>';
  }).join('');
}

function initSingles() {
  var grid = document.getElementById('singles-grid');
  if (!grid || typeof DUCK_DATA === 'undefined') return;
  grid.innerHTML = DUCK_DATA.singles.map(function(single) {
    return '<a href="' + single.link + '" target="_blank" class="single-item"><img src="' + single.cover + '" alt="' + single.title + '" loading="lazy"><div class="single-over"><h4>' + single.title + '</h4><p>' + single.artist + '</p></div></a>';
  }).join('');
}

function initStations() {
  var grid = document.getElementById('stations-grid');
  if (!grid || typeof DUCK_DATA === 'undefined') return;
  grid.innerHTML = DUCK_DATA.stations.map(function(st, i) {
    return '<div class="station-card"><div class="station-img"><img src="' + st.image + '" alt="' + st.name + '" loading="lazy"><div class="station-overlay"><span class="station-number">' + String(i + 1).padStart(2, '0') + '</span></div></div><div class="station-info"><h4>' + st.name + '</h4><p>' + st.description + '</p><div class="station-specs">' + st.specs.map(function(s) { return '<span>' + s + '</span>'; }).join('') + '</div></div></div>';
  }).join('');
}

function initGear() {
  var grid = document.getElementById('gear-grid');
  if (!grid || typeof DUCK_DATA === 'undefined') return;
  var gearData = DUCK_DATA.gear;
  var categories = [
    { key: 'microphones', icon: 'MIC', title: 'MICROFONES' },
    { key: 'monitors', icon: 'MON', title: 'MONITORES' },
    { key: 'instruments', icon: 'INS', title: 'INSTRUMENTOS' },
    { key: 'plugins', icon: 'PLG', title: 'PLUGINS' }
  ];
  grid.innerHTML = categories.map(function(cat) {
    return '<div class="gear-category"><div class="gear-icon">' + cat.icon + '</div><h4>' + cat.title + '</h4><ul class="gear-list">' + gearData[cat.key].map(function(item) {
      return '<li><span class="gear-name">' + item.name + '</span><span class="gear-type">' + item.type + '</span></li>';
    }).join('') + '</ul></div>';
  }).join('');
}

function initTestimonials() {
  var grid = document.getElementById('testimonials-grid');
  if (!grid || typeof DUCK_DATA === 'undefined') return;
  grid.innerHTML = DUCK_DATA.testimonials.map(function(test) {
    return '<div class="testimonial-card"><div class="testimonial-quote">"' + test.quote + '"</div><div class="testimonial-author"><span class="testimonial-name">' + test.author + '</span><span class="testimonial-track">' + test.track + '</span></div></div>';
  }).join('');
}

function initInstruments() {
  initPiano();
  initRhythm();
  initVoice();
  initRecorder();
}

function initPiano() {
  var piano = document.getElementById('piano');
  var visualizer = document.getElementById('piano-visualizer');
  if (!piano || typeof DUCK_DATA === 'undefined') return;
  var audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (visualizer) {
    for (var i = 0; i < 20; i++) {
      var bar = document.createElement('div');
      bar.className = 'viz-bar';
      bar.style.height = '2px';
      visualizer.appendChild(bar);
    }
  }
  function playNote(frequency) {
    var oscillator = audioContext.createOscillator();
    var gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    if (visualizer) {
      visualizer.querySelectorAll('.viz-bar').forEach(function(vb) {
        vb.style.height = (Math.random() * 60 + 20) + 'px';
        setTimeout(function() { vb.style.height = '2px'; }, 100);
      });
    }
  }
  DUCK_DATA.pianoNotes.forEach(function(note) {
    var key = document.createElement('div');
    key.className = 'key ' + (note.type === 'black' ? 'key-black' : 'key-white');
    key.dataset.note = note.note;
    if (note.left) key.style.left = note.left + 'px';
    key.innerHTML = '<span class="key-label">' + note.key + '</span>';
    key.addEventListener('click', function() {
      var freq = DUCK_DATA.frequencies[note.note];
      if (freq) { playNote(freq); key.classList.add('active'); setTimeout(function() { key.classList.remove('active'); }, 100); }
    });
    piano.appendChild(key);
  });
  var shortcuts = DUCK_DATA.keyboardShortcuts.piano;
  document.addEventListener('keydown', function(e) {
    var note = shortcuts[e.key.toLowerCase()];
    if (note) {
      var freq = DUCK_DATA.frequencies[note];
      if (freq) {
        playNote(freq);
        var key = piano.querySelector('[data-note="' + note + '"]');
        if (key) { key.classList.add('active'); setTimeout(function() { key.classList.remove('active'); }, 100); }
      }
    }
  });
}

function initRhythm() {
  var kickGrid = document.getElementById('kick-grid');
  var snareGrid = document.getElementById('snare-grid');
  var hihatGrid = document.getElementById('hihat-grid');
  if (!kickGrid || !snareGrid || !hihatGrid) return;
  var audioContext = new (window.AudioContext || window.webkitAudioContext)();
  var isPlaying = false, currentStep = 0, intervalId = null;
  var patterns = { kick: new Array(16).fill(false), snare: new Array(16).fill(false), hihat: new Array(16).fill(false) };
  function createGrid(grid, pattern) {
    for (var i = 0; i < 16; i++) {
      var cell = document.createElement('div');
      cell.className = 'rhythm-cell';
      cell.dataset.step = i;
      cell.addEventListener('click', function() {
        var idx = parseInt(this.dataset.step);
        pattern[idx] = !pattern[idx];
        this.classList.toggle('active', pattern[idx]);
      });
      grid.appendChild(cell);
    }
  }
  createGrid(kickGrid, patterns.kick);
  createGrid(snareGrid, patterns.snare);
  createGrid(hihatGrid, patterns.hihat);
  function playSound(type) {
    var osc = audioContext.createOscillator();
    var gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    if (type === 'kick') { osc.frequency.value = 100; osc.type = 'sine'; gain.gain.setValueAtTime(1, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2); }
    else if (type === 'snare') { osc.frequency.value = 200; osc.type = 'triangle'; gain.gain.setValueAtTime(0.5, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1); }
    else if (type === 'hihat') { osc.frequency.value = 800; osc.type = 'square'; gain.gain.setValueAtTime(0.3, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05); }
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.2);
  }
  function playStep() {
    if (patterns.kick[currentStep]) playSound('kick');
    if (patterns.snare[currentStep]) playSound('snare');
    if (patterns.hihat[currentStep]) playSound('hihat');
    document.querySelectorAll('.rhythm-cell').forEach(function(cell) { cell.classList.remove('playing'); });
    document.querySelectorAll('[data-step="' + currentStep + '"]').forEach(function(cell) { cell.classList.add('playing'); });
    currentStep = (currentStep + 1) % 16;
  }
  var playBtn = document.getElementById('play-rhythm');
  var stopBtn = document.getElementById('stop-rhythm');
  var clearBtn = document.getElementById('clear-rhythm');
  var randomBtn = document.getElementById('random-rhythm');
  if (playBtn) playBtn.addEventListener('click', function() {
    if (!isPlaying) { isPlaying = true; intervalId = setInterval(playStep, 125); playBtn.classList.add('active'); }
  });
  if (stopBtn) stopBtn.addEventListener('click', function() {
    isPlaying = false; clearInterval(intervalId); currentStep = 0;
    document.querySelectorAll('.rhythm-cell').forEach(function(cell) { cell.classList.remove('playing'); });
    if (playBtn) playBtn.classList.remove('active');
  });
  if (clearBtn) clearBtn.addEventListener('click', function() {
    patterns.kick.fill(false); patterns.snare.fill(false); patterns.hihat.fill(false);
    document.querySelectorAll('.rhythm-cell').forEach(function(cell) { cell.classList.remove('active'); });
  });
  if (randomBtn) randomBtn.addEventListener('click', function() {
    patterns.kick = Array.from({length: 16}, function() { return Math.random() > 0.7; });
    patterns.snare = Array.from({length: 16}, function() { return Math.random() > 0.8; });
    patterns.hihat = Array.from({length: 16}, function() { return Math.random() > 0.5; });
    kickGrid.querySelectorAll('.rhythm-cell').forEach(function(cell, i) { cell.classList.toggle('active', patterns.kick[i]); });
    snareGrid.querySelectorAll('.rhythm-cell').forEach(function(cell, i) { cell.classList.toggle('active', patterns.snare[i]); });
    hihatGrid.querySelectorAll('.rhythm-cell').forEach(function(cell, i) { cell.classList.toggle('active', patterns.hihat[i]); });
  });
}

function initVoice() {
  var voiceWave = document.getElementById('voice-wave');
  if (!voiceWave) return;
  for (var i = 0; i < 50; i++) {
    var bar = document.createElement('div');
    bar.className = 'voice-wave-bar';
    bar.style.height = '2px';
    voiceWave.appendChild(bar);
  }
  var isPlaying = false, animationId = null;
  function animateWave() {
    if (!isPlaying) return;
    voiceWave.querySelectorAll('.voice-wave-bar').forEach(function(bar, i) {
      bar.style.height = (Math.sin(Date.now() / 200 + i * 0.3) * 40 + 50) + 'px';
    });
    animationId = requestAnimationFrame(animateWave);
  }
  function startVoice() { isPlaying = true; animateWave(); }
  function stopVoice() {
    isPlaying = false; cancelAnimationFrame(animationId);
    voiceWave.querySelectorAll('.voice-wave-bar').forEach(function(bar) { bar.style.height = '2px'; });
  }
  var voiceRaw = document.getElementById('voice-raw');
  var voiceMusic = document.getElementById('voice-music');
  var voiceMelody = document.getElementById('voice-melody');
  var stopVoiceBtn = document.getElementById('stop-voice');
  if (voiceRaw) voiceRaw.addEventListener('click', startVoice);
  if (voiceMusic) voiceMusic.addEventListener('click', startVoice);
  if (voiceMelody) voiceMelody.addEventListener('click', startVoice);
  if (stopVoiceBtn) stopVoiceBtn.addEventListener('click', stopVoice);
}

function initRecorder() {
  var recordBtn = document.getElementById('record-btn');
  var canvas = document.getElementById('recorder-canvas');
  if (!recordBtn || !canvas) return;
  var ctx = canvas.getContext('2d');
  var mediaRecorder = null, audioChunks = [], isRecording = false;
  recordBtn.addEventListener('click', function() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      mediaRecorder.ondataavailable = function(e) { audioChunks.push(e.data); };
      mediaRecorder.start();
      isRecording = true;
      var statusDot = document.getElementById('status-dot');
      var statusText = document.getElementById('status-text');
      var stopRecBtn = document.getElementById('stop-rec-btn');
      if (statusDot) statusDot.classList.add('recording');
      if (statusText) statusText.textContent = 'RECORDING...';
      recordBtn.classList.add('recording');
      if (stopRecBtn) stopRecBtn.disabled = false;
      var audioContext = new AudioContext();
      var source = audioContext.createMediaStreamSource(stream);
      var analyser = audioContext.createAnalyser();
      source.connect(analyser);
      var dataArray = new Uint8Array(analyser.frequencyBinCount);
      function visualize() {
        if (!isRecording) return;
        analyser.getByteTimeDomainData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#9acb6b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        var sliceWidth = canvas.width / dataArray.length;
        var x = 0;
        for (var i = 0; i < dataArray.length; i++) {
          var v = dataArray[i] / 128.0;
          var y = (v * canvas.height) / 2;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();
        requestAnimationFrame(visualize);
      }
      visualize();
    }).catch(function(err) {
      console.error('Microphone error:', err);
      var statusText = document.getElementById('status-text');
      if (statusText) statusText.textContent = 'MIC ACCESS DENIED';
    });
  });
  var stopRecBtn = document.getElementById('stop-rec-btn');
  if (stopRecBtn) stopRecBtn.addEventListener('click', function() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop(); isRecording = false;
      var statusDot = document.getElementById('status-dot');
      var statusText = document.getElementById('status-text');
      var playRecBtn = document.getElementById('play-rec-btn');
      if (statusDot) statusDot.classList.remove('recording');
      if (statusText) statusText.textContent = 'READY';
      recordBtn.classList.remove('recording');
      stopRecBtn.disabled = true;
      if (playRecBtn) playRecBtn.disabled = false;
    }
  });
  var playRecBtn = document.getElementById('play-rec-btn');
  if (playRecBtn) playRecBtn.addEventListener('click', function() {
    if (audioChunks.length === 0) return;
    var audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    var audio = new Audio(URL.createObjectURL(audioBlob));
    audio.play();
    var statusText = document.getElementById('status-text');
    if (statusText) statusText.textContent = 'PLAYING...';
    audio.onended = function() { if (statusText) statusText.textContent = 'READY'; };
  });
}

function initParticlesCSS() {
  var container = document.getElementById('particles');
  if (!container) return;
  for (var i = 0; i < 30; i++) {
    var p = document.createElement('div');
    p.style.cssText = 'position:fixed;width:' + (Math.random() * 4 + 2) + 'px;height:' + (Math.random() * 4 + 2) + 'px;background:rgba(154,203,107,' + (Math.random() * 0.3 + 0.05) + ');border-radius:50%;left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;pointer-events:none;z-index:1;animation:particleFloat ' + (Math.random() * 20 + 15) + 's linear infinite;animation-delay:' + (Math.random() * -20) + 's;';
    container.appendChild(p);
  }
  if (!document.getElementById('particle-keyframes')) {
    var style = document.createElement('style');
    style.id = 'particle-keyframes';
    style.textContent = '@keyframes particleFloat{0%{transform:translateY(0) translateX(0);opacity:0;}10%{opacity:1;}90%{opacity:1;}100%{transform:translateY(-100vh) translateX(50px);opacity:0;}}';
    document.head.appendChild(style);
  }
}

function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Mensagem enviada! Entraremos em contato.');
    form.reset();
  });
}

function initLenis() {
  if (typeof Lenis === 'undefined') return;
  var lenis = new Lenis({
    duration: 1.2,
    easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    direction: 'vertical',
    smooth: true,
  });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}

function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.sec').forEach(function(section) {
    gsap.from(section, { scrollTrigger: { trigger: section, start: 'top 80%' }, opacity: 0, y: 50, duration: 1 });
  });
  gsap.utils.toArray('.svc').forEach(function(card, i) {
    gsap.from(card, { scrollTrigger: { trigger: card, start: 'top 85%' }, opacity: 0, y: 30, duration: 0.5, delay: i * 0.1 });
  });
}
