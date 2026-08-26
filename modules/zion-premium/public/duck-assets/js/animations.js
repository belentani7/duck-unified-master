// animations.js — GSAP scroll animations for DUCK
(function() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Reveal sections on scroll
  gsap.utils.toArray('.sec').forEach(function(section) {
    gsap.from(section.querySelectorAll('.sec-lbl, .sec-h'), {
      scrollTrigger: { trigger: section, start: 'top 80%' },
      opacity: 0, y: 30, duration: 0.8, stagger: 0.15
    });
  });

  // Service cards stagger
  ScrollTrigger.batch('.svc', {
    onEnter: function(batch) { gsap.from(batch, { opacity: 0, y: 40, stagger: 0.1, duration: 0.6 }); },
    start: 'top 85%'
  });

  // Singles cards
  ScrollTrigger.batch('.single-item', {
    onEnter: function(batch) { gsap.from(batch, { opacity: 0, scale: 0.9, stagger: 0.08, duration: 0.5 }); },
    start: 'top 85%'
  });

  // Tool cards
  ScrollTrigger.batch('.tool-card', {
    onEnter: function(batch) { gsap.from(batch, { opacity: 0, y: 30, stagger: 0.05, duration: 0.5 }); },
    start: 'top 85%'
  });

  // Station cards
  ScrollTrigger.batch('.station-card', {
    onEnter: function(batch) { gsap.from(batch, { opacity: 0, y: 40, stagger: 0.12, duration: 0.6 }); },
    start: 'top 85%'
  });

  // Studio hero parallax
  gsap.to('.studio-hero-bg img', {
    y: -100,
    ease: 'none',
    scrollTrigger: { trigger: '.studio-hero', start: 'top bottom', end: 'bottom top', scrub: true }
  });

  // Timeline items
  gsap.utils.toArray('.tl-i').forEach(function(item, i) {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 85%' },
      opacity: 0, x: -30, duration: 0.5, delay: i * 0.15
    });
  });

  // Gallery items
  ScrollTrigger.batch('.gallery-item', {
    onEnter: function(batch) { gsap.from(batch, { opacity: 0, scale: 0.95, stagger: 0.06, duration: 0.4 }); },
    start: 'top 85%'
  });

  // Stats counter animation
  gsap.utils.toArray('.stat-n').forEach(function(el) {
    var target = parseInt(el.getAttribute('data-count'));
    if (!target) return;
    gsap.to(el, {
      textContent: target,
      duration: 2,
      snap: { textContent: 1 },
      scrollTrigger: { trigger: el, start: 'top 85%' },
      onUpdate: function() {
        var val = parseInt(el.textContent);
        if (target >= 1000000) el.textContent = (val / 1000000).toFixed(0) + 'M+';
        else if (target >= 1000) el.textContent = val.toLocaleString() + '+';
        else el.textContent = val + '+';
      }
    });
  });
})();
