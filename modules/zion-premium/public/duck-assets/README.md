# DUCK PROD — Portfolio Musical Interactivo

> Beatmaker · Mixagem · Masterização · Aracaju, Brasil

![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-2.0.0-blue)

## O que é

Portfolio web premium do **Duck**, produtor musical de Aracaju, Sergipe. Site interativo com instrumentos no navegador, animações GSAP, smooth scroll Lenis, e suporte a 4 idiomas.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| HTML5 | Semântico, acessível |
| CSS3 | Design tokens, 19 módulos |
| JS | Vanilla ES6+, modular |
| Animações | GSAP 3.12 + ScrollTrigger |
| Smooth Scroll | Lenis 1.3 |
| Áudio | Web Audio API |
| Fonts | Space Grotesk + Inter |

## Estrutura

```
DUCK-REPO-FINAL/
├── index.html          # Página principal
├── data.js             # Todos os dados do projeto
├── css/                # 19 módulos CSS
│   ├── tokens.css      # Design tokens (cores, tipografia)
│   ├── tokens-premium.css
│   ├── base.css        # Reset e estilos base
│   ├── utilities.css   # Classes utilitárias
│   ├── accessibility.css
│   ├── navigation.css
│   ├── hero.css
│   ├── sections.css
│   ├── instruments.css
│   ├── components.css
│   ├── buttons.css
│   ├── buttons-premium.css
│   ├── cards.css
│   ├── cards-premium.css
│   ├── forms.css
│   ├── modals.css
│   ├── animations-premium.css
│   ├── cursor.css
│   └── responsive.css
├── js/                 # 5 módulos JS
│   ├── main.js         # Lógica principal
│   ├── animations.js   # GSAP + ScrollTrigger
│   ├── hover-effects.js
│   ├── micro-interactions.js
│   └── particles.js
├── images/             # Imagens do projeto
├── scripts/            # Scripts de build/deploy
├── docs/               # Documentação
└── .github/            # Templates e CI
```

## Funcionalidades

- **Hero cinematográfico** com parallax, grain texture, cursor customizado
- **Piano interativo** com Web Audio API e atalhos de teclado
- **Rhythm Box** com 16 steps, swing, BPM control
- **Voice Visualizer** com efeitos (reverb, delay, autotune)
- **Gravador** com waveform e export
- **Idiomas**: PT-BR, EN, ES, FR
- **Stats animados** com counter up
- **Sticky nav** com scroll progress
- **30+ singles** filtráveis por gênero
- **Estúdio interativo** com 6 estações
- **Testemunhos** de artistas
- **Formulário de contato** funcional
- **Acessível**: skip nav, ARIA, keyboard nav, reduced motion
- **SEO**: Open Graph, JSON-LD, meta tags

## Setup

```bash
# Clone
git clone https://github.com/SEU_USER/duck-prod.git
cd duck-prod

# Abrir no navegador
# Sem build necessário - arquivos estáticos
open index.html

# Ou usar Live Server (VS Code)
code . && npx live-server
```

## Deploy

```bash
# Vercel
npx vercel --prod

# Netlify
npx netlify deploy --prod

# GitHub Pages
# Push para branch gh-pages
```

## Scripts Úteis

```bash
# Otimizar imagens
node scripts/optimize-images.js

# Minificar CSS/JS
node scripts/build.js

# Gerar sitemap
node scripts/generate-sitemap.js

# Lighthouse audit
npm run audit
```

## Licença

MIT — uso livre para projetos pessoais e comerciais.

---

*Feito com muito som e dedicação — Aracaju, Brasil*
