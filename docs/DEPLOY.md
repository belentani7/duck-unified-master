# Deployment Guide

## Pre-deployment Checklist

- [ ] Todos tests passando: `pnpm test`
- [ ] Type check OK: `pnpm check`
- [ ] Lint passing: `pnpm format --check`
- [ ] Environment vars configurados
- [ ] Database migrations testadas
- [ ] Build successful: `pnpm build`

---

## Docker Deployment

### Build Image
```bash
docker build -t duck-studio:latest .
```

### Run Container
```bash
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL=mysql://... \
  -e JWT_SECRET=... \
  duck-studio:latest
```

### Docker Compose
```bash
docker-compose up -d
docker-compose logs -f
```

---

## Kubernetes

### Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: duck-studio
spec:
  replicas: 3
  selector:
    matchLabels:
      app: duck-studio
  template:
    metadata:
      labels:
        app: duck-studio
    spec:
      containers:
      - name: duck-studio
        image: duck-studio:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: duck-studio-secrets
              key: database-url
```

### Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: duck-studio
spec:
  selector:
    app: duck-studio
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

---

## GitHub Actions (Auto-Deploy)

Trigger: Push para `main` branch

Pipeline:
1. Install deps
2. Run tests
3. Build Docker image
4. Push registry
5. Deploy via SSH

Secrets necessários:
- `REGISTRY_USER`
- `REGISTRY_TOKEN`
- `REGISTRY`
- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_KEY`

---

## Health Checks

```bash
# API health
curl http://localhost:3000/api/health

# DB connection
curl http://localhost:3000/api/db-health

# Full diagnostics
curl http://localhost:3000/api/diagnostics
```

---

## Monitoring

### Sentry Setup
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Logs
```bash
# View logs
docker-compose logs -f app

# Structured logging
LOG_FORMAT=json pnpm start
```

---

## Rollback

```bash
# Docker
docker-compose up -d --build=false

# Kubernetes
kubectl rollout undo deployment/duck-studio

# Manual
git checkout previous-version
pnpm build && NODE_ENV=production pnpm start
```

---

## Database Backup

```bash
# Backup
mysqldump -u user -p duck_studio > backup.sql

# Restore
mysql -u user -p duck_studio < backup.sql

# S3 backup (automated)
aws s3 cp backup.sql s3://backups/
```
