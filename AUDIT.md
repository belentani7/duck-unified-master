# Informe de Auditoría: duck-unified-master

Fecha: 2026-08-27
Stack detectado: TypeScript/React 19, Vite 7, tRPC 11, Express 4, Drizzle ORM (MySQL 8), pnpm workspaces, Docker, GitHub Actions
Commits analizados: 1 (30eaa69 — "feat: DUCK Unified Master - consolidação completa 9 repos")
Veredicto: **con problemas** (raíz del repo no compilable; consolidación incompleta)

---

## Lo mejor del repo (mínimo 3)

1. **Amplitud y ambición del ecosistema**: el snapshot integra 6 módulos con código real (beatlab, crm, lab, omega, zion-premium, apps) más el proyecto plataforma completo contenido en `extracted/duck-studio-duck-control/...`; el backend de `server/_core/` (routers tRPC con zod en todas las entradas, procedimientos admin protegidos, auditoría de automatismos, RGPD/LGPD aplicada a leads) es código serio y bien estructurado: validación de entrada en cada mutation/query, separación `db.ts`/`routers.ts`/`schema.ts`, y manejo de errores consistente.
2. **Buenas prácticas de secretos**: no se encontró ningún secreto real (API keys, AWS keys, claves privadas) en el código versionado. Todas las configuraciones sensibles se leen de `process.env` (`server/_core/db.ts:35`, `routers.ts`, `modules/*/_core/env.ts`) y `.env.example` contiene únicamente placeholders.
3. **Documentación abundante y conciencia de seguridad**: existe licencia MIT, `CONTRIBUTING.md`, `docs/SECURITY.md`, `docs/API.md`, `docs/DEPLOY.md`, Dockerfile multi-stage, docker-compose con healthchecks, `.github/workflows/` CI+deploy, y el acceso propietario está protegido con procedimiento admin (`server/_core/routers.ts:43`). Las fechas/dominios del informe de consolidación son explícitos y trazables.

---

## Hallazgos CRÍTICOS

**C1 — La raíz del repo no compila (build roto, fase de triage)).**
La consolidación dejó la estructura raíz incompleta: la entrada de la SPA y del servidor referencian archivos que no existen en el árbol de la raíz (todos existen, sí, en el repo original completo bajo `extracted/duck-studio-duck-control/duck-control/duck-studio-platform/`).

- `index.html:18` → `<script type="module" src="/src/main.tsx">` — no existe `src/main.tsx` (`src/` solo contiene `components/App.tsx`).
- `src/components/App.tsx:1-23` → importa `@/components/ui/sonner`, `@/components/ui/tooltip`, `./components/ErrorBoundary`, `./contexts/ThemeContext`, `./pages/Home` y 15+ rutas de páginas (`./pages/*`) que no existen en `src/`.
- `server/_core/index.ts:6-10` → importa `./oauth`, `./storageProxy`, `./context`, `./vite` — ninguno existe en `server/_core/` (solo 8 archivos). La línea 8 importa `../routers` (`server/routers.ts`) que no existe (existe `server/_core/routers.ts`).
- `server/_core/db.ts:27` → importa `"../drizzle/schema"` (falta `server/drizzle/`); `db.ts:28` importa `"./_core/env"` (falta).
- `server/_core/routers.ts:1-6` → importa `@shared/const` (no hay alias ni carpeta `shared/` en la raíz) y `./_core/cookies`, `./_core/systemRouter`, `./_core/trpc` (faltan).

Consecuencia: `pnpm check` (tsc), `pnpm build` (vite + esbuild) y `pnpm dev` fallan al arrancar. Los fixes mínimos son inviables por ser cientos de archivos faltantes; se documenta sin tocar la lógica de negocio.

**C2 — `pnpm install` falla por `patchedDependencies` sin archivo de patch.**
`package.json:137` declara `patchedDependencies: { "wouter@3.7.1": "patches/wouter@3.7.1.patch" }` pero el directorio `patches/` no existe en el repo. `pnpm install` (y `pnpm install --frozen-lockfile` del CI/Docker) falla al no encontrar el parche.

**C3 — `pnpm-lock.yaml` está excluido por `.gitignore` pero es requerido en CI/Docker.**
`.gitignore:3` ignora `pnpm-lock.yaml`, mientras `Dockerfile:6,11,23`, `.github/workflows/ci.yml:42` y `scripts/build.sh:11` ejecutan `pnpm install --frozen-lockfile` (que exige lockfile). En tanto el lockfile no esté commiteado, CI y Docker no pueden instalar de forma reproducible.

**C4 — `Dockerfile` referencia `public/` y un health endpoint inexistentes.**
`Dockerfile:22` hace `COPY --from=builder /app/public ./public` pero no existe carpeta `public/` en la raíz → el build de Docker falla. El `HEALTHCHECK` del `Dockerfile:26-27` y del `docker-compose.yml:66` apuntan a `/api/health`, ruta que no se registra en `server/_core/index.ts` (solo `/api/trpc`, storage proxy y OAuth).

**C5 — La documentación de consolidación describe una estructura que no existe.**
`CONSOLIDATION_REPORT.md` (y `README.md`) afirman 9 repos integrados con `modules/commerce`, `modules/analytics`, `modules/portal`, `monorepo/packages/*`, `shared/`, `integrations/`, `tools/`, `k8s/`. En el árbol real hay 6 módulos (`modules/apps|crm|beatlab|lab|omega|zion-premium`), solo `modules/apps` y `modules/crm` tienen `package.json`, y las carpetas `monorepo/`, `shared/`, `integrations/`, `tools/`, `k8s/` no existen. El estado real no es "PRODUCTION READY".

---

## Hallazgos ALTOS

- CI **garantizadamente rojo**: por C1/C2/C3 el pipeline `test-and-build` no puede pasar; además el paso `Lint` de `.github/workflows/ci.yml:48` usa `pnpm format --check`, que expande a `prettier --write . --check`, combinación de flags inválida en Prettier 3 (no se puede usar `--write` con `--check`). Fix preparado pero no pusheado por falta de scope `workflow` (detalle en "Añadido por el auditor").
- **Dos definiciones de esquema de base de datos divergentes**: `db/init.sql` define `users` con `id VARCHAR(36)/password_hash/role` mientras `server/_core/schema.ts` (Drizzle) define usuarios por `openId` y tablas distintas (leads, automationControls, etc.). Aplicar ambos sobre la misma DB producirá conflictos. El `db/migrations/*.sql` no coincide necesariamente con `db/init.sql`.

---

## Hallazgos MEDIOS

- **Artefactos binarios pesados en el historial**: `Início-Duck(8_26_20264:59:35AM).html` (~5 MB), `Instagram(8_26_20264:59:12AM).html` (~7 MB), `duck-studio-client-materials.zip` (~5 MB), `duck-studio-duck-control.zip` (~5 MB), `main.pdf` (~5 MB), `sheet-01.jpg`, `robots.txt` de nivel raíz. Inflan el repo y no aportan al código. No se eliminan (regla del propietario); se recomienda moverlos a assets externos/Releases.
- **`pasted_content*.txt` en la raíz**: contenido de prompts de auditoría (no código) mezclado con la raíz del proyecto.
- **docker-compose con credenciales de desarrollo hardcodeadas**: `docker-compose.yml:9-12` (`rootpass123`/`duckpass123`) y `:52` `JWT_SECRET: your_very_secret_jwt_key_min_32_chars_long`. Son valores locales de dev, no un secreto real, pero si el compose llegara a producción serían críticos.
- **Healthcheck de compose usa `curl`** en imagen `node:20-alpine`, que no incluye curl → el healthcheck del contenedor `app` fallará aunque la app esté sana.
- **`index.html:19-22`**: placeholders `%VITE_ANALYTICS_ENDPOINT%`/`%VITE_ANALYTICS_WEBSITE_ID%` sin definir en `vite.config.ts` (analytics externo no configurado).
- **Módulos sin `package.json`**: `modules/beatlab|lab|omega|zion-premium` no son instalables ni ejecutables individualmente vía pnpm (solo `apps` y `crm` tienen manifiesto).
- **README desalineado con la realidad**: describe estructura (`src/pages`, `src/hooks`, `src/components/ui`, `server/routes`, `server/middleware`, `db/schemas`) que la raíz no contiene.

---

## Posibles secretos — revisar manualmente

Siguiendo la regla de oro, se registran como *posibles* (presuntamente falsos positivos) los matches del patrón AWS/Google detectados en los HTML guardados del navegador `Início-Duck(...).html` (líneas ~30 de contenido embebido) e `Instagram(...).html` (líneas ~19/21/31): cadenas `akia...`/`aiza...` en code minificado. Las claves AWS reales inician con `AKIA`+16 caracteres mayúsculos exactos; los matches hallados tienen longitud mayor y mayúsculas/minúsculas mezcladas, lo que apunta a identificadores minificados, no credenciales. **Recomendación: reescanear/rotar cualquier credencial de AWS/Google antes de compartir el repo externamente.** No hay claves válidas de OpenAI/OpenRouter/NVIDIA/xAI/Groq/GitHub PAT/GitLab ni claves privadas en el árbol versionado.

---

## Añadido por el auditor

Rama `agent/auditoria-2026-08-27` (máx. 4 commits, atómicos):

1. **`fix: use valid prettier check flag in build script`**
   - `scripts/build.sh:19` — `pnpm format --check` → `pnpm exec prettier --check .` (evita `prettier --write . --check`, combinación inválida en Prettier 3).
2. **`docs: add audit report`** — este `AUDIT.md` (y copia en `C:\audit-github\informes\duck-unified-master.md`).

**Cambio preparado pero NO pusheado (pendiente de aplicación manual):** `.github/workflows/ci.yml:48` — mismo fix (`pnpm format --check` → `pnpm exec prettier --check .`). El push fue rechazado por GitHub porque el token OAuth del clon no tiene el scope `workflow` para actualizar archivos en `.github/workflows/`. Por regla de la auditoría (no modificar workflows salvo crítico) y por estar bloqueado el push, se dejó el workflow intacto en el repo y se documenta el diff exacto para que el propietario lo aplique (línea 48 del paso `Lint`).

No se hizo ningún otro cambio de código. No se eliminaron archivos.

---

## Próximos pasos recomendados

1. **Reconciliar la raíz con el proyecto completo** contenido en `extracted/duck-studio-duck-control/duck-control/duck-studio-platform/` (que sí contiene `client/src/main.tsx`, `server/_core/{env,oauth,context,storageProxy,vite}.ts`, `server/drizzle/schema.ts`, `shared/const.ts`). Opciones: (a) promover ese proyecto como raíz y dejar `modules/` como apps separadas, o (b) completar la fusión copiando los archivos faltantes en la raíz.
2. **Restaurar la reproducibilidad**: generar y commitear `pnpm-lock.yaml`; quitar `pnpm-lock.yaml` de `.gitignore`; crear el parche `patches/wouter@3.7.1.patch` real o eliminar la entrada `patchedDependencies`.
3. **Definir `/api/health`** en `server/_core/index.ts` o alinear la ruta del healthcheck de Docker/compose.
4. **Unificar el esquema de DB**: decidir entre `db/init.sql` y el esquema Drizzle (`server/_core/schema.ts` + `db/migrations`), idealmente eliminando duplicación.
5. **Mover artefactos binarios** (zips, pdf, html de 5-7 MB, jpg) fuera del repo de código (Releases/DRM/asset storage).
6. **Crear `package.json` real** para los módulos que carecen de él (o documentarlos como estáticos).

---

## No tocado (pero anotado)

- `src/*`, `server/*`, `modules/*`: lógica de negocio intacta (sin cambios de código por C1 — inviable un fix mínimo seguro).
- `.github/workflows/deploy.yml`: proceso de deploy válido; sin cambios (regla: no tocar workflows salvo crítico; solo se corrigió el flag inválido del paso Lint de `ci.yml`).
- `Dockerfile`, `docker-compose.yml`, `package.json`, `.gitignore`, `.env.example`: intactos; defectos señalados arriba.
- No se eliminó ningún archivo ni se reescribió historial. Solo se pusheó la rama `agent/auditoria-2026-08-27`; sin push directo a `main`.