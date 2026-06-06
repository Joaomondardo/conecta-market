# 🛒 Conecta Market

> Marketplace híbrido B2B+B2C para pequenos negócios locais — Projeto PINTER 2026 | UNESC

## ✅ Pré-requisitos

| Ferramenta | Versão | Download |
|---|---|---|
| Node.js | 18+ | https://nodejs.org |
| pnpm | 8+ | `npm install -g pnpm` |
| Docker Desktop | qualquer | https://docker.com/products/docker-desktop |
| Git | qualquer | https://git-scm.com |

## 🚀 Primeira vez na máquina

```bash
git clone https://github.com/Joaomondardo/conecta-market.git
cd conecta-market
pnpm install
cp apps/api/.env.example apps/api/.env
```

Edite `apps/api/.env` e configure:
Depois:

```bash
docker-compose -f docker-compose.dev.yml up -d
# Aguarde 30s e verifique: docker ps
pnpm --filter @conecta/api exec prisma migrate dev
pnpm --filter @conecta/api exec prisma db seed
pnpm dev
```

## 🔄 Já instalado — rodar novamente

```bash
cd "C:\Users\joaov\Documents\Projeto Interdiciplinar\conecta-market-master"
docker-compose -f docker-compose.dev.yml up -d
pnpm dev
```

## 🌐 URLs

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:3001 |
| Swagger | http://localhost:3001/api/docs |

## 🔑 Credenciais de teste (senha: senha123)

| Perfil | Email |
|---|---|
| Admin | admin@conecta.com |
| Lojista | horta@conecta.com |
| Artesão | artes@conecta.com |
| Cliente 1 | cliente1@conecta.com |
| Cliente 2 | cliente2@conecta.com |

## 🛑 Parar o projeto

```bash
Ctrl+C
docker-compose -f docker-compose.dev.yml down
```

## 🔧 Problemas comuns

```bash
# Porta 3001 em uso
netstat -ano | findstr :3001
taskkill /PID <numero> /F

# Reset completo
docker-compose -f docker-compose.dev.yml down -v
pnpm install
docker-compose -f docker-compose.dev.yml up -d
pnpm --filter @conecta/api exec prisma migrate dev
pnpm --filter @conecta/api exec prisma db seed
pnpm dev
```

## 👥 Equipe

4ª Fase Ciência da Computação — UNESC | Parceria: ABADEUS — ONG Criciúma/SC
Apresentação: 04/07/2026 — PINTER 2026

