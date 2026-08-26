# Security Guide

## Authentication

### JWT Tokens
```typescript
// Token structure
{
  sub: "user_id",
  email: "user@example.com",
  role: "admin|user|creator",
  iat: 1234567890,
  exp: 1234571490
}
```

### Login Flow
1. User submits email + password
2. Server verifies against bcrypt hash
3. JWT token generated
4. Token sent to client (httpOnly cookie)
5. Client includes in Authorization header

### Token Refresh
```bash
POST /api/auth/refresh
Header: Cookie: session=<session_id>
→ Returns new JWT + session
```

---

## Password Security

- **Hashing**: bcrypt with salt rounds 10
- **Minimum**: 8 characters
- **Validation**: Zod schema enforces
- **Reset**: Email verification link (24h expiry)

```typescript
const schema = z.object({
  password: z.string()
    .min(8)
    .regex(/[A-Z]/, 'Precisa maiúscula')
    .regex(/[0-9]/, 'Precisa número')
})
```

---

## API Security

### CORS
```typescript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))
```

### Rate Limiting
- 100 req/min per IP
- 1000 req/min per user
- Burst limit: 50 concurrent

### Input Validation
```typescript
// All inputs validated with Zod
router.createOrder(
  z.object({
    productId: z.string().uuid(),
    quantity: z.number().min(1).max(100),
  })
)
```

### CSRF Protection
```typescript
// CSRF token in session
app.use(csrf())
```

---

## Database Security

### SQL Injection Prevention
```typescript
// ✅ Safe (Drizzle ORM)
db.select().from(users).where(eq(users.email, email))

// ❌ Never do this
db.query(`SELECT * FROM users WHERE email = '${email}'`)
```

### Data Access Control
```typescript
// Only own data
const orders = db.select()
  .from(orders)
  .where(and(
    eq(orders.userId, userId),
    eq(orders.studio_id, studioId)
  ))
```

---

## File Upload Security

### S3 Configuration
```typescript
// Signed URLs with 15min expiry
const url = await s3.getSignedUrl({
  bucket: 'duck-studio-assets',
  key: `${userId}/file.mp3`,
  expires: 900, // 15 minutes
})
```

### File Validation
- Max size: 5GB
- Allowed types: audio/*, video/*, image/*
- Scan with antivirus (optional)

---

## Secrets Management

### .env Variables
```bash
# ✅ Never commit
JWT_SECRET=your_secret_key
DATABASE_PASSWORD=secure_password

# ✅ Use AWS Secrets Manager in production
aws secretsmanager get-secret-value \
  --secret-id duck-studio/prod
```

### Environment Separation
```
.env.local      → Development secrets
.env.production → Production secrets
```

---

## Headers & Compliance

### Security Headers
```typescript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000')
  next()
})
```

### GDPR Compliance
- User data export endpoint
- Right to be forgotten (delete)
- Privacy policy required
- Cookie consent banner

---

## Audit Logging

```typescript
// Log all sensitive actions
logger.info('USER_LOGIN', {
  userId: user.id,
  ip: req.ip,
  timestamp: new Date(),
})

logger.warn('FAILED_LOGIN_ATTEMPT', {
  email: req.body.email,
  attempts: count,
})

logger.info('DATA_EXPORT', {
  userId,
  dataSize: bytes,
})
```

---

## Error Handling

### Don't Leak Information
```typescript
// ❌ Bad: Reveals too much
throw new Error('User with email user@example.com not found')

// ✅ Good: Generic
throw new Error('Invalid credentials')
```

### Production Logging
```typescript
// Development: Full stack trace
// Production: ID + message only
logger.error(error.message, { errorId: generateId() })
```

---

## Dependency Security

```bash
# Check for vulnerabilities
pnpm audit

# Update safely
pnpm update --latest

# Lock critical versions
pnpm add -E bcrypt mysql2
```

---

## Deployment Checklist

- [ ] Environment variables set securely
- [ ] SSL/TLS certificate installed
- [ ] Firewall rules configured
- [ ] Database backups enabled
- [ ] Monitoring alerts configured
- [ ] Security headers enabled
- [ ] HTTPS forced
- [ ] Session timeout set (30min)
- [ ] Audit logging enabled
- [ ] Rate limiting active

---

## Incident Response

1. **Detection**: Sentry alerts + monitoring
2. **Assessment**: Severity level (P1-P4)
3. **Response**: Immediate mitigation
4. **Communication**: Notify affected users
5. **Root Cause**: Post-mortem analysis
6. **Prevention**: Code/process improvements

---

## Further Reading

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
