# Conecta Market

> Marketplace híbrido B2B+B2C para inclusão digital — PINTER 2026 · UNESC / ABADEUS

[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)

## Sobre o Projeto

Plataforma digital desenvolvida em parceria com a **ABADEUS — Centro de Inovação Social** de Criciúma/SC, conectando os ~400 empreendedores locais dos bairros Cristo Redentor e Ana Maria com a comunidade regional.

Projeto Interdisciplinar — 4ª Fase · Ciência da Computação · UNESC · 2026/01

**Disciplinas:** Gerenciamento de Dados 2 · Desenvolvimento de Aplicações 2

**Professores:** Allan Farias Fávaro · André Faria Ruaro

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router), Tailwind CSS, Shadcn UI |
| Backend | NestJS 10, JWT, OAuth Google, SSE |
| ORM | Prisma + PostgreSQL |
| Cache/Filas | Redis |
| Logs/Eventos | MongoDB |
| Monorepo | Turborepo + pnpm workspaces |
| Tipagem | TypeScript estrito (0 erros) |

## Funcionalidades

- ✅ Autenticação JWT com refresh token e Google OAuth
- ✅ RBAC — Admin, Lojista, Empreendedor, Cliente
- ✅ Catálogo de produtos e serviços com filtros
- ✅ Pedidos com fluxo completo de compra
- ✅ Pagamentos e estorno
- ✅ Campanhas promocionais e cupons
- ✅ Carteira digital e cashback (transações ACID)
- ✅ Notificações em tempo real (SSE + RxJS)
- ✅ Avaliações de produtos e lojas
- ✅ Dashboard analytics para admin e lojista
- ✅ Onboarding simplificado de empreendedores
- ✅ 57 endpoints documentados no Swagger (OAS 3.0)

## Como Rodar

### Pré-requisitos
- Node.js 18+
- pnpm 8+
- Docker e Docker Compose

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/SEU_USUARIO/conecta-market.git
cd conecta-market

# Instalar dependências
pnpm install

# Subir infraestrutura (PostgreSQL, MongoDB, Redis)
docker-compose up -d

# Configurar variáveis de ambiente
cp apps/api/.env.example apps/api/.env
# Edite apps/api/.env com suas credenciais

# Executar migrations e seed
pnpm --filter @conecta/api exec prisma migrate dev
pnpm --filter @conecta/api exec prisma db seed

# Rodar em desenvolvimento
pnpm dev
```

### URLs locais
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Swagger: http://localhost:3001/api/docs
- PgAdmin: http://localhost:5050

## Estrutura do Projeto
