# Base image
FROM node:20-alpine AS base
RUN npm install -g pnpm

# Builder stage
FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# Production stage for API
FROM base AS api
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/package.json ./package.json
EXPOSE 3001
CMD ["pnpm", "--filter", "@conecta/api", "start"]

# Production stage for Web
FROM base AS web
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web ./apps/web
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["pnpm", "--filter", "@conecta/web", "start"]
