# 🗺️ Documentação de Arquitetura: Conecta Market

Este documento descreve a estrutura física do monorepo, as tecnologias empregadas, as configurações sistêmicas e os padrões de segurança/arquitetura adotados no projeto.

## 1. Árvore de Diretórios (Monorepo Workspace)

Abaixo está a representação estrutural da raiz e dos dois aplicativos principais (`apps/api` e `apps/web`), abstraindo pastas geradas automaticamente (`node_modules`, `.next`, `dist`).

```text
conecta-market/
├── apps/
│   ├── api/                           # Backend (NestJS)
│   │   ├── prisma/
│   │   │   ├── migrations/            # Histórico de schema
│   │   │   ├── schema.prisma          # Modelagem de dados do banco
│   │   │   └── seed.ts                # Script idempotente de população inicial
│   │   ├── src/
│   │   │   ├── common/                # Validadores, Filtros, Guards (ex: env.validation.ts)
│   │   │   ├── modules/               # Domínios da aplicação (Auth, Analytics, Entrepreneurs, etc)
│   │   │   ├── prisma/                # Client instanciado do Prisma
│   │   │   ├── app.module.ts          # Módulo principal
│   │   │   └── main.ts                # Entrypoint (Porta 3001)
│   │   ├── .env                       # Variáveis rigorosamente tipadas
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── web/                           # Frontend (Next.js)
│       ├── src/
│       │   ├── app/                   # App Router
│       │   │   ├── (auth)/login/      # Interface de acesso e ofuscação
│       │   │   ├── catalogo/          # Vitrine de produtos/serviços
│       │   │   ├── painel/            # Dashboards B2B/Lojista
│       │   │   ├── layout.tsx         # Configuração raiz (Fontes, Providers)
│       │   │   ├── page.tsx           # Landing Page Institucional
│       │   │   └── globals.css        # Variáveis e Tailwind configs
│       │   ├── components/
│       │   │   ├── layout/            # Estruturas fixas (Header, Footer)
│       │   │   ├── marketplace/       # Cartões e lógicas de mercado
│       │   │   ├── providers.tsx      # Injeção de Contexto (QueryClient) com "use client"
│       │   │   └── ui/                # Base UI Components (shadcn/base-ui)
│       │   ├── services/              # Requisições API (ex: products.service)
│       │   └── store/                 # Gerenciamento de Estado Global (ex: useAuthStore.ts)
│       ├── next.config.js
│       ├── package.json
│       └── tailwind.config.js
│
├── packages/
│   └── shared-types/                  # Tipagens globais compartilhadas (API <-> Web)
│
├── docker-compose.yml                 # Orquestração do DB (PostgreSQL, Redis, Mongo)
├── package.json                       # Scripts globais
├── pnpm-workspace.yaml                # Definição do workspace
└── turbo.json                         # Configuração de cache e orquestração do pipeline
```

## 2. Tecnologias e Ecossistema

O projeto utiliza um paradigma modular de alta escalabilidade voltado ao padrão **Full-Stack Typescript**.

### Orquestração e Gerenciamento
*   **Gerenciador de Pacotes:** `pnpm` (modo workspaces com hoisting restrito).
*   **Build System:** `Turbo` (Turborepo para cache de compilação descentralizada e execução paralela veloz).

### Backend (`@conecta/api`)
*   **Framework:** NestJS (Node.js).
*   **Banco de Dados & ORM:** PostgreSQL conteinerizado via Docker, gerenciado estritamente via Prisma ORM.
*   **Validação:** `class-validator` e `class-transformer` em DTOs e variáveis de ambiente.
*   **Autenticação:** JWT com roteamento validado via Role-Based Access Control (RBAC).

### Frontend (`@conecta/web`)
*   **Framework:** Next.js (App Router, focado em Server vs Client Components).
*   **Estilização & UI:** Tailwind CSS integrado com radix-ui/base-ui e Shadcn para componentes desacomplados.
*   **Estado & Data Fetching:** Zustand para persistência local (Tokens/Sessão) e TanStack React Query para cache e chamadas em rede.

---

## 3. Marcos de Segurança e Arquitetura

O código implementa diversos mecanismos focados em estabilidade a nível de produção ("Production-Grade"):

1.  **Segurança Anti-Inspeção no DOM (F12):**
    O Input de senhas (`Login`) utiliza ofuscação nativa via motor CSS (`WebkitTextSecurity`), operando sob `type="text"`. Isso bloqueia edições maliciosas no DOM e possui ouvintes defensivos (`onBlur`, `visibilitychange`) para manter os dados mascarados passivamente.

2.  **Validação Estrita de Ambiente (Fail-Fast):**
    O NestJS rejeita iniciar se variáveis como `JWT_SECRET` não cumprirem requisitos rígidos (ex: mín. de 32 caracteres), utilizando regras declarativas do `class-validator` para o `.env`.

3.  **Seed Idempotente e "Social Proof" Agregado:**
    O script `seed.ts` é seguro para repetição (apaga/recria a base de forma controlada). Ele calcula ativamente estatísticas de reviews (médias aritméticas) e as acopla diretamente às tabelas `Store`, replicando a regra exata de negócio da aplicação.

4.  **Sanitização de Fronteiras de Componentes:**
    Isolamento profundo de instâncias do lado do servidor versus lado do cliente, protegendo Providers globais e limpando metapropriedades de subcomponentes (`asChild` redundantes do Shadcn).

---

## 4. Mapeamento de Portas

Os serviços da aplicação são mapeados nas seguintes portas locais e de contêineres:

| Serviço / Container         | Porta  | Rede              | Observação |
|-----------------------------|--------|-------------------|------------|
| **Frontend (Next.js)**      | `3000` | `localhost`       | SPA renderizada (SSR/CSR) |
| **Backend API (NestJS)**    | `3001` | `localhost`       | Ponto de acesso à lógica central |
| **PostgreSQL (Database)**   | `5432` | `docker-network`  | Banco relacional (`conecta_market`) |
| **MongoDB (Logs/Eventos)**  | `27017`| `docker-network`  | Banco NoSQL opcional para auditoria |
| **Redis (Cache/Jobs)**      | `6379` | `docker-network`  | Filas ou controle de limitação (Rate Limiting) |
| **PgAdmin (Painel DB)**     | `5050` | `localhost`       | Interface web de adm. para o Postgres |

---

## 5. Lógica das Transações Atômicas de Cashback

A plataforma adota o sistema de cashback (carteira digital) embutido no motor do Prisma Client via chamadas de `$transaction` visando 100% de consistência:

- **Escopo Atômico (ACID):** Toda vez que uma compra é confirmada (`Order`), a dedução e a criação de histórico de pontuação (`Transaction` + update na `Wallet`) correm rigorosamente juntas.
- **Rollback Transacional:** Em caso de falha sistêmica ou violação de restrição em qualquer sub-etapa (ex: usuário não possui saldo ou o banco de dados perde conexão temporária), toda a alteração é instantaneamente desfeita, preservando a integridade financeira e impedindo saldos corrompidos.
- **Integração no Onboarding:** Ao aprovar um novo Empreendedor no funil de aprovação (`EntrepreneursService`), a API forja simultaneamente o `User`, a `Store` (Loja) atrelada, e a `Wallet` base, garantindo segurança na integridade referencial num único lote assíncrono.
