# Performance — DUCK PROD

## Core Web Vitals Targets

| Métrica | Target | Status |
|---------|--------|--------|
| LCP | < 2.5s | ✅ |
| FID | < 100ms | ✅ |
| CLS | < 0.1 | ✅ |
| INP | < 200ms | ✅ |
| TTFB | < 800ms | ✅ |

## Checklist de Performance

### Imagens
- [ ] Formato WebP/AVIF
- [ ] Lazy loading (`loading="lazy"`)
- [ ] Dimensões explícitas (`width`/`height`)
- [ ] srcset para responsive
- [ ] Compressão quality 80

### CSS
- [ ] Critical CSS inline
- [ ] Non-critical async
- [ ] Minificado
- [ ] Sem unused CSS (>90% usage)
- [ ] Font display: swap

### JavaScript
- [ ] Defer/async em todos os scripts
- [ ] Code splitting
- [ ] Tree shaking
- [ ] Minificado
- [ ] Sem bundle > 200KB

### Fonts
- [ ] Preconnect Google Fonts
- [ ] font-display: swap
- [ ] Subsetting para PT/EN/ES
- [ ] WOFF2 format

### Server
- [ ] Gzip/Brotli compression
- [ ] Cache-Control headers
- [ ] ETags
- [ ] HTTP/2
- [ ] CDN

## Auditoria

```bash
# Lighthouse
npm run audit

# WebPageTest
# https://www.webpagetest.org

# PageSpeed Insights
# https://pagespeed.web.dev
```

## Otimizações Implementadas

1. **Lenis smooth scroll** — performático, GPU-accelerated
2. **GSAP ScrollTrigger** — hardware acceleration
3. **Deferred scripts** — não bloqueia render
4. **Preload hints** — fonts, critical CSS
5. **Lazy loading** — imagens below the fold
6. **CSS containment** — isola repaints
