# 🦆 DUCK STUDIO PLATFORM — Ecossistema Completo

Suite integrada de ferramentas para criação, gerenciamento e análise de conteúdo de áudio, vídeo e comunidade.

**Status**: ✅ Production-Ready | 🔧 Full Infrastructure | 📊 Monitoring Enabled | 🚀 Auto-Deploy

---

## 📋 Quick Start

```bash
# 1. Dependências
pnpm install

# 2. Configurar env
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 3. Database
pnpm db:push

# 4. Dev server
pnpm dev

# Acessa: http://localhost:5173
```

---

## 🏗️ Arquitetura

### Frontend (React 19)
- **Components**: Radix UI + Tailwind CSS
- **State**: React Query (tRPC)
- **Forms**: React Hook Form + Zod
- **UI Pattern**: Modular, Accessible, Dark mode

### Backend (Node.js)
- **API**: Express + tRPC + OpenAPI
- **DB**: MySQL 8 + Drizzle ORM
- **Auth**: JWT + Sessions
- **Cloud**: AWS S3 (file storage)

### Infrastructure
- **Container**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + Logs
- **Deploy**: Auto push to registry

---

## 📁 Estrutura

```
duck-studio/
├── src/                    # Frontend React
│   ├── components/        # UI Components (20+)
│   ├── hooks/            # Custom Hooks
│   ├── pages/            # Route Pages
│   ├── utils/            # Utilities
│   └── types/            # TypeScript Types
├── server/               # Backend Node.js
│   ├── _core/           # Core API logic
│   ├── routes/          # API Routes
│   └── middleware/      # Auth, Logging
├── db/                  # Database
│   ├── schemas/         # Drizzle Schemas
│   └── migrations/      # SQL Migrations
├── tests/               # Test Suite
│   ├── unit/           # Unit Tests
│   └── integration/    # Integration Tests
├── .github/workflows/  # CI/CD Pipelines
├── docs/               # Documentation
├── public/             # Static Assets
└── config/             # Build Configs
```

---

## 🛠️ Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Dev server (HMR + Watch) |
| `pnpm build` | Production build |
| `pnpm start` | Run prod server |
| `pnpm check` | Type check TypeScript |
| `pnpm format` | Format code (Prettier) |
| `pnpm lint` | Lint code (ESLint) |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm db:push` | Migrate database |
| `pnpm db:studio` | GUI database browser |

---

## 🔐 Environment Variables

**Critical** (obrigatórios):
- `DATABASE_URL` — MySQL connection
- `JWT_SECRET` — Token signing (min 32 chars)
- `AWS_*` — S3 file uploads

**Optional** (recomendado):
- `STRIPE_*` — Pagamentos
- `GOOGLE_MAPS_*` — Mapas
- `SENTRY_DSN` — Error tracking

Ver `.env.example` completo.

---

## 🚀 Deployment

### Docker
```bash
docker-compose up -d
```

### Manual
```bash
pnpm build
NODE_ENV=production pnpm start
```

### GitHub Actions
Auto-deploy ao fazer push para `main`:
1. Testes rodam
2. Build gera imagem Docker
3. Push registry
4. SSH deploy para servidor

---

## 📊 Modules

### Core Features
- **BeatLab**: Audio production + mixing
- **Commerce**: E-commerce + payments
- **CRM**: Contact management + automation
- **Analytics**: Real-time dashboards
- **Portal**: Public landing pages

### Admin
- **Control**: System settings
- **Resources**: Asset management
- **Privacy**: GDPR compliance
- **Licenses**: Product licensing

---

## 🧪 Testing

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage report
pnpm test --coverage
```

---

## 📚 Documentation

- [API Docs](./docs/API.md) — tRPC endpoint reference
- [Setup Guide](./docs/SETUP.md) — Development environment
- [Deployment](./docs/DEPLOY.md) — Production checklist
- [Contributing](./CONTRIBUTING.md) — Code standards
- [Architecture](./docs/ARCHITECTURE.md) — System design

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Tailwind CSS, Radix UI |
| **Backend** | Express, tRPC, OpenAPI |
| **Database** | MySQL 8, Drizzle ORM |
| **Build** | Vite, esbuild |
| **Testing** | Vitest, Testing Library |
| **Deployment** | Docker, GitHub Actions |
| **Monitoring** | Sentry, Structured Logs |
| **Auth** | JWT, Sessions |
| **Storage** | AWS S3 |

---

## 📝 License

MIT — Infraestrutura cedida ao Duck Studio por Belentani

---

## 👥 Support

- 📧 Email: support@duckstudio.com
- 💬 Discord: [Join Server]
- 🐛 Issues: GitHub Issues
- 📖 Wiki: [Project Wiki]

---

**Last Updated**: 2026-08-27  
**Maintainer**: Belentani  
**Status**: ✅ Active Development
