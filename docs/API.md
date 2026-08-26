# API Documentation

## tRPC Endpoints

### Studio Router
```typescript
studio.list() -> Studio[]
studio.get(id: string) -> Studio
studio.create(data) -> Studio
studio.update(id, data) -> Studio
studio.delete(id) -> void
```

### Commerce Router
```typescript
products.list() -> Product[]
products.purchase(productId) -> Order
orders.list() -> Order[]
orders.get(id) -> Order
```

### CRM Router
```typescript
contacts.list() -> Contact[]
contacts.search(query) -> Contact[]
contacts.create(data) -> Contact
contacts.update(id, data) -> Contact
```

### Analytics Router
```typescript
analytics.dashboard() -> DashboardData
analytics.revenue(period) -> RevenueReport
analytics.users(period) -> UserReport
```

---

## REST Endpoints (Fallback)

### Health
```
GET /api/health -> { status: 'ok' }
```

### Files (S3)
```
POST /api/upload -> { url: string }
GET /api/files/:id
DELETE /api/files/:id
```

### Auth
```
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
POST /api/auth/refresh
```

---

## Error Handling

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token expired",
    "statusCode": 401
  }
}
```

---

## Rate Limiting

- 100 req/min por IP
- 1000 req/min por usuário autenticado
- Fallback: 429 Too Many Requests

---

## Authentication

```bash
# Header
Authorization: Bearer <jwt_token>

# Cookie (opcional)
session=<session_id>
```

JWT payload:
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "admin|user",
  "iat": 1234567890,
  "exp": 1234571490
}
```
