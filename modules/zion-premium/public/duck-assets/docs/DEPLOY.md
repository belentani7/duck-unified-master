# Deploy — DUCK PROD

## Opções de Deploy

### 1. Vercel (Recomendado)

```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel

# Deploy produção
vercel --prod
```

**Configurações:**
- Build Command: `node scripts/build.js`
- Output Directory: `dist`
- Node.js Version: 20

### 2. Netlify

```bash
# Instalar CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**netlify.toml:**
```toml
[build]
  command = "node scripts/build.js"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 3. GitHub Pages

```bash
# Push para branch gh-pages
git push origin main:gh-pages
```

**Configurações:**
- Source: Branch `gh-pages`
- Folder: `/ (root)`

### 4. Cloudflare Pages

1. Conectar repositório GitHub
2. Build Command: `node scripts/build.js`
3. Output Directory: `dist`

## DNS

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

## SSL

Todas as plataformas acima fornecem SSL gratuito automaticamente.

## Headers de Segurança

```apache
# .htaccess (Apache)
<IfModule mod_headers.c>
  Header set X-Frame-Options "DENY"
  Header set X-Content-Type-Options "nosniff"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com unpkg.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data:; connect-src 'self'"
</IfModule>
```
