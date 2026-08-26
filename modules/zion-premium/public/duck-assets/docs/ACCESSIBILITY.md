# Acessibilidade — DUCK PROD

## WCAG 2.1 Level AA

### Conformidade

| Critério | Status | Notas |
|----------|--------|-------|
| 1.1.1 Non-text Content | ✅ | Alt text em imagens |
| 1.3.1 Info and Relationships | ✅ | HTML semântico |
| 1.4.1 Use of Color | ✅ | Não é único indicador |
| 1.4.3 Contrast (Minimum) | ✅ | Ratio ≥ 4.5:1 |
| 1.4.4 Resize Text | ✅ | Até 200% sem perda |
| 2.1.1 Keyboard | ✅ | Navegação completa |
| 2.4.1 Bypass Blocks | ✅ | Skip navigation |
| 2.4.2 Page Titled | ✅ | Título descritivo |
| 2.4.3 Focus Order | ✅ | Ordem lógica |
| 2.4.6 Headings | ✅ | Hierarquia correta |
| 3.1.1 Language of Page | ✅ | lang="pt-BR" |
| 4.1.1 Parsing | ✅ | HTML válido |

### Recursos Implementados

#### Skip Navigation
```html
<a href="#main" class="skip-link">Skip to main content</a>
```

#### ARIA Labels
```html
<nav aria-label="Menu principal">
<button aria-label="Fechar menu">
<section aria-labelledby="sobre-heading">
```

#### Keyboard Navigation
- Tab: Navega por todos os elementos interativos
- Enter/Space: Ativa botões e links
- Escape: Fecha modais
- Arrow keys: Navega no piano

#### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### Focus Indicators
```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

### Testes

```bash
# axe-core
npx axe index.html

# WAVE
# https://wave.webaim.org

# Color Contrast
# https://webaim.org/resources/contrastchecker/
```
