# Contribuindo com DUCK PROD

## Como Contribuir

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Convenções

- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`)
- **CSS**: Seguir BEM para nomenclatura de classes
- **JS**: Functions descritivas, sem `var`, usar `const`/`let`
- **Responsivo**: Mobile-first, testar em 375px, 768px, 1024px, 1440px

## Estrutura de Pastas

- `css/` — Arquivos CSS modulares
- `js/` — Scripts JavaScript modulares
- `images/` — Imagens otimizadas (WebP preferencial)
- `data.js` — Dados centralizados do projeto

## Reportar Bugs

Use o template de issue `bug_report.md` com:
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots se aplicável
- Navegador e versão
