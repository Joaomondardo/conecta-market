#!/bin/bash
set -e

echo "⏳ Aguardando PostgreSQL ficar pronto..."
until pg_isready -h postgres -U conecta -d conecta; do
  echo "  PostgreSQL ainda não está pronto, aguardando..."
  sleep 2
done

echo "✅ PostgreSQL está pronto!"

echo "⚙️  Gerando Prisma Client..."
cd /app/apps/api
pnpm exec prisma generate

echo "🔄 Rodando migrations do Prisma..."
cd /app/apps/api
pnpm exec prisma migrate deploy

echo "✅ Migrations concluídas!"

echo "🌱 Rodando seed..."
pnpm exec prisma db seed || echo "⚠️  Seed já foi executado ou não existe"

echo "🚀 Iniciando NestJS em modo desenvolvimento..."
cd /app/apps/api
pnpm run dev
