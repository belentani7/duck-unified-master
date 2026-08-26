# System Architecture

## Overview

Duck Studio é uma plataforma full-stack de produção de conteúdo com:
- **Frontend**: SPA React moderno
- **Backend**: Express + tRPC + OpenAPI
- **Database**: MySQL 8
- **Cloud**: AWS S3
- **Cache**: Redis

---

## Application Layers

### Presentation Layer
- React 19 Components (Radix UI)
- Tailwind CSS + custom theme
- Framer Motion animations
- Client-side routing (Wouter)

### API Layer
- tRPC routers (type-safe)
- OpenAPI spec generation
- JWT authentication
- Rate limiting middleware

### Business Logic
- Domain models (Studio, Product, Order, etc)
- Service classes
- Validation (Zod)
- Authorization rules

### Data Layer
- Drizzle ORM
- MySQL database
- Redis cache
- S3 object storage

---

## Architecture Diagram

```
┌─────────────────────────────────────┐
│     Browser / Client App            │
│    (React 19 + Tailwind CSS)       │
└────────────┬────────────────────────┘
             │
        HTTPS/WebSocket
             │
┌────────────▼────────────────────────┐
│      Vite Dev Server / CDN          │
│    (index.html, assets, chunks)     │
└────────────┬────────────────────────┘
             │
        API Requests
             │
┌────────────▼────────────────────────┐
│    Express Server (Node.js)         │
│  ┌──────────────────────────────┐   │
│  │ Middleware (Auth, Log, CORS) │   │
│  ├──────────────────────────────┤   │
│  │ tRPC Router                  │   │
│  │  - studio.router             │   │
│  │  - product.router            │   │
│  │  - crm.router                │   │
│  │  - analytics.router          │   │
│  ├──────────────────────────────┤   │
│  │ Services & Business Logic    │   │
│  │  - StudioService             │   │
│  │  - OrderService              │   │
│  │  - PaymentService            │   │
│  └──────────────────────────────┘   │
└────────────┬────────────────────────┘
             │
    ┌────────┴────────┬──────────────┐
    │                 │              │
┌───▼────┐    ┌──────▼───┐    ┌─────▼──┐
│ MySQL  │    │  Redis   │    │ AWS S3 │
│ Primary│    │  Cache   │    │Storage │
│Database│    │          │    │        │
└────────┘    └──────────┘    └────────┘
```

---

## Request Flow

1. **Client → API**
   - React component calls tRPC hook
   - Request batched (if configured)
   - Sent over HTTP

2. **Server → Validation**
   - Express middleware processes
   - Zod schema validates
   - JWT token verified

3. **Business Logic**
   - Service layer processes
   - Database queries optimized
   - Cache checked first

4. **Database**
   - Drizzle ORM builds query
   - MySQL executes
   - Redis caches result

5. **Response → Client**
   - tRPC serializes (superjson)
   - React Query caches
   - Component updates

---

## Database Schema

```
users
  ├─ id (PK)
  ├─ email (UNIQUE)
  ├─ password_hash
  └─ role

studios
  ├─ id (PK)
  ├─ user_id (FK)
  ├─ name
  └─ slug (UNIQUE)

products
  ├─ id (PK)
  ├─ studio_id (FK)
  ├─ name
  └─ price

orders
  ├─ id (PK)
  ├─ user_id (FK)
  ├─ total
  └─ status

contacts (CRM)
  ├─ id (PK)
  ├─ user_id (FK)
  ├─ email
  └─ phone
```

---

## Security

- **Authentication**: JWT tokens (expire in 7 days)
- **Authorization**: Role-based access control
- **API Security**: tRPC validation, rate limiting
- **Data**: Encrypted in transit (HTTPS)
- **Secrets**: Environment variables, never in code
- **Database**: SQL injection prevention via ORM

---

## Performance

- **Caching**: Redis (TTL configurable)
- **Code Splitting**: Vite chunks vendors
- **Database Indexing**: Composite indexes on foreign keys
- **API**: tRPC batching, automatic request deduplication
- **CDN**: Static assets on edge

---

## Deployment

### Development
```
Local: pnpm dev
```

### Production
```
Docker: docker-compose up -d
K8s: kubectl apply -f k8s/
SSH: automated CI/CD
```

---

## Monitoring & Logging

- **Errors**: Sentry integration
- **Logs**: JSON structured logging
- **Metrics**: Prometheus scraping (optional)
- **Traces**: Request tracing (optional)
- **Health**: /api/health endpoint

---

## Scaling Considerations

- **Horizontal**: Multiple Express instances + load balancer
- **Database**: Read replicas, sharding by studio_id
- **Cache**: Redis cluster
- **Files**: S3 with CloudFront CDN
- **Queue**: Bull/Redis for background jobs
