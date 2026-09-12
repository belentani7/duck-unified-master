# Multi-stage build for optimal size

FROM node:20-alpine as dependencies
WORKDIR /app
COPY package.json ./
RUN npm install -g pnpm@10 && pnpm install --frozen-lockfile

FROM node:20-alpine as builder
WORKDIR /app
COPY package.json ./
RUN npm install -g pnpm@10 && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine as runtime
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm@10

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY package.json ./

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "dist/index.js"]
