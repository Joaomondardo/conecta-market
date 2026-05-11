# Conecta Market

O **Conecta Market** é uma plataforma de marketplace híbrido (B2B + B2C) moderna e acessível, focada em inclusão social e digital. Conecta fornecedores, atacadistas, pequenos produtores rurais e clientes finais em um único ecossistema, proporcionando uma experiência otimizada para pessoas de todos os níveis de letramento digital.

## 🚀 Tecnologias Utilizadas

Este projeto adota uma arquitetura em **Monorepo** gerenciada com o `Turborepo` e `pnpm workspaces`.

### Frontend
- **React 18** com **Next.js 14** (App Router)
- **TypeScript** em modo estrito
- **TailwindCSS** e componentes do **shadcn/ui**
- **Zustand** para o estado global
- Ícones **Lucide React**

### Backend
- **Node.js** com **NestJS**
- **Prisma ORM** (PostgreSQL) para o banco relacional
- Mongoose para os bancos não-relacionais (Logs, Analytics)
- JWT e Passport.js
- Swagger (OpenAPI) para documentação das APIs

---

## 📂 Estrutura do Monorepo

```
conecta-market/
├── apps/
│   ├── api/            # Backend NestJS
│   └── web/            # Frontend Next.js 14
├── packages/
│   ├── shared-types/   # Interfaces, Enums e Tipagens partilhadas
│   ├── ui-kit/         # (Opcional) Tokens de design compartilhados
│   └── utils/          # (Opcional) Funções utilitárias partilhadas
├── docs/               # Documentação técnica (ER Diagram, Relatório)
└── docker-compose.yml  # Configuração para subida de banco local
```

---

## 🛠 Como Executar o Projeto

### Pré-requisitos
- Node.js 24+ e npm
- pnpm instalado globalmente (`npm i -g pnpm`)
- Docker Desktop (ou equivalente) para rodar o PostgreSQL e MongoDB localmente

### 1. Clonar e Instalar Dependências
```bash
git clone <url-do-repositorio>
cd conecta-market
pnpm install
```

### 2. Configurar o Ambiente Local (.env)
Copie o `.env.example` na raiz para `.env` e ajuste se necessário. O sistema já está configurado para os padrões do `docker-compose.yml`.
```bash
cp .env.example .env
```

### 3. Subir os Bancos de Dados
```bash
docker-compose up -d
```
> Isso iniciará os serviços de PostgreSQL e MongoDB.

### 4. Preparar o Banco de Dados (Prisma)
Navegue para a API e rode as migrations:
```bash
cd apps/api
pnpm prisma migrate dev
pnpm run seed # Opcional: Popular banco com dados iniciais
```

### 5. Iniciar a Aplicação (Modo de Desenvolvimento)
Volte para a raiz e execute o Turborepo:
```bash
cd ../..
pnpm dev
```
- **Frontend (Web)**: Disponível em http://localhost:3000
- **Backend (API)**: Disponível em http://localhost:3001
- **Swagger Docs**: Disponível em http://localhost:3001/api/docs

---

## 🧑‍🎓 Autores e Contexto
Este repositório é parte de um **Projeto Interdisciplinar**.
Documentações específicas do escopo acadêmico, como **Relatório Técnico** e **Diagramas ER**, estão contidas no diretório `/docs`.
