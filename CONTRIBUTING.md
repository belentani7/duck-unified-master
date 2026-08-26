# Contributing to Duck Studio

Obrigado por ajudar a melhorar Duck Studio! 🦆

## Branch Strategy

```
main           → Produção (tags: v1.0.0)
  ↑
develop        → Staging (merge PRs aqui)
  ↑
feat/feature   → Novas features
fix/bug        → Bug fixes
refactor/name  → Refactors
docs/name      → Documentação
chore/name     → Dependências, config
```

## Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/YOUR_USER/duck-studio.git
   git checkout -b feat/my-feature
   ```

2. **Development**
   ```bash
   pnpm install
   pnpm dev
   ```

3. **Commit**
   ```bash
   git add .
   git commit -m "feat: descrição clara

   - Bullet point 1
   - Bullet point 2
   
   Closes #123"
   ```

4. **Push & PR**
   ```bash
   git push origin feat/my-feature
   # Abra PR no GitHub
   ```

---

## Code Standards

### TypeScript
- Strict mode enabled
- No `any` types (use `unknown` + type guards)
- Prop interfaces para componentes React

### Components
```typescript
interface ProductProps {
  id: string
  name: string
  onSelect?: (id: string) => void
}

export function Product({ id, name, onSelect }: ProductProps) {
  // Component
}
```

### Hooks
```typescript
export function useStudioData(studioId: string) {
  const [data, setData] = useState(null)
  // Logic
  return { data }
}
```

### Styling
- Tailwind CSS classes
- `cn()` para merge dinâmico
- Mobile-first responsive

```typescript
<div className={cn(
  'p-4 rounded-lg',
  'md:p-6 lg:p-8'
)}>
```

---

## Testing

Toda feature crítica precisa tests:

```bash
# Write tests
tests/unit/feature.test.ts

# Run
pnpm test
```

Example:
```typescript
describe('useStudioData', () => {
  it('loads data on mount', async () => {
    const { result } = renderHook(() => useStudioData('123'))
    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })
  })
})
```

---

## Format & Lint

```bash
# Auto-format
pnpm format

# Check
pnpm lint
pnpm check

# Fix auto
pnpm format
```

---

## PR Checklist

- [ ] Branch: `feat/`, `fix/`, etc
- [ ] Commit messages claros
- [ ] Tests adicionados
- [ ] Docs atualizadas
- [ ] `pnpm format` rodou
- [ ] `pnpm test` passando
- [ ] Type check OK: `pnpm check`

---

## Review Process

1. PR abre, CI roda automaticamente
2. Reviewer solicita mudanças
3. Push updates ao branch
4. Aprovação → merge automático
5. Deploy automático (main)

---

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type**: feat, fix, refactor, docs, chore, test  
**Scope**: componente/feature afetado  
**Subject**: descrição breve (imperative)

Example:
```
feat(commerce): add stripe integration

- Implement payment flow
- Add order confirmation email
- Add tests

Closes #456
```

---

## Development Tips

### Debug
```bash
DEBUG=duck:* pnpm dev
```

### Database
```bash
pnpm db:studio
```

### Component Library
```bash
# Storybook (if available)
pnpm storybook
```

---

## Getting Help

- 📖 Docs: [/docs](/docs)
- 🐛 Issues: GitHub Issues
- 💬 Discord: [Join]
- 📧 Email: dev@duckstudio.com

---

**Happy coding! 🦆**
