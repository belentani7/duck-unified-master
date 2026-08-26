# Development Setup Guide

## Prerequisites

- Node.js 20+
- pnpm 10+
- MySQL 8.0+
- Docker (optional)

## Local Development

### 1. Clone & Install
```bash
git clone https://github.com/your-org/duck-studio.git
cd duck-studio
pnpm install
```

### 2. Database Setup

**Option A: Docker**
```bash
docker-compose up -d mysql
pnpm db:push
```

**Option B: Local MySQL**
```bash
mysql -u root -p < db/init.sql
pnpm db:push
```

### 3. Environment
```bash
cp .env.example .env.local
# Edit with your secrets
```

### 4. Run Dev Server
```bash
pnpm dev
```

Browser: http://localhost:5173  
API: http://localhost:3000

---

## IDE Setup

### VS Code
Install extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Drizzle Kit
- Thunder Client (API testing)

### WebStorm/IntelliJ
- Built-in TypeScript support
- Enable ESLint inspection
- Set code style to Prettier

---

## Database

### Migrations
```bash
# Create new migration
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Studio browser
pnpm db:studio
```

### Seeding
```bash
pnpm db:seed
```

---

## Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage
```

---

## Debugging

### Server
```bash
DEBUG=duck:* pnpm dev
```

### Browser
Chrome DevTools → React DevTools

### Database
Use Drizzle Studio:
```bash
pnpm db:studio
```

---

## Troubleshooting

### Port already in use
```bash
# Find process
lsof -i :3000
# Kill
kill -9 <PID>
```

### Database connection failed
```bash
# Test connection
mysql -u user -p -h localhost -D duck_studio
```

### pnpm lockfile conflicts
```bash
rm pnpm-lock.yaml
pnpm install
```
