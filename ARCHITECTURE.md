# Documentação Técnica — Conecta Market
**Versão:** 1.0 | **Data:** Junho 2026 | **Gerado por:** Análise estática completa do código-fonte

---

## Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Arquitetura Completa](#2-arquitetura-completa)
3. [Stack Tecnológica](#3-stack-tecnológica)
4. [Estrutura de Pastas](#4-estrutura-de-pastas)
5. [Banco de Dados](#5-banco-de-dados)
6. [API — Endpoints Completos](#6-api--endpoints-completos)
7. [Autenticação e Autorização](#7-autenticação-e-autorização)
8. [Módulos do Backend](#8-módulos-do-backend)
9. [Frontend — Rotas e Páginas](#9-frontend--rotas-e-páginas)
10. [Componentes UI](#10-componentes-ui)
11. [Gerenciamento de Estado (Zustand)](#11-gerenciamento-de-estado-zustand)
12. [Funcionalidades Detalhadas](#12-funcionalidades-detalhadas)
13. [Infraestrutura e DevOps](#13-infraestrutura-e-devops)
14. [Segurança](#14-segurança)
15. [Padrões de Código](#15-padrões-de-código)
16. [Glossário](#16-glossário)

---

## 1. Visão Geral do Projeto

### O que é o Conecta Market?

O **Conecta Market** é um marketplace híbrido **B2B + B2C** com foco em **inclusão digital** de pequenos empreendedores. A plataforma permite que produtores locais, artesãos, prestadores de serviço e pequenos comerciantes vendam seus produtos e serviços diretamente para consumidores finais (B2C) ou para outras empresas (B2B), em um ambiente unificado, seguro e intuitivo.

### Problema que resolve

Pequenos empreendedores e produtores locais (muitas vezes com baixo letramento digital) não têm acesso facilitado a plataformas de venda online. O Conecta Market resolve isso oferecendo:

- Interface simplificada, pensada para quem não tem experiência com e-commerce
- Onboarding rápido para empreendedores (apenas nome, e-mail e WhatsApp)
- Suporte a produtos físicos **e** serviços na mesma plataforma
- Preços diferenciados para varejo e atacado (B2C e B2B)
- Sistema de cashback para fidelizar clientes

### Público-alvo

| Perfil | Descrição |
|---|---|
| **Empreendedor** | Pequeno produtor ou prestador de serviço, com onboarding simplificado |
| **Lojista (LOJISTA)** | Comerciante com loja registrada, gerencia catálogo completo |
| **Fornecedor (FORNECEDOR)** | Atacadista que fornece produtos para outras empresas |
| **Cliente (CLIENTE)** | Consumidor final que compra no marketplace |
| **Admin** | Gestor da plataforma, aprova lojas e modera conteúdo |

### Principais objetivos e funcionalidades

- **Catálogo unificado** de produtos físicos e serviços
- **Duplo preço**: varejo e atacado no mesmo produto
- **Wallet com cashback**: recompensa por compras concluídas
- **Notificações em tempo real** via SSE (Server-Sent Events)
- **Sistema de campanhas**: cupons, cashback, flash sale, brinde
- **Reviews moderados**: avaliações de produtos e lojas com aprovação
- **Analytics por perfil**: painel do vendedor e painel do admin
- **Autenticação completa**: e-mail/senha e Google OAuth 2.0

---

## 2. Arquitetura Completa

### Diagrama Textual da Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Navegador)                           │
│                    Next.js 14 — App Router                          │
│              http://localhost:3000  (porta padrão)                   │
└───────────────────────────┬─────────────────────────────────────────┘
                            │  HTTP REST + SSE
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NestJS API Backend                              │
│              http://localhost:3001/api  (porta padrão)               │
│                                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────────┐ │
│  │AuthModule│  │Products  │  │Orders    │  │Notifications (SSE)  │ │
│  │          │  │Module    │  │Module    │  │RxJS Subject-based   │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐│
│  │Campaigns │  │Reviews   │  │Wallet    │  │Analytics Module      ││
│  │Module    │  │Module    │  │Module    │  │                      ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────────┘│
│                                                                     │
│       ┌───────────────────────────────────────────────────┐        │
│       │              PrismaService (ORM)                   │        │
│       └──────────────────────┬────────────────────────────┘        │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
  ┌──────────────┐   ┌──────────────────┐  ┌──────────────┐
  │  PostgreSQL  │   │    MongoDB       │  │   Redis      │
  │  (principal) │   │  (logs - futuro) │  │  (cache/     │
  │  porta 5432  │   │  porta 27017     │  │   sessões -  │
  │              │   │                  │  │   futuro)    │
  └──────────────┘   └──────────────────┘  └──────────────┘
```

> [!NOTE]
> MongoDB e Redis estão definidos no `docker-compose.yml` e como dependências no `package.json` (`mongoose`, `ioredis`), mas ainda não estão integrados ao código NestJS. São débitos técnicos planejados para fases futuras.

### Padrões Arquiteturais

| Padrão | Onde é usado | Descrição |
|---|---|---|
| **Modular** (NestJS) | Backend inteiro | Cada domínio é um módulo isolado com controller, service e DTOs próprios |
| **Repository Pattern** via Prisma | Todos os serviços | O `PrismaService` atua como camada de acesso a dados, encapsulado nos `Service` de cada módulo |
| **Guard / Decorator Pattern** | Autenticação e RBAC | `JwtAuthGuard`, `RolesGuard` e decoradores customizados `@Public`, `@Roles`, `@GetCurrentUser` |
| **Event-Driven** | Notificações e cashback | `EventEmitter2` dispara eventos (`order.confirmed`, `review.approved`) que são escutados por outros módulos via `@OnEvent` |
| **SSE (Server-Sent Events)** | Notificações em tempo real | RxJS `Subject` + `Observable` filtrado por `userId` |
| **Database Transaction** | Pedidos, reviews, wallet | `prisma.$transaction(...)` garante atomicidade em operações compostas |
| **App Router (Next.js 14)** | Frontend | Roteamento por sistema de arquivos, Server Components e Client Components misturados |
| **Zustand** | Estado global frontend | Gerenciamento leve e reativo de estado com middleware `persist` para localStorage |

### Fluxo de uma Requisição — Exemplo: Criar Pedido

```
1. Cliente (browser) → POST /api/orders
   com body: { storeId, addressId, items: [...], couponCode }
   e header: Authorization: Bearer <accessToken>

2. JwtAuthGuard.canActivate()
   → Extrai token do header Authorization
   → JwtStrategy.validate() → consulta PrismaService.user.findUnique()
   → Injeta { id, name, email, role } em request.user

3. OrdersController.create()
   → GetCurrentUser('id') extrai userId de request.user
   → Chama OrdersService.create(userId, dto)

4. OrdersService.create()
   → Busca cada produto no Prisma
   → Verifica estoque (BadRequestException se insuficiente)
   → prisma.$transaction():
       a) Cria Order com items
       b) Decrementa stock de cada produto

5. Retorna Order criada com 201 Created

6. Posteriormente, PATCH /api/orders/:id/status com status=CONFIRMED
   → OrdersService.updateStatus() → EventEmitter2.emit('order.confirmed', {...})

7. NotificationsService.handleOrderConfirmed() (@OnEvent)
   → prisma.notification.create()
   → notificationSubject.next(notification)

8. Frontend (SSE) → EventSource captura evento
   → useNotificationsStore atualiza estado
   → Header exibe badge com número de notificações
```

---

## 3. Stack Tecnológica

### Backend (`apps/api`)

| Tecnologia | Versão | Uso no Projeto | Onde aparece |
|---|---|---|---|
| **Node.js** | 20.x | Runtime JavaScript | Toda a API |
| **NestJS** | ^10.0.0 | Framework principal do backend — módulos, controllers, guards, pipes | `apps/api/src/**` |
| **TypeScript** | ^5.4.0 | Tipagem estática | Todos os arquivos `.ts` |
| **Prisma ORM** | ^5.22.0 | Mapeamento objeto-relacional para PostgreSQL | `apps/api/prisma/`, todos os `*.service.ts` |
| **PostgreSQL** | 16-alpine (Docker) | Banco de dados principal | `prisma/schema.prisma` |
| **@nestjs/jwt** | ^10.2.0 | Geração e validação de tokens JWT | `auth.service.ts`, `jwt.strategy.ts` |
| **@nestjs/passport** | ^10.0.3 | Middleware de autenticação via Strategies | `jwt.strategy.ts`, `google.strategy.ts` |
| **passport-jwt** | ^4.0.1 | Estratégia JWT para Passport | `jwt.strategy.ts`, `jwt-refresh.strategy.ts` |
| **passport-google-oauth20** | ^2.0.0 | Estratégia Google OAuth 2.0 | `google.strategy.ts` |
| **bcrypt** | ^6.0.0 | Hash de senhas e refresh tokens | `auth.service.ts` |
| **@nestjs/throttler** | ^5.2.0 | Rate limiting (limita requisições por IP) | `app.module.ts` |
| **helmet** | ^7.2.0 | Headers de segurança HTTP | `main.ts` |
| **@nestjs/swagger** | ^7.4.2 | Documentação OpenAPI automática | `main.ts`, decoradores nos controllers |
| **@nestjs/event-emitter** | ^3.1.0 | Sistema de eventos interno (pub/sub) | `orders.service.ts`, `notifications.service.ts`, `reviews.service.ts` |
| **rxjs** | ^7.8.1 | Streams reativos para SSE | `notifications.service.ts`, `notifications.controller.ts` |
| **class-validator** | ^0.14.4 | Validação de DTOs (decoradores como `@IsEmail`, `@MinLength`) | Todos os arquivos `*.dto.ts` |
| **class-transformer** | ^0.5.1 | Transformação de objetos plain → instâncias de classe | `ValidationPipe` em `main.ts`, `env.validation.ts` |
| **@nestjs/config** | ^3.3.0 | Gerenciamento de variáveis de ambiente | `app.module.ts`, todos os serviços que usam `ConfigService` |
| **ioredis** | ^5.3.2 | Cliente Redis (dependência presente, não integrado ao código ainda) | `package.json` |
| **mongoose** | ^8.3.0 | ODM MongoDB (dependência presente, não integrado ao código ainda) | `package.json` |
| **nodemailer** | ^6.9.13 | Envio de e-mails (presente, não integrado — TODO no código) | `package.json`, comentário em `auth.service.ts` |
| **multer** | ^1.4.5-lts.1 | Upload de arquivos (dependência presente) | `package.json` |
| **sharp** | ^0.33.3 | Processamento de imagens (dependência presente) | `package.json` |

### Frontend (`apps/web`)

| Tecnologia | Versão | Uso no Projeto | Onde aparece |
|---|---|---|---|
| **Next.js** | 14.x | Framework React com App Router, SSR e SSG | `apps/web/src/app/**` |
| **React** | 18.x | Biblioteca de UI | Todos os componentes `.tsx` |
| **TypeScript** | ^5.x | Tipagem estática | Todos os arquivos `.ts/.tsx` |
| **Tailwind CSS** | 3.x | Framework CSS utility-first | Todos os componentes (classes Tailwind) |
| **Zustand** | ^4.x | Gerenciamento de estado global leve e reativo | `apps/web/src/store/**` |
| **Radix UI** (via shadcn/ui) | — | Componentes acessíveis sem estilo próprio (base dos componentes UI) | `apps/web/src/components/ui/**` |
| **lucide-react** | — | Ícones SVG | Header, componentes de card, páginas |
| **Inter** (Google Fonts) | — | Fonte principal do corpo de texto | `layout.tsx` |
| **Sora** (Google Fonts) | — | Fonte de headings e títulos | `layout.tsx`, headings nas páginas |
| **sonner** | — | Notificações toast (pop-ups de feedback) | `layout.tsx`, `providers.tsx` |
| **EventSource API** (nativa) | — | Conexão SSE com o backend para notificações em tempo real | `useNotifications.ts` |

### Monorepo / Tooling

| Tecnologia | Versão | Uso no Projeto |
|---|---|---|
| **Turborepo** | — | Orquestrador de build do monorepo, cache inteligente de tarefas |
| **pnpm** | 9.x | Gerenciador de pacotes com workspaces |
| **ESLint** | — | Linting de código TypeScript/React |
| **Prettier** | — | Formatação de código |
| **Jest** | ^29.7.0 | Testes unitários (backend) |
| **Vitest** | — | Testes unitários (frontend) |
| **Docker** / **Docker Compose** | — | Containerização de PostgreSQL, MongoDB, Redis, API e Web |

---

## 4. Estrutura de Pastas

```
conecta-market-main/
├── .github/
│   └── workflows/
│       └── ci.yml               # Pipeline CI/CD com GitHub Actions
├── apps/
│   ├── api/                     # Backend NestJS
│   │   ├── prisma/              # Schema, migrations e seed
│   │   ├── src/
│   │   │   ├── common/          # Utilitários transversais (guards, decorators, etc.)
│   │   │   ├── modules/         # Módulos de domínio (auth, products, orders...)
│   │   │   ├── prisma/          # PrismaModule e PrismaService
│   │   │   ├── app.module.ts    # Módulo raiz do NestJS
│   │   │   └── main.ts          # Entry point da API
│   │   ├── .env                 # Variáveis de ambiente (não versionado)
│   │   └── docker-entrypoint.sh # Script de inicialização do container
│   └── web/                     # Frontend Next.js
│       └── src/
│           ├── app/             # Rotas (App Router do Next.js)
│           ├── components/      # Componentes React reutilizáveis
│           ├── services/        # Funções de chamada à API REST
│           ├── store/           # Stores Zustand
│           └── lib/             # Utilitários genéricos
├── packages/
│   └── shared-types/            # Tipos TypeScript compartilhados entre api e web
│       └── src/
│           └── index.ts         # Todas as interfaces e enums exportados
├── .env.example                 # Modelo de variáveis de ambiente
├── docker-compose.yml           # Orquestração de containers (produção)
├── docker-compose.dev.yml       # Orquestração de containers (desenvolvimento)
├── turbo.json                   # Configuração do Turborepo
├── pnpm-workspace.yaml          # Configuração dos workspaces pnpm
└── package.json                 # Scripts e dependências raiz
```

### `/apps/api/src/modules/` — Cada módulo individualmente

| Módulo | Pasta | Responsabilidade |
|---|---|---|
| `auth` | `modules/auth/` | Login, registro, refresh token, OAuth Google, recuperação de senha |
| `users` | `modules/users/` | CRUD de usuários, perfil, gestão de status (Admin) |
| `stores` | `modules/stores/` | Criação e gestão de lojas, aprovação pelo admin |
| `products` | `modules/products/` | Catálogo, busca, filtros, CRUD de produtos e serviços |
| `categories` | `modules/categories/` | Hierarquia de categorias (pai/filho), CRUD pelo admin |
| `orders` | `modules/orders/` | Criação de pedidos, atualização de status, cancelamento, cashback automático |
| `payments` | `modules/payments/` | Criação e consulta de pagamentos, estorno |
| `campaigns` | `modules/campaigns/` | Criação de campanhas, validação de cupons, campanhas públicas ativas |
| `reviews` | `modules/reviews/` | Criação, listagem, aprovação e rejeição de avaliações |
| `notifications` | `modules/notifications/` | SSE, criação programática, listagem, marcar como lida |
| `analytics` | `modules/analytics/` | Dashboard do admin, dashboard do vendedor, resumo geral |
| `favorites` | `modules/favorites/` | Adicionar, listar, remover produtos favoritos |
| `wallet` | `modules/wallet/` | Saldo da carteira, histórico de transações, resgate de cashback |
| `entrepreneurs` | `modules/entrepreneurs/` | Onboarding simplificado para empreendedores |

> [!NOTE]
> **Falta um 15º módulo** declarado no `AppModule`. A contagem real de módulos de negócio é 14. O `PrismaModule` é o 15º se contado junto.

### `/apps/api/src/common/` — Cada subpasta

| Pasta | Arquivo(s) | O que faz |
|---|---|---|
| `config/` | `env.validation.ts` | Valida variáveis de ambiente na inicialização usando `class-validator`. Garante que `DATABASE_URL`, `JWT_SECRET` (≥32 chars) e `JWT_REFRESH_SECRET` (≥32 chars) estejam presentes. |
| `constants/` | `app.constants.ts` | Constantes globais da aplicação (ex: paginação padrão: `DEFAULT_PAGE=1`, `DEFAULT_PAGE_SIZE=20`) |
| `decorators/` | `get-current-user.decorator.ts` | Extrai `request.user` ou uma propriedade específica dele (ex: `@GetCurrentUser('id')`) |
| `decorators/` | `public.decorator.ts` | Marca uma rota como pública com `@SetMetadata(IS_PUBLIC_KEY, true)`, bypassando o `JwtAuthGuard` |
| `decorators/` | `roles.decorator.ts` | Define roles necessárias com `@SetMetadata(ROLES_KEY, roles)`, lido pelo `RolesGuard` |
| `filters/` | `http-exception.filter.ts` | Captura **todas** as exceções não tratadas, loga erros 500+ e retorna JSON padronizado com `statusCode`, `timestamp`, `path`, `method` e `message` |
| `guards/` | `jwt-auth.guard.ts` | Estende `AuthGuard('jwt')`. Verifica se a rota é `@Public()` antes de exigir o token JWT |
| `guards/` | `jwt-refresh.guard.ts` | Usa `AuthGuard('jwt-refresh')` para validar o refresh token em `/auth/refresh` |
| `guards/` | `google-auth.guard.ts` | Usa `AuthGuard('google')` para iniciar e receber o callback do Google OAuth 2.0 |
| `guards/` | `roles.guard.ts` | Lê os roles definidos pelo `@Roles()` decorator e compara com `request.user.role`. Lança `ForbiddenException` se insuficiente |
| `interfaces/` | `active-user.interface.ts` | Interface `ActiveUser` com `id`, `email`, `role` e opcionalmente `storeId` — representa o usuário autenticado em `request.user` |

### `/apps/api/prisma/`

| Arquivo/Pasta | O que é | Por que existe |
|---|---|---|
| `schema.prisma` | Definição completa do banco de dados | Fonte única de verdade para todos os modelos, enums e relacionamentos do PostgreSQL |
| `seed.ts` | Script de população inicial do banco | Cria dados de demonstração (admin, 3 clientes, 2 lojistas com lojas, produtos, avaliações) para facilitar apresentações e testes |
| `migrations/` | Histórico de migrações SQL | Controle de versão do esquema do banco. Há 1 migration: `20260512230636_phase_2_cashback` que adicionou `Wallet` e `Transaction` |
| `migrations/migration_lock.toml` | Trava de versão do provider | Garante que o provider `postgresql` não seja trocado acidentalmente |

### `/apps/web/src/app/` — Cada rota

| Rota | Pasta | Descrição |
|---|---|---|
| `/` | `page.tsx` | Página inicial (Home): hero, produtos em destaque, seção de features, CTA |
| `/login` | `login/` | Formulário de login e-mail/senha |
| `/cadastro` | `cadastro/` | Formulário de registro de novos usuários |
| `/catalogo` | `catalogo/` | Listagem de produtos com filtros |
| `/produto/[id]` | `produto/` | Página de detalhe de produto/serviço |
| `/lojas` | `lojas/` | Listagem de lojas ativas |
| `/loja/[slug]` | `loja/` | Página de detalhe de uma loja |
| `/carrinho` | `carrinho/` | Carrinho de compras |
| `/checkout` | `checkout/` | Formulário de finalização de pedido |
| `/pedidos` | `pedidos/` | Histórico de pedidos do usuário |
| `/conta` | `conta/` | Perfil e configurações da conta |
| `/painel` | `painel/` | Painel do vendedor (dashboard, vendas, produtos, campanhas) |
| `/admin` | `admin/` | Painel administrativo |
| `/onboarding` | `onboarding/` | Fluxo de cadastro rápido para empreendedores |
| `/vender` | `vender/` | Landing page explicando como vender na plataforma |
| `/como-comprar` | `como-comprar/` | Página informativa sobre como comprar |
| `/como-vender` | `como-vender/` | Página informativa sobre como vender |
| `/sobre` | `sobre/` | Página Sobre Nós |
| `/capacitacao` | `capacitacao/` | Recursos de capacitação para empreendedores |
| `/central-ajuda` | `central-ajuda/` | Central de ajuda e FAQ |
| `/frete-entrega` | `frete-entrega/` | Informações sobre frete e entrega |
| `/metodos-pagamento` | `metodos-pagamento/` | Informações sobre métodos de pagamento |
| `/planos-taxas` | `planos-taxas/` | Planos e taxas da plataforma |
| `/politica-privacidade` | `politica-privacidade/` | Política de privacidade |
| `/termos-uso` | `termos-uso/` | Termos de uso |
| `/trocas-devolucoes` | `trocas-devolucoes/` | Política de trocas e devoluções |
| `/vendas-atacado` | `vendas-atacado/` | Informações sobre compras B2B / atacado |
| `/recuperar-senha` | `recuperar-senha/` | Formulário de recuperação de senha |

### `/apps/web/src/components/`

| Pasta | Componentes | Descrição |
|---|---|---|
| `layout/` | `header.tsx`, `footer.tsx` | Componentes de layout global presentes em todas as páginas |
| `marketplace/` | `marketplace-card.tsx` | Card de produto/serviço para listagem no catálogo |
| `ui/` | 19 componentes | Componentes de design system baseados em shadcn/ui (Radix UI) |
| `providers.tsx` | — | Wrapper de providers React necessários para Zustand e outros contextos |

### `/apps/web/src/services/`

| Arquivo | O que faz | Dependências |
|---|---|---|
| `api/products.service.ts` | Busca produtos da API REST (`GET /api/products`, `GET /api/products/:id`) | `NEXT_PUBLIC_API_URL` |
| `api/entrepreneurs.service.ts` | Cadastro de empreendedores via onboarding (`POST /api/entrepreneurs/onboarding`) | `NEXT_PUBLIC_API_URL` |
| `orders.service.ts` | Gerencia pedidos do usuário autenticado | `useAuthStore` (token) |

### `/packages/shared-types/src/index.ts`

Arquivo único com todos os tipos TypeScript compartilhados entre frontend e backend:

| Categoria | Conteúdo |
|---|---|
| **Enums** | `UserRole`, `UserStatus`, `StoreStatus`, `ProductStatus`, `OrderStatus`, `PaymentStatus`, `PaymentMethod`, `CampaignType`, `CashbackStatus`, `NotificationType`, `FavoriteType`, `ReviewTargetType` |
| **Interfaces de entidade** | `User`, `UserProfile`, `Address`, `Store`, `Product`, `Category`, `Order`, `OrderItem`, `Payment`, `Campaign`, `Coupon`, `Transaction`, `Review`, `Notification`, `Favorite`, `Wallet` |
| **Interfaces de analytics** | `AnalyticsOverview`, `SalesData` |
| **Interfaces de API** | `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiError` |
| **Interfaces de auth** | `AuthTokens`, `LoginDto`, `RegisterDto` |
| **Interfaces de wallet** | `TransactionRecord`, `WalletSummary` |

> [!WARNING]
> Existe uma **divergência** entre os enums do `shared-types` e os enums do `schema.prisma`. Por exemplo, `shared-types` usa `SUPPLIER` e `RETAILER`, enquanto o schema Prisma usa `FORNECEDOR` e `LOJISTA`. Isso pode causar erros de tipagem se o frontend consumir dados do backend sem mapeamento.

---

## 5. Banco de Dados

### Diagrama ER Textual

```
users ──────────────────────────────────────────────────────────────────────────┐
  │ 1:1 (ownerId)       │ 1:N (customerId)    │ 1:N (userId)   │ 1:1 (userId)   │
  ▼                     ▼                    ▼                ▼                │
stores              orders              notifications       wallets             │
  │ 1:N               │ 1:N              │ 1:N (sender)     │ 1:N               │
  ▼                   ▼                 ▼                  ▼                  │
products          order_items       messages           transactions            │
  │ 1:N               │ N:1 (productId)                                       │
  ▼                   ▼                                                        │
reviews          products                                                      │
  │ 1:N                                                                        │
  ▼                                                                            │
favorites                                                                      │
                                                                               │
categories ──── products (1:N, categoryId)                                    │
                                                                               │
campaigns ──────────────────────────────────────────────────────────────────   │
  │ 1:1              │ 1:N                                                     │
  ▼                  ▼                                                         │
coupons        campaign_items ──── products (N:1, productId)                  │
                                                                               │
addresses ──── orders (1:N, addressId)                                        │
addresses ──── users (N:1, userId)                                            │
                                                                               │
orders ──── payments (1:1, orderId)                                           │
orders ──── messages (1:N, orderId)                                           │
orders ──── transactions (1:N, orderId)                                       │
```

### Modelos do Prisma — Detalhamento Completo

#### `User` (tabela: `users`)

**Propósito:** Armazena todos os usuários da plataforma (admin, lojistas, clientes, empreendedores, fornecedores).

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `String (CUID)` | Identificador único gerado automaticamente |
| `name` | `String` | Nome completo do usuário |
| `email` | `String @unique` | E-mail (único, usado como login) |
| `password` | `String?` | Hash bcrypt da senha. Nulo em logins OAuth |
| `phone` | `String?` | Telefone/WhatsApp |
| `cpf` | `String? @unique` | CPF (único, opcional) |
| `cnpj` | `String? @unique` | CNPJ (único, opcional) |
| `avatar` | `String?` | URL da foto de perfil |
| `role` | `UserRole` | Papel do usuário: `ADMIN`, `LOJISTA`, `FORNECEDOR`, `EMPREENDEDOR`, `CLIENTE` |
| `status` | `UserStatus` | `ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION` |
| `emailVerified` | `Boolean` | Se o e-mail foi verificado |
| `emailVerifiedAt` | `DateTime?` | Quando o e-mail foi verificado |
| `twoFactorEnabled` | `Boolean` | Flag para 2FA (não implementado no código atual) |
| `twoFactorSecret` | `String?` | Segredo TOTP para 2FA (não implementado) |
| `googleId` | `String? @unique` | ID Google para OAuth |
| `refreshToken` | `String?` | Hash bcrypt do refresh token atual |
| `resetPasswordToken` | `String?` | Token temporário para reset de senha |
| `resetPasswordExpires` | `DateTime?` | Expiração do token de reset (1 hora) |
| `lastLoginAt` | `DateTime?` | Último login |
| `createdAt` | `DateTime` | Data de criação |
| `updatedAt` | `DateTime` | Data da última atualização |
| `deletedAt` | `DateTime?` | Soft delete (campo disponível, mas não usado no código atual) |

**Índices:** `@@index([email])`
**Relacionamentos:** `addresses[]`, `store?`, `orders[]`, `reviews[]`, `notifications[]`, `favorites[]`, `sentMessages[]`, `receivedMessages[]`, `wallet?`

#### `Address` (tabela: `addresses`)

**Propósito:** Endereços de entrega dos usuários.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `String` | PK |
| `userId` | `String` | FK para `users.id` (cascade delete) |
| `label` | `String` | Rótulo do endereço (padrão: "Principal") |
| `street` | `String` | Logradouro |
| `number` | `String` | Número |
| `complement` | `String?` | Complemento |
| `neighborhood` | `String` | Bairro |
| `city` | `String` | Cidade |
| `state` | `String` | Estado (sigla) |
| `zipCode` | `String` | CEP |
| `country` | `String` | País (padrão: "BR") |
| `isDefault` | `Boolean` | Se é o endereço padrão |

#### `Store` (tabela: `stores`)

**Propósito:** Lojas dos vendedores/fornecedores. Cada usuário pode ter no máximo 1 loja (`@unique ownerId`).

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `String` | PK |
| `ownerId` | `String @unique` | FK para `users.id` — relação 1:1 |
| `name` | `String` | Nome da loja |
| `slug` | `String @unique` | Identificador URL-friendly (ex: `horta-organica`) |
| `description` | `String?` | Descrição |
| `logo` | `String?` | URL do logo |
| `banner` | `String?` | URL do banner |
| `type` | `StoreType` | `B2B`, `B2C` ou `HYBRID` |
| `status` | `StoreStatus` | `PENDING`, `ACTIVE`, `SUSPENDED`, `REJECTED` |
| `cnpj` | `String? @unique` | CNPJ da loja |
| `rating` | `Float` | Média das avaliações (atualizada automaticamente) |
| `totalSales` | `Int` | Total de vendas (não implementada atualização automática) |
| `totalReviews` | `Int` | Total de avaliações aprovadas |
| `approvedAt` | `DateTime?` | Quando foi aprovada pelo admin |
| `approvedById` | `String?` | ID do admin que aprovou |

**Relacionamentos:** `owner` (User), `products[]`, `orders[]`, `reviews[]`, `campaigns[]`

#### `Category` (tabela: `categories`)

**Propósito:** Organização hierárquica de produtos. Suporta categorias pai/filho (auto-referência).

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `String` | PK |
| `name` | `String` | Nome da categoria |
| `slug` | `String @unique` | Slug URL |
| `description` | `String?` | Descrição |
| `image` | `String?` | Imagem da categoria |
| `icon` | `String?` | Ícone (nome do ícone ou URL) |
| `parentId` | `String?` | FK para outra `Category` (hierarquia) |
| `isActive` | `Boolean` | Se está ativa |
| `sortOrder` | `Int` | Ordem de exibição |

**Relacionamentos:** `parent?` (Category), `children[]` (Category), `products[]`

#### `Product` (tabela: `products`)

**Propósito:** Catálogo unificado de produtos físicos e serviços.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `String` | PK |
| `storeId` | `String` | FK para `stores.id` |
| `categoryId` | `String?` | FK para `categories.id` (nullable, SetNull on delete) |
| `name` | `String` | Nome do produto/serviço |
| `slug` | `String @unique` | Slug URL |
| `description` | `String?` | Descrição longa |
| `shortDescription` | `String?` | Descrição curta |
| `sku` | `String? @unique` | Código SKU interno |
| `barcode` | `String?` | Código de barras |
| `price` | `Decimal(10,2)` | Preço de varejo (B2C) |
| `priceB2B` | `Decimal(10,2)?` | Preço de atacado (B2B). Nulo = não vende no atacado |
| `compareAtPrice` | `Decimal(10,2)?` | Preço "de" para exibir desconto |
| `costPrice` | `Decimal(10,2)?` | Preço de custo (interno) |
| `stock` | `Int` | Quantidade em estoque (decrementado atomicamente ao criar pedido) |
| `minOrderQty` | `Int` | Quantidade mínima por pedido (padrão: 1) |
| `maxOrderQty` | `Int?` | Quantidade máxima por pedido |
| `weight` | `Float?` | Peso em gramas |
| `width/height/depth` | `Float?` | Dimensões para cálculo de frete |
| `images` | `String[]` | Array de URLs de imagens |
| `tags` | `String[]` | Tags de busca |
| `attributes` | `Json?` | Atributos variáveis (cor, tamanho, etc.) |
| `type` | `ProductType` | `PRODUCT` (físico) ou `SERVICE` (serviço) |
| `status` | `ProductStatus` | `DRAFT`, `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK` |
| `isFeatured` | `Boolean` | Se aparece na seção de destaques |
| `rating` | `Float` | Média das avaliações |
| `totalReviews` | `Int` | Total de avaliações aprovadas |
| `totalSales` | `Int` | Total de vendas |

**Índices:** `@@index([slug])`, `@@index([storeId, categoryId, status])`

#### `Order` (tabela: `orders`)

**Propósito:** Pedidos realizados pelos clientes.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `String` | PK |
| `orderNumber` | `String @unique` | Número do pedido (CUID, exibido ao cliente) |
| `customerId` | `String` | FK para `users.id` |
| `storeId` | `String` | FK para `stores.id` |
| `addressId` | `String?` | FK para `addresses.id` |
| `status` | `OrderStatus` | `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED` |
| `subtotal` | `Decimal(10,2)` | Soma dos itens |
| `discount` | `Decimal(10,2)` | Desconto aplicado (cupom, etc.) |
| `shipping` | `Decimal(10,2)` | Valor do frete |
| `tax` | `Decimal(10,2)` | Impostos |
| `total` | `Decimal(10,2)` | `subtotal - discount + shipping + tax` |
| `couponCode` | `String?` | Código de cupom utilizado |
| `notes` | `String?` | Observações do cliente |
| `trackingCode` | `String?` | Código de rastreio |
| `cancelReason` | `String?` | Motivo do cancelamento |

**Relacionamentos:** `customer` (User), `store` (Store), `address?` (Address), `items[]` (OrderItem), `payment?` (Payment), `messages[]` (Message), `transactions[]` (Transaction)

#### `OrderItem` (tabela: `order_items`)

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `String` | PK |
| `orderId` | `String` | FK para `orders.id` (cascade delete) |
| `productId` | `String` | FK para `products.id` |
| `name` | `String` | Nome snapshot (preserva o nome no momento da compra) |
| `sku` | `String?` | SKU snapshot |
| `image` | `String?` | Imagem snapshot |
| `price` | `Decimal(10,2)` | Preço unitário no momento da compra |
| `quantity` | `Int` | Quantidade |
| `total` | `Decimal(10,2)` | `price * quantity` |
| `isB2B` | `Boolean` | Se foi comprado no preço de atacado |

#### `Payment` (tabela: `payments`)

| Campo | Tipo | Descrição |
|---|---|---|
| `orderId` | `String @unique` | FK para `orders.id` (relação 1:1) |
| `method` | `PaymentMethod` | `CREDIT_CARD`, `DEBIT_CARD`, `PIX`, `BOLETO`, `BANK_TRANSFER` |
| `status` | `PaymentStatus` | `PENDING`, `PROCESSING`, `APPROVED`, `REJECTED`, `REFUNDED`, `CANCELLED` |
| `amount` | `Decimal(10,2)` | Valor pago |
| `installments` | `Int` | Número de parcelas (padrão: 1) |
| `gatewayId` | `String?` | ID retornado pelo gateway de pagamento |
| `gatewayResponse` | `Json?` | Resposta completa do gateway |
| `pixCode` | `String?` | QR Code Pix |
| `boletoUrl` | `String?` | URL do boleto |
| `paidAt` | `DateTime?` | Quando foi pago |

#### `Campaign` (tabela: `campaigns`)

| Campo | Tipo | Descrição |
|---|---|---|
| `type` | `CampaignType` | `CASHBACK`, `GIFT`, `COUPON`, `FLASH_SALE`, `DISCOUNT`, `FREE_SHIPPING` |
| `status` | `CampaignStatus` | `DRAFT`, `ACTIVE`, `PAUSED`, `FINISHED` |
| `discountType` | `String` | `PERCENTAGE` ou `FIXED` |
| `discountValue` | `Decimal(10,2)` | Valor do desconto |
| `minOrderValue` | `Decimal(10,2)?` | Valor mínimo do pedido para aplicar |
| `maxDiscount` | `Decimal(10,2)?` | Teto do desconto (para percentuais) |
| `usageLimit` | `Int?` | Limite de usos. Nulo = ilimitado |
| `usageCount` | `Int` | Usos realizados |
| `startsAt/endsAt` | `DateTime` | Período de vigência (campos principais) |

> [!NOTE]
> Existem campos duplicados: `startDate/endDate` (nullable) além de `startsAt/endsAt` (not-null). Isso é um débito técnico — os campos `startDate/endDate` não são utilizados pelo código atual.

#### `Wallet` (tabela: `wallets`)

| Campo | Tipo | Descrição |
|---|---|---|
| `userId` | `String @unique` | FK para `users.id` (1:1 com User) |
| `balance` | `Decimal(10,2)` | Saldo atual em reais |

**Relacionamentos:** `user` (User), `transactions[]` (Transaction)

#### `Transaction` (tabela: `transactions`)

| Campo | Tipo | Descrição |
|---|---|---|
| `walletId` | `String` | FK para `wallets.id` (cascade delete) |
| `orderId` | `String?` | FK para `orders.id` (nullable, SetNull) |
| `amount` | `Decimal(10,2)` | Valor da transação |
| `type` | `TransactionType` | `CREDIT` (cashback ganho) ou `DEBIT` (cashback resgatado) |
| `description` | `String?` | Descrição legível (ex: "Cashback do pedido #ABC") |

#### `Review` (tabela: `reviews`)

| Campo | Tipo | Descrição |
|---|---|---|
| `userId` | `String` | Autor da avaliação |
| `productId` | `String?` | Produto avaliado (nulo se avaliação de loja) |
| `storeId` | `String?` | Loja avaliada (nulo se avaliação de produto) |
| `rating` | `Int` | Nota de 1 a 5 |
| `title` | `String?` | Título da avaliação |
| `comment` | `String?` | Texto da avaliação |
| `images` | `String[]` | Fotos da avaliação |
| `status` | `ReviewStatus` | `PENDING`, `APPROVED`, `REJECTED` |
| `isVerified` | `Boolean` | Se é uma compra verificada |

> [!NOTE]
> No `reviews.service.ts`, avaliações são criadas com `status: 'APPROVED'` diretamente, sem passar por `PENDING`. O fluxo de moderação (`approve`/`reject`) existe, mas o `create` já aprova automaticamente.

### Estratégia de Migrations

Há **1 migration** documentada: `20260512230636_phase_2_cashback`. Ela introduziu os modelos `Wallet` e `Transaction` (sistema de cashback). O controle de versão usa `migration_lock.toml` que trava o provider em `postgresql`.

**Comandos de migrations:**
```bash
# Desenvolvimento (cria nova migration)
pnpm db:migrate:dev

# Produção/CI (aplica migrations existentes)
pnpm db:migrate

# Reseta o banco (apenas dev)
pnpm db:reset
```

### O que o Seed cria

O `seed.ts` executa em sequência:

1. **Limpeza completa** do banco (`prisma.cleanDatabase()`)
2. **1 Admin** — `admin@conecta.com` / `senha123`
3. **3 Clientes** com wallets já abastecidas: R$15,50 / R$50,00 / R$0,00
4. **2 Lojistas** com lojas criadas e aprovadas:
   - `horta@conecta.com` → Loja "Horta Orgânica Comunitária" (B2C)
   - `artes@conecta.com` → Loja "Artesanatos da Vila" (HYBRID)
5. **2 Categorias** base: Alimentação e Serviços
6. **6 Produtos/Serviços** nas lojas (alface, consultoria, mel, oficina de costura, massoterapia, barbearia)
7. **4 Avaliações** aprovadas com recálculo automático do `rating` das lojas

---

## 6. API — Endpoints Completos

**URL base:** `http://localhost:3001/api`
**Documentação Swagger:** `http://localhost:3001/api/docs`

### Auth (`/api/auth`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/api/auth/register` | Público | Registra novo usuário. Cria wallet automaticamente. Retorna `{ user, accessToken, refreshToken }` |
| `POST` | `/api/auth/login` | Público | Login com e-mail e senha. Retorna `{ user, accessToken, refreshToken }`. Atualiza `lastLoginAt`. |
| `POST` | `/api/auth/logout` | JWT | Invalida o refresh token do usuário no banco |
| `POST` | `/api/auth/refresh` | JWT Refresh | Valida o refresh token (hash bcrypt), gera novo par de tokens |
| `GET` | `/api/auth/me` | JWT | Retorna os dados do usuário autenticado a partir do token |
| `POST` | `/api/auth/forgot-password` | Público | Gera token de reset (válido 1h). **TODO: envio de e-mail não implementado** |
| `POST` | `/api/auth/reset-password` | Público | Valida token e atualiza senha com novo hash bcrypt |
| `GET` | `/api/auth/google` | Público | Redireciona para o fluxo de autenticação Google OAuth |
| `GET` | `/api/auth/google/callback` | Google | Callback do Google. Cria ou vincula usuário existente. Retorna tokens. |

**Body de `register`:**
```json
{ "name": "string", "email": "string", "password": "string (min 8)", "phone": "string?", "role": "CLIENTE|LOJISTA|..." }
```

**Body de `login`:**
```json
{ "email": "string", "password": "string" }
```

**Body de `reset-password`:**
```json
{ "token": "string", "password": "string" }
```

### Users (`/api/users`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET` | `/api/users` | JWT + `ADMIN` | Lista todos os usuários com paginação (`page`, `limit`) |
| `GET` | `/api/users/me` | JWT | Perfil do usuário autenticado (dados completos do banco) |
| `GET` | `/api/users/:id` | JWT + `ADMIN` | Busca usuário por ID |
| `PATCH` | `/api/users/me` | JWT | Atualiza o próprio perfil |
| `PATCH` | `/api/users/:id` | JWT + `ADMIN` | Atualiza qualquer usuário |
| `PATCH` | `/api/users/:id/status` | JWT + `ADMIN` | Altera status do usuário (`ACTIVE`, `SUSPENDED`, etc.) |
| `DELETE` | `/api/users/:id` | JWT + `ADMIN` | Desativa usuário (soft delete via `status=INACTIVE`) |

### Stores (`/api/stores`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET` | `/api/stores` | Público | Lista lojas `ACTIVE` com paginação e busca por nome |
| `GET` | `/api/stores/:slug` | Público | Busca loja por slug. Retorna loja + 12 produtos ativos + 10 reviews aprovadas |
| `POST` | `/api/stores` | JWT | Cria nova loja para o usuário logado. Valida que o usuário não tem loja |
| `GET` | `/api/stores/me/store` | JWT | Retorna a loja do usuário autenticado |
| `PATCH` | `/api/stores/me/store` | JWT | Atualiza a loja do usuário autenticado |
| `PATCH` | `/api/stores/:id/status` | JWT + `ADMIN` | Aprova ou rejeita uma loja |
| `GET` | `/api/stores/admin/all` | JWT + `ADMIN` | Lista todas as lojas (qualquer status) com filtro por status |

### Products (`/api/products`)

| Método | Rota | Auth | Query Params | Descrição |
|---|---|---|---|---|
| `GET` | `/api/products` | Público | `page`, `limit`, `search`, `categoryId`, `storeId`, `minPrice`, `maxPrice`, `type` | Lista produtos ativos com filtros e paginação |
| `GET` | `/api/products/featured` | Público | `limit` | Produtos `isFeatured=true`, ordenados por `totalSales desc` |
| `GET` | `/api/products/:id` | Público | — | Busca por ID ou slug. Retorna produto + categoria + loja + 10 reviews aprovadas |
| `POST` | `/api/products` | JWT + `LOJISTA\|FORNECEDOR\|ADMIN` | — | Cria produto para a loja do usuário logado |
| `PATCH` | `/api/products/:id` | JWT + `LOJISTA\|FORNECEDOR\|ADMIN` | — | Atualiza produto (filtra por `storeId` do usuário) |
| `DELETE` | `/api/products/:id` | JWT + `LOJISTA\|FORNECEDOR\|ADMIN` | — | Soft delete: muda `status` para `INACTIVE` |

### Categories (`/api/categories`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET` | `/api/categories` | Público | Lista todas as categorias com hierarquia pai/filho |
| `GET` | `/api/categories/:id` | Público | Busca categoria por ID |
| `POST` | `/api/categories` | JWT + `ADMIN` | Cria nova categoria |
| `PATCH` | `/api/categories/:id` | JWT + `ADMIN` | Atualiza categoria |
| `DELETE` | `/api/categories/:id` | JWT + `ADMIN` | Remove categoria |

### Orders (`/api/orders`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/api/orders` | JWT | Cria pedido. Verifica estoque, calcula totais, decrementa estoque em transação atômica |
| `GET` | `/api/orders` | JWT | Lista pedidos. `CLIENTE` vê apenas os seus; `ADMIN/LOJISTA` veem todos (com filtro `status`) |
| `GET` | `/api/orders/:id` | JWT | Detalhe do pedido. Inclui itens, cliente, loja, endereço, pagamento, mensagens |
| `PATCH` | `/api/orders/:id/status` | JWT | Atualiza status. Quando `DELIVERED`, aciona lógica de cashback |
| `PATCH` | `/api/orders/:id/cancel` | JWT | Cancela pedido (apenas de `PENDING` ou `CONFIRMED`) |

**Body de `POST /api/orders`:**
```json
{
  "storeId": "string",
  "addressId": "string?",
  "items": [{ "productId": "string", "quantity": 1, "isB2B": false }],
  "discount": 0,
  "shipping": 10.5,
  "couponCode": "string?",
  "notes": "string?"
}
```

### Payments (`/api/payments`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/api/payments` | JWT | Cria registro de pagamento para um pedido |
| `GET` | `/api/payments/order/:orderId` | JWT | Busca pagamento vinculado a um pedido |
| `PATCH` | `/api/payments/:id/refund` | JWT | Solicita estorno do pagamento |

### Campaigns (`/api/campaigns`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/api/campaigns` | JWT + `LOJISTA\|FORNECEDOR\|ADMIN` | Cria campanha. Opcionalmente cria cupom associado |
| `GET` | `/api/campaigns/store` | JWT + `LOJISTA\|FORNECEDOR\|ADMIN` | Lista campanhas da loja do usuário logado |
| `GET` | `/api/campaigns/public` | Público | Lista campanhas públicas e ativas no momento |
| `POST` | `/api/campaigns/validate-coupon` | Público | Valida cupom e retorna desconto calculado |
| `DELETE` | `/api/campaigns/:id` | JWT + `LOJISTA\|FORNECEDOR\|ADMIN` | Pausa campanha (muda status para `PAUSED`) |

**Body de `validate-coupon`:**
```json
{ "code": "SUMMER10", "orderValue": 150.00 }
```

**Retorno de `validate-coupon`:**
```json
{ "valid": true, "discount": 15.00, "coupon": {...}, "campaign": {...} }
```

### Reviews (`/api/reviews`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/api/reviews` | JWT | Cria avaliação (aprovada automaticamente). Recalcula rating do produto/loja em transação |
| `GET` | `/api/reviews/product/:productId` | Público | Lista avaliações aprovadas de um produto com paginação |
| `GET` | `/api/reviews/store/:storeId` | Público | Lista avaliações aprovadas de uma loja com paginação |
| `PATCH` | `/api/reviews/:id/approve` | JWT + `ADMIN` | Aprova avaliação (emite evento `review.approved`) |
| `PATCH` | `/api/reviews/:id/reject` | JWT + `ADMIN` | Rejeita avaliação |

### Notifications (`/api/notifications`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET` | `/api/notifications/stream` | Público (token via query) | SSE stream — retorna `Observable<MessageEvent>` filtrado por `userId` do token |
| `GET` | `/api/notifications` | JWT | Lista notificações do usuário com paginação e `unreadCount` |
| `PATCH` | `/api/notifications/:id/read` | JWT | Marca notificação como lida |
| `PATCH` | `/api/notifications/read-all` | JWT | Marca todas as notificações do usuário como lidas |

**SSE Connection:**
```
GET /api/notifications/stream?token=<accessToken>
Accept: text/event-stream

event: notification
data: { "id": "...", "type": "ORDER_UPDATE", "title": "...", "message": "..." }
```

### Analytics (`/api/analytics`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET` | `/api/analytics/admin` | JWT + `ADMIN` | Dashboard admin: total usuários, lojas, pedidos, receita, últimos 5 pedidos |
| `GET` | `/api/analytics/seller` | JWT + `LOJISTA\|FORNECEDOR\|ADMIN` | Dashboard vendedor: produtos, pedidos, receita da loja, top 5 produtos |
| `GET` | `/api/analytics/summary` | JWT + `ADMIN` | Resumo: total cashback creditado, brindes distribuídos, volume por role |

### Favorites (`/api/favorites`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/api/favorites/:productId` | JWT | Adiciona produto aos favoritos (upsert por userId+productId) |
| `GET` | `/api/favorites` | JWT | Lista favoritos do usuário com paginação |
| `DELETE` | `/api/favorites/:productId` | JWT | Remove produto dos favoritos |

### Wallet (`/api/wallet`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `GET` | `/api/wallet/me` | JWT | Retorna saldo e últimas 10 transações |
| `POST` | `/api/wallet/redeem` | JWT | Resgata cashback: debita saldo e cria transação `DEBIT` |
| `GET` | `/api/wallet/history` | JWT | Histórico completo de transações com paginação |

**Body de `POST /api/wallet/redeem`:**
```json
{ "orderId": "string", "amount": 25.00 }
```

### Entrepreneurs (`/api/entrepreneurs`)

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| `POST` | `/api/entrepreneurs/onboarding` | Público | Cadastro simplificado: cria usuário `EMPREENDEDOR` + loja em uma única operação. Retorna tokens para login imediato |

**Body:**
```json
{ "name": "string", "email": "string", "whatsapp": "string", "businessType": "string?" }
```

---

## 7. Autenticação e Autorização

### Fluxo de Login

```
1. POST /api/auth/login { email, password }
2. auth.service.ts: busca usuário no banco por email
3. bcrypt.compare(dto.password, user.password) → verifica hash
4. Se usuário SUSPENDED → UnauthorizedException
5. generateTokens(userId, email, role) → gera accessToken (15m) e refreshToken (7d)
6. updateRefreshToken() → bcrypt.hash(refreshToken, 10) → salva no banco
7. Retorna { user: {...}, accessToken, refreshToken }
```

### Como o JWT é Gerado e Validado

**Geração** (`auth.service.ts` → `generateTokens()`):
```typescript
// Access Token (curto prazo, 15 minutos)
jwtService.signAsync(
  { sub: userId, email, role },  // payload
  { secret: JWT_SECRET, expiresIn: '15m' }
)

// Refresh Token (longo prazo, 7 dias)
jwtService.signAsync(
  { sub: userId, email },  // payload mínimo
  { secret: JWT_REFRESH_SECRET, expiresIn: '7d' }
)
```

**Validação** (`jwt.strategy.ts`):
```typescript
ExtractJwt.fromAuthHeaderAsBearerToken()  // extrai do header Authorization: Bearer <token>
// Após validação da assinatura:
validate(payload) {
  // Consulta o banco para garantir que o usuário ainda existe
  return prisma.user.findUnique({ where: { id: payload.sub } })
}
```

### Como o Refresh Token Funciona

O refresh token usa **armazenamento com hash** (estratégia de rotação segura):

1. Ao fazer login/register, o refresh token é hashado com bcrypt e salvo em `users.refreshToken`
2. Para renovar: `POST /api/auth/refresh` com o refresh token no header
3. `JwtRefreshStrategy` valida a assinatura do token
4. `refreshTokens()`: busca usuário no banco → `bcrypt.compare(rt, user.refreshToken)` → gera novo par → atualiza hash
5. No logout: `users.refreshToken = null` → invalida qualquer refresh token existente

### Roles (Perfis de Acesso)

| Role (Prisma) | Descrição | Capacidades |
|---|---|---|
| `ADMIN` | Administrador da plataforma | Acesso total: aprovar/rejeitar lojas, moderar reviews, ver todos os pedidos, analytics admin, CRUD de usuários e categorias |
| `LOJISTA` | Lojista com loja registrada | Criar/editar/remover seus produtos, ver suas campanhas, ver analytics da sua loja, criar pedidos |
| `FORNECEDOR` | Fornecedor/atacadista | Mesmas permissões do LOJISTA |
| `EMPREENDEDOR` | Empreendedor (onboarding simplificado) | Cria loja automaticamente no onboarding; acessa o painel como vendedor |
| `CLIENTE` | Consumidor final | Ver catálogo, criar pedidos, avaliar, gerenciar favoritos, ver wallet |

> [!IMPORTANT]
> No frontend (`header.tsx`), o código verifica `user.role === 'SELLER' || user.role === 'LOJISTA'`. O valor `'SELLER'` **não existe** no enum do Prisma — é um bug de compatibilidade com o `shared-types` que usa `RETAILER`.

### Como os Guards Funcionam

```typescript
// JwtAuthGuard — aplicado globalmente via estratégia Passport
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [...]);
    if (isPublic) return true;  // Rota marcada com @Public() → sem verificação
    return super.canActivate(context);  // Verifica Bearer token via JwtStrategy
  }
}

// RolesGuard — verifica roles após autenticação
canActivate(context: ExecutionContext): boolean {
  const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [...]);
  if (!requiredRoles) return true;  // Sem @Roles() → qualquer autenticado passa
  const { user } = context.switchToHttp().getRequest();
  if (!requiredRoles.includes(user?.role))
    throw new ForbiddenException('Acesso negado: perfil insuficiente');
}
```

### Como os Decoradores Funcionam

```typescript
// @Public() — marca rota como pública
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// @Roles(...roles) — define roles necessárias
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

// @GetCurrentUser(key?) — extrai usuário ou campo do request
export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!data) return request.user;     // @GetCurrentUser() → objeto completo
    return request.user?.[data];        // @GetCurrentUser('id') → só o ID
  }
);
```

### `google-auth.guard.ts`

```typescript
// Apenas um alias para AuthGuard('google') do Passport
// Redireciona para o servidor OAuth do Google na primeira chamada
// Na callback, o Google retorna profile com email, nome, foto
// GoogleStrategy.validate() extrai os dados e os coloca em req.user
// AuthController.googleCallback() chama authService.googleLogin(req.user)
```

---

## 8. Módulos do Backend — Detalhado

### `AuthModule`

**Responsabilidade:** Gerenciar o ciclo de vida de autenticação de usuários.

- **Controller (`auth.controller.ts`):** 9 endpoints (register, login, logout, refresh, me, forgot-password, reset-password, google, google/callback)
- **Service (`auth.service.ts`):** Hash de senhas com `bcrypt` (salt=12), geração de tokens JWT, armazenamento de refresh token hasheado, fluxo Google OAuth, reset de senha com token temporário
- **DTOs:** `RegisterDto` (name, email, password, phone?, role?), `LoginDto` (email, password), `ForgotPasswordDto` (email), `ResetPasswordDto` (token, password)
- **Strategies:** `JwtStrategy` (valida access token), `JwtRefreshStrategy` (valida refresh token), `GoogleStrategy` (OAuth 2.0)
- **Dependências:** `PrismaModule`, `JwtModule`, `ConfigModule`, `UsersModule`
- **Casos de uso:** Registro completo, login, logout, renovação de sessão, recuperação de senha, SSO Google

### `UsersModule`

**Responsabilidade:** Gestão do perfil de usuários.

- **Controller:** 7 endpoints (listar, me, findById, update-me, update-admin, updateStatus, delete)
- **Service (`users.service.ts`):** Consulta e atualização de perfil, listagem paginada (admin), atualização de status, soft delete
- **DTOs:** `UpdateUserDto` (name?, phone?, avatar?)
- **Dependências:** `PrismaModule`
- **Casos de uso:** Administração de usuários, edição de perfil

### `StoresModule`

**Responsabilidade:** Gerenciar lojas dos vendedores.

- **Controller:** 7 endpoints
- **Service:** Cria loja com slug gerado automaticamente, busca por slug (com produtos e reviews aninhados), aprovação pelo admin (registra `approvedAt` e `approvedById`)
- **DTOs:** `CreateStoreDto` (name, description, type, cnpj?), `UpdateStoreDto` (campos opcionais)
- **Dependências:** `PrismaModule`
- **Casos de uso:** Criação de loja, vitrine pública, moderação pelo admin

### `ProductsModule`

**Responsabilidade:** Catálogo completo de produtos e serviços.

- **Controller:** 5 endpoints
- **Service:** Busca com filtros complexos (texto, categoria, loja, preço, tipo, destaque), paginação, geração automática de slug com timestamp, soft delete via `status=INACTIVE`
- **DTOs:** `CreateProductDto` (name, price, stock, type, images[], ...), `UpdateProductDto` (campos opcionais), `FilterProductsDto` (todos os parâmetros de busca)
- **Dependências:** `PrismaModule`
- **Casos de uso:** Listagem pública do catálogo, CRUD pelo vendedor, páginas de detalhe de produto

### `CategoriesModule`

**Responsabilidade:** Estrutura hierárquica de categorias.

- **Controller:** 5 endpoints (CRUD)
- **Service:** CRUD simples com suporte a hierarquia via `parentId`
- **Dependências:** `PrismaModule`
- **Casos de uso:** Organização do catálogo, filtros de busca por categoria

### `OrdersModule`

**Responsabilidade:** Fluxo completo de compra.

- **Controller:** 5 endpoints
- **Service:** Criação de pedido com validação de estoque e decremento atômico (via `$transaction`), controle de status, cashback automático no `DELIVERED` (busca campanha `CASHBACK` ativa da loja), cancelamento com validação de status
- **DTOs:** `CreateOrderDto` (storeId, addressId?, items[], discount?, shipping?, couponCode?, notes?)
- **Dependências:** `PrismaModule`, `EventEmitter2`
- **Casos de uso:** Checkout, gestão de pedidos, cashback pós-entrega

### `PaymentsModule`

**Responsabilidade:** Registro de pagamentos associados a pedidos.

- **Controller:** 3 endpoints (create, findByOrder, refund)
- **Service (`payments.service.ts`):** Criação de pagamento, consulta, estorno — estrutura básica sem gateway real integrado
- **DTOs:** `CreatePaymentDto` (orderId, method, amount, installments?)
- **Dependências:** `PrismaModule`
- **Casos de uso:** Associação de pagamento a pedido (gateway de pagamento não integrado — débito técnico)

### `CampaignsModule`

**Responsabilidade:** Sistema de campanhas promocionais e cupons.

- **Controller:** 5 endpoints
- **Service:** Criação de campanha com criação opcional de cupom (código em maiúsculas), validação completa de cupom (status, vigência, limite de uso, valor mínimo, cálculo do desconto)
- **DTOs:** `CreateCampaignDto` (name, type, discountType, discountValue, startsAt, endsAt, couponCode?)
- **Dependências:** `PrismaModule`
- **Casos de uso:** Promoções de vendedores, descontos por cupom, cashback via campanha

### `ReviewsModule`

**Responsabilidade:** Sistema de avaliações de produtos e lojas.

- **Controller:** 5 endpoints
- **Service:** Cria avaliação e recalcula rating médio do produto/loja em transação atômica; emite evento `review.approved` após criação; moderação pelo admin (approve/reject)
- **DTOs:** `CreateReviewDto` (rating, comment?, productId?, storeId?, title?)
- **Dependências:** `PrismaModule`, `EventEmitter2`
- **Casos de uso:** Social proof, moderação de conteúdo

### `NotificationsModule`

**Responsabilidade:** Notificações em tempo real e históricas.

- **Controller:** 4 endpoints (stream SSE, list, markAsRead, markAllAsRead)
- **Service:** Singleton com `Subject<Record<string,any>>` do RxJS como bus interno; `@OnEvent` para escutar eventos de outros módulos; `stream(userId)` retorna `Observable` filtrado por userId
- **Dependências:** `PrismaModule`, `JwtModule` (para validar token no SSE), `EventEmitter2`
- **Eventos escutados:** `order.confirmed`, `review.approved`
- **Casos de uso:** Badge de notificações no header, pop-up de pedido confirmado

### `AnalyticsModule`

**Responsabilidade:** Dashboards e métricas de negócio.

- **Controller:** 3 endpoints (admin, seller, summary)
- **Service:** Consultas agregadas com `Promise.all` para paralelismo, separação clara entre visão admin e visão vendedor
- **Dependências:** `PrismaModule`
- **Casos de uso:** Painel administrativo, painel do vendedor

### `FavoritesModule`

**Responsabilidade:** Lista de favoritos do usuário.

- **Controller:** 3 endpoints (add, list, remove)
- **Service:** Adiciona favorito com `upsert` para evitar duplicatas (restrição `@@unique([userId, productId])`), listagem paginada com dados do produto
- **Dependências:** `PrismaModule`
- **Casos de uso:** Wishlist do usuário

### `WalletModule`

**Responsabilidade:** Carteira digital de cashback.

- **Controller:** 3 endpoints (saldo, resgatar, histórico)
- **Service:** Resgate com validação de saldo, operação atômica (debita saldo + cria transação `DEBIT`), histórico paginado
- **DTOs:** `RedeemCashbackDto` (orderId, amount)
- **Dependências:** `PrismaModule`
- **Casos de uso:** Consulta de saldo, resgate de cashback em compras

### `EntrepreneursModule`

**Responsabilidade:** Onboarding rápido para empreendedores (fluxo simplificado).

- **Controller:** 1 endpoint (`POST /entrepreneurs/onboarding`)
- **Service:** Cria usuário `EMPREENDEDOR` + loja em `$transaction`, senha padrão `Conecta123!` (deve ser alterada posteriormente), gera tokens para login imediato
- **DTOs:** `CreateEntrepreneurDto` (name, email, whatsapp, businessType?)
- **Dependências:** `PrismaModule`, `AuthModule` (para `AuthService.generateTokens`)
- **Casos de uso:** Landing page de cadastro para empreendedores

---

## 9. Frontend — Rotas e Páginas

### Estrutura de Roteamento (Next.js App Router)

O Next.js 14 usa roteamento por sistema de arquivos. Cada pasta em `src/app/` com um `page.tsx` torna-se uma rota.

### Páginas Principais

#### `/` — Home (`page.tsx`)
- **Tipo:** Server Component (faz fetch no servidor)
- **Exibe:** Hero com produtos em destaque (busca real na API), seção "Por que escolher", CTA de cadastro
- **APIs consumidas:** `GET /api/products` (via `productService.findAll()`, revalidate: 60s)
- **Componentes:** `Header`, `Footer`, ícones Lucide

#### `/login`
- **Tipo:** Client Component
- **Exibe:** Formulário de e-mail e senha, link para cadastro, opção de login com Google
- **APIs consumidas:** `POST /api/auth/login`
- **Estado:** Chama `useAuthStore.setAuth()` ao logar com sucesso

#### `/cadastro`
- **Tipo:** Client Component
- **Exibe:** Formulário de registro completo com seleção de role
- **APIs consumidas:** `POST /api/auth/register`

#### `/catalogo`
- **Tipo:** Server/Client Component misto
- **Exibe:** Grid de produtos com filtros por categoria, preço, tipo
- **APIs consumidas:** `GET /api/products?search=&categoryId=&type=&minPrice=&maxPrice=`
- **Componentes:** `MarketplaceCard`, filtros

#### `/produto/[id]`
- **Tipo:** Server Component
- **Exibe:** Imagens do produto, descrição, preços (varejo + atacado), avaliações, botão "Adicionar ao carrinho"
- **APIs consumidas:** `GET /api/products/:id`, `GET /api/reviews/product/:id`
- **Estado:** `useCartStore.addItem()`

#### `/lojas`
- **Exibe:** Grid de lojas ativas com busca
- **APIs consumidas:** `GET /api/stores`

#### `/loja/[slug]`
- **Exibe:** Vitrine da loja: banner, logo, descrição, produtos, avaliações
- **APIs consumidas:** `GET /api/stores/:slug`

#### `/carrinho`
- **Tipo:** Client Component
- **Exibe:** Itens no carrinho, quantidades, total, botão de checkout
- **Estado:** `useCartStore` (items, updateQuantity, removeItem, getCartTotal)
- **Autenticação:** Redireciona para login se não autenticado no checkout

#### `/checkout`
- **Tipo:** Client Component
- **Exibe:** Endereço de entrega, método de pagamento, cupom, resumo do pedido
- **APIs consumidas:** `POST /api/orders`, `POST /api/campaigns/validate-coupon`
- **Estado:** `useCartStore.clearCart()` após pedido criado, `useAuthStore.accessToken`

#### `/pedidos`
- **Tipo:** Client Component
- **Exibe:** Histórico de pedidos com status visual
- **APIs consumidas:** `GET /api/orders`
- **Autenticação:** Requerida

#### `/conta`
- **Tipo:** Client Component
- **Exibe:** Perfil do usuário, endereços, wallet/cashback, configurações
- **APIs consumidas:** `GET /api/users/me`, `GET /api/wallet/me`
- **Autenticação:** Requerida

#### `/painel` (Painel do Vendedor)
- **Tipo:** Client Component
- **Subrotas:** `/painel/dashboard`, `/painel/vendas`, `/painel/produtos`, `/painel/campanhas`
- **APIs consumidas:** `GET /api/analytics/seller`, `GET /api/orders`, `GET /api/products?storeId=`, `GET /api/campaigns/store`
- **Autenticação:** JWT + role LOJISTA/FORNECEDOR/EMPREENDEDOR

#### `/admin` (Painel Admin)
- **Tipo:** Client Component
- **Subrotas:** `/admin/painel`
- **APIs consumidas:** `GET /api/analytics/admin`, `GET /api/stores/admin/all`, `GET /api/users`
- **Autenticação:** JWT + role ADMIN

#### `/onboarding`
- **Tipo:** Client Component
- **Exibe:** Formulário de cadastro rápido para empreendedores (nome, e-mail, WhatsApp)
- **APIs consumidas:** `POST /api/entrepreneurs/onboarding`

#### Páginas Informativas (sem API)
`/sobre`, `/como-comprar`, `/como-vender`, `/capacitacao`, `/central-ajuda`, `/frete-entrega`, `/metodos-pagamento`, `/planos-taxas`, `/politica-privacidade`, `/termos-uso`, `/trocas-devolucoes`, `/vendas-atacado`

---

## 10. Componentes UI

### `components/layout/header.tsx`

**O que renderiza:** Barra de navegação sticky com logo, links de navegação, busca, contador de carrinho, sino de notificações SSE, avatar do usuário com menu dropdown (perfil, pedidos, painel do vendedor, logout), menu hamburguer mobile.

**Props:** Nenhuma (usa stores Zustand diretamente)

**Dependências:** `useAuthStore`, `useCartStore`, `useNotifications`, componentes shadcn/ui

**Funcionalidade especial:** Exibe saldo da wallet no header (`user.wallet.balance`) e badge animado nas notificações não lidas.

### `components/layout/footer.tsx`

**O que renderiza:** Rodapé com links para páginas informativas, redes sociais, copyright.

**Props:** Nenhuma

### `components/marketplace/marketplace-card.tsx`

**O que renderiza:** Card de produto ou serviço para o catálogo. Diferencia visualmente produtos (azul/primário) de serviços (violeta) com ícones, cores e texto de CTA distintos.

**Props:**
| Prop | Tipo | Descrição |
|---|---|---|
| `id` | `string` | ID do produto (usado no link `/produto/:id`) |
| `name` | `string` | Nome do produto/serviço |
| `store` | `string` | Nome da loja |
| `price` | `number` | Preço de varejo |
| `priceB2B?` | `number` | Preço de atacado (exibido como badge "Atacado") |
| `rating` | `number` | Nota média |
| `image` | `string` | URL da imagem principal |
| `type` | `"PRODUCT" \| "SERVICE"` | Define aparência visual |

**Onde é usado:** Páginas de catálogo, loja

### `components/providers.tsx`

**O que faz:** Wrapper de providers React para toda a aplicação. Atualmente mínimo — apenas envolve `children`. Necessário para componentes client-side em Server Component contexts.

### Componentes de Design System (`components/ui/`)

| Componente | Base Radix | Descrição |
|---|---|---|
| `button.tsx` | — | Botão com variantes (default, destructive, outline, secondary, ghost, link) e tamanhos |
| `input.tsx` | — | Campo de entrada padrão |
| `card.tsx` | — | Container com `CardHeader`, `CardContent`, `CardFooter` |
| `badge.tsx` | — | Etiqueta inline com variantes de cor |
| `dialog.tsx` | `@radix-ui/react-dialog` | Modal acessível com overlay |
| `dropdown-menu.tsx` | `@radix-ui/react-dropdown-menu` | Menu dropdown com grupos, separadores, atalhos |
| `select.tsx` | `@radix-ui/react-select` | Select nativo acessível |
| `tabs.tsx` | `@radix-ui/react-tabs` | Abas com `TabsList`, `TabsTrigger`, `TabsContent` |
| `table.tsx` | — | Tabela com `TableHead`, `TableBody`, `TableRow`, `TableCell` |
| `avatar.tsx` | `@radix-ui/react-avatar` | Avatar circular com fallback (inicial do nome) |
| `sheet.tsx` | `@radix-ui/react-dialog` | Painel lateral (drawer) |
| `skeleton.tsx` | — | Placeholder animado de carregamento |
| `sonner.tsx` | `sonner` | Configuração global do toast de notificações |
| `switch.tsx` | `@radix-ui/react-switch` | Toggle on/off acessível |
| `checkbox.tsx` | `@radix-ui/react-checkbox` | Checkbox acessível |
| `radio-group.tsx` | `@radix-ui/react-radio-group` | Grupo de radios acessível |
| `label.tsx` | `@radix-ui/react-label` | Label acessível associado a inputs |
| `separator.tsx` | `@radix-ui/react-separator` | Divisor horizontal ou vertical |
| `textarea.tsx` | — | Área de texto multi-linha |

---

## 11. Gerenciamento de Estado (Zustand)

### `useAuthStore` (`store/useAuthStore.ts`)

**Qual estado gerencia:** Dados do usuário autenticado, access token, flag de autenticação.

**Persistência:** `localStorage` com chave `conecta-auth-storage` (via `zustand/middleware/persist`)

| State | Tipo | Descrição |
|---|---|---|
| `user` | `User \| null` | Dados do usuário (id, name, email, role, avatar, wallet?, store?) |
| `accessToken` | `string \| null` | Access token JWT atual |
| `isAuthenticated` | `boolean` | Flag derivada do user/token |

| Action | Parâmetros | Descrição |
|---|---|---|
| `setAuth(user, accessToken)` | `User, string` | Seta usuário e token após login/registro |
| `logout()` | — | Limpa state e localStorage |
| `updateUser(partial)` | `Partial<User>` | Atualiza campos do usuário sem fazer logout |

**Consumido por:** `Header`, todas as páginas protegidas, `useNotificationsStore`

### `useCartStore` (`store/useCartStore.ts`)

**Qual estado gerencia:** Itens do carrinho de compras.

**Persistência:** `localStorage` com chave `conecta-cart-storage`

| State | Tipo | Descrição |
|---|---|---|
| `items` | `CartItem[]` | Lista de itens com productId, name, price, quantity, stock, isB2B, storeId |

| Action | Parâmetros | Descrição |
|---|---|---|
| `addItem(item)` | `CartItem` | Adiciona item. Se já existe, incrementa quantidade (respeita `stock`) |
| `removeItem(productId)` | `string` | Remove item por productId |
| `updateQuantity(productId, qty)` | `string, number` | Atualiza quantidade (min 1, max stock) |
| `clearCart()` | — | Esvazia o carrinho |
| `getCartTotal()` | — | Calcula total: `sum(price * quantity)` |
| `getCartCount()` | — | Conta total de itens: `sum(quantity)` |

**Consumido por:** `Header` (badge de contagem), página do carrinho, checkout

### `useNotificationsStore` / `useNotifications` (`store/useNotifications.ts`)

**Qual estado gerencia:** Notificações do usuário em tempo real.

**Sem persistência** (dados voláteis, recarregados da API).

| State | Tipo | Descrição |
|---|---|---|
| `notifications` | `Notification[]` | Lista de notificações do usuário |
| `unreadCount` | `number` | Contador de não lidas |
| `loading` | `boolean` | Flag de carregamento |
| `eventSource` | `EventSource \| null` | Conexão SSE ativa |

| Action | Parâmetros | Descrição |
|---|---|---|
| `fetchNotifications()` | — | `GET /api/notifications` com Bearer token |
| `connectStream()` | — | Abre `EventSource` para SSE, escuta evento `notification`, evita duplicatas |
| `disconnectStream()` | — | Fecha `EventSource` |
| `markAsRead(id)` | `string` | `PATCH /api/notifications/:id/read`, atualiza state local |
| `markAllAsRead()` | — | `PATCH /api/notifications/read-all`, atualiza state local |

**Hook `useNotifications()`:** Conecta/desconecta automaticamente o stream via `useEffect` quando `isAuthenticated` muda.

**Consumido por:** `Header` (badge e dropdown de notificações)

---

## 12. Funcionalidades Detalhadas

### 12.1 Autenticação

**Registro:**
```
[Frontend] Formulário → POST /api/auth/register
[Backend] AuthService.register():
  1. Verifica email único (ConflictException se duplicado)
  2. bcrypt.hash(password, 12)
  3. prisma.user.create({ ..., wallet: { create: { balance: 0 } } })
  4. generateTokens() → retorna access + refresh tokens
  5. updateRefreshToken() → bcrypt.hash(refreshToken, 10) → salva no banco
  6. Retorna { user, accessToken, refreshToken }
[Frontend] useAuthStore.setAuth(user, accessToken) → persiste em localStorage
```

**Login / Logout / Refresh:** Ver seção 7.

**Recuperação de senha:**
```
POST /api/auth/forgot-password { email }
→ Gera token aleatório (32 bytes hex) com expiração de 1h
→ Salva em resetPasswordToken e resetPasswordExpires
→ TODO: enviar e-mail (não implementado)
→ Retorna mensagem genérica (não revela se email existe)

POST /api/auth/reset-password { token, password }
→ Busca usuário com token válido e não expirado
→ bcrypt.hash(newPassword, 12)
→ Limpa resetPasswordToken, resetPasswordExpires e refreshToken
```

### 12.2 Catálogo de Produtos e Serviços

```
[Frontend] GET /api/products?page=1&limit=20&search=alface&type=PRODUCT
[Backend] ProductsService.findAll():
  - Constrói where clause dinâmica com Prisma.ProductWhereInput
  - Filtra por status ACTIVE por padrão
  - Busca case-insensitive por nome
  - Filtro por faixa de preço (gte/lte)
  - Paginação com skip/take
  - Retorna { data, total, page, limit, totalPages }
[Frontend] Renderiza MarketplaceCard para cada produto
```

### 12.3 Busca e Filtros

A busca é feita diretamente via query params na API. O frontend envia:
- `search` → busca `icontains` no campo `name`
- `categoryId` → filtra por categoria
- `storeId` → filtra por loja
- `minPrice/maxPrice` → faixa de preço
- `type` → `PRODUCT` ou `SERVICE`
- `featured` → apenas produtos em destaque

Não há busca full-text (Elasticsearch/Meilisearch) — apenas `LIKE` com `mode: 'insensitive'` do Prisma.

### 12.4 Carrinho de Compras

O carrinho é 100% **client-side**, persistido no `localStorage` via Zustand:
- Ao adicionar um produto, verifica se já está no carrinho (acumula quantidade, respeita `stock`)
- Não há verificação de estoque real-time no carrinho (apenas na criação do pedido)
- Carrinho pode conter itens de lojas diferentes (sem validação)

> [!WARNING]
> O checkout cria um único pedido com `storeId`, então itens de múltiplas lojas no carrinho causarão erro ou comportamento indefinido.

### 12.5 Checkout e Pedidos

```
[Frontend] Página /checkout:
  1. Exibe itens do cartStore
  2. Usuário seleciona endereço e método de pagamento
  3. Valida cupom (POST /api/campaigns/validate-coupon)
  4. POST /api/orders { storeId, items, discount, shipping, couponCode }
  5. POST /api/payments { orderId, method, amount }
  6. useCartStore.clearCart()
  7. Redireciona para /pedidos

[Backend] OrdersService.create():
  - Busca cada produto no banco
  - Verifica estoque (BadRequestException se insuficiente)
  - Calcula subtotal, total
  - prisma.$transaction():
    a) Cria Order com items (snapshot de nome, sku, imagem, preço)
    b) Decrementa stock de cada produto
```

### 12.6 Wallet e Cashback

**Ganho de cashback:**
```
PATCH /api/orders/:id/status { status: "DELIVERED" }
→ OrdersService.handleCashback() dentro de $transaction:
  1. Busca campanha CASHBACK ativa para a loja do pedido
  2. Calcula cashback (% do total ou valor fixo)
  3. wallet.upsert() → cria ou atualiza saldo
  4. transaction.create() com type=CREDIT

[Frontend] Header exibe saldo atualizado da wallet
```

**Resgate de cashback:**
```
POST /api/wallet/redeem { orderId, amount }
→ WalletService.redeemCashback():
  - Verifica saldo suficiente
  - $transaction: decrementa balance + cria transaction DEBIT
```

### 12.7 Dashboard do Vendedor

```
[Frontend] /painel/dashboard → GET /api/analytics/seller
[Backend] AnalyticsService.getSellerDashboard(storeId):
  - Promise.all():
    - Count de produtos da loja
    - Count de pedidos da loja
    - Sum de receita (pedidos CONFIRMED + DELIVERED)
    - 5 últimos pedidos com cliente
    - 5 produtos mais vendidos (por totalSales)
```

### 12.8 Gestão de Produtos (CRUD)

```
[Frontend] /painel/produtos → CRUD via forms
[Backend]:
  - POST /api/products → slug gerado automaticamente (nome + timestamp)
  - PATCH /api/products/:id → só atualiza se storeId do produto = storeId do usuário
  - DELETE /api/products/:id → muda status para INACTIVE (soft delete)
```

### 12.9 Notificações em Tempo Real (SSE)

```
[Frontend] useNotifications() hook:
  1. Abre EventSource("/api/notifications/stream?token=<accessToken>")
  2. Escuta evento 'notification'
  3. Adiciona ao state local (sem duplicatas)
  4. Header exibe badge animado com unreadCount

[Backend] NotificationsController.streamNotifications():
  1. Verifica token via jwtService.verify(token)
  2. Chama notificationsService.stream(userId)
  3. Retorna Observable<MessageEvent> filtrado por userId

[Backend] NotificationsService:
  - Subject<any> como bus interno (armazenado em memória)
  - @OnEvent('order.confirmed') → cria notification + emite no Subject
  - @OnEvent('review.approved') → cria notification + emite no Subject
```

> [!CAUTION]
> A implementação atual usa um `Subject` em memória. **Em ambiente com múltiplas instâncias (cluster)**, notificações emitidas em uma instância não chegam a clientes conectados em outras instâncias. Para produção com escalabilidade, seria necessário usar Redis Pub/Sub.

### 12.10 Sistema de Reviews e Avaliações

```
[Frontend] Página do produto → POST /api/reviews { rating, comment, productId }
[Backend] ReviewsService.create():
  1. $transaction():
    a) Cria review com status 'APPROVED' (auto-aprovação)
    b) Recalcula rating médio do produto/loja
    c) Atualiza product.rating e product.totalReviews
  2. emit('review.approved') → gera notificação para o autor
```

### 12.11 Campanhas e Cupons

**Criação:**
```
[Vendedor] POST /api/campaigns { name, type: 'COUPON', discountType: 'PERCENTAGE', discountValue: 10, couponCode: 'DESCONTO10', startsAt, endsAt }
→ Cria Campaign + Coupon { code: 'DESCONTO10' }
```

**Validação no checkout:**
```
POST /api/campaigns/validate-coupon { code: 'DESCONTO10', orderValue: 100 }
→ Verifica: existe, ativo, dentro do período, limite não atingido, valor mínimo
→ Calcula desconto: (100 * 10/100) = R$10,00
→ Retorna { valid: true, discount: 10, ... }
```

### 12.12 Analytics e Relatórios

| Dashboard | Dados |
|---|---|
| **Admin** | Total usuários, total lojas, total pedidos, receita total (CONFIRMED+DELIVERED), últimos 5 pedidos |
| **Vendedor** | Total produtos, total pedidos, receita da loja, últimos 5 pedidos da loja, top 5 produtos por vendas |
| **Summary (Admin)** | Total cashback distribuído, total brindes, volume de vendas por role (LOJISTA, EMPREENDEDOR) |

### 12.13 Painel Administrativo

- **Gestão de lojas:** `PATCH /api/stores/:id/status` → aprova ou rejeita lojas
- **Gestão de usuários:** Listar, alterar status, desativar
- **Moderação de reviews:** `PATCH /api/reviews/:id/approve|reject`
- **Categorias:** CRUD completo
- **Analytics:** Dashboard consolidado de toda a plataforma

---

## 13. Infraestrutura e DevOps

### Docker Compose (`docker-compose.yml`)

| Container | Imagem | Porta | Função |
|---|---|---|---|
| `conecta_postgres` | `postgres:16-alpine` | 5432 | Banco de dados principal PostgreSQL |
| `conecta_mongodb` | `mongo:7-jammy` | 27017 | Banco de logs/auditoria (futuro — não integrado ao código) |
| `conecta_redis` | `redis:7-alpine` | 6379 | Cache e sessões (futuro — não integrado ao código) |
| `conecta_api` | Build local `./apps/api` | 3001 | Backend NestJS |
| `conecta_web` | Build local `./apps/web` | 3000 | Frontend Next.js |
| `conecta_pgadmin` | `dpage/pgadmin4` | 5050 | Interface visual para PostgreSQL (opcional, perfil `tools`) |

**Dependências dos serviços:**
- `api` depende de `postgres`, `mongodb` e `redis` (com health checks)
- `web` depende de `api`

**Healthchecks:**
- `postgres`: `pg_isready -U ${POSTGRES_USER}`
- `mongodb`: `mongosh --eval "db.adminCommand('ping')"`
- `redis`: `redis-cli -a ${REDIS_PASSWORD} ping`

**Volume persistente:** `postgres_data`, `mongodb_data`, `redis_data`, `uploads_data`

**Rede:** Todos os containers na rede `conecta_network`

### `docker-entrypoint.sh`

Script executado no início do container `api`:
```bash
1. Aguarda PostgreSQL ficar pronto (pg_isready em loop com sleep 2s)
2. cd /app/apps/api
3. pnpm exec prisma generate  # Gera o Prisma Client
4. pnpm exec prisma migrate deploy  # Aplica migrations pendentes
5. pnpm exec prisma db seed || echo "Seed já executado"  # Seed inicial
6. pnpm run dev  # Inicia NestJS em modo watch
```

### Variáveis de Ambiente (`.env.example`)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | ✅ | Connection string do PostgreSQL |
| `JWT_SECRET` | ✅ | Segredo do access token (mín. 32 chars) |
| `JWT_REFRESH_SECRET` | ✅ | Segredo do refresh token (mín. 32 chars) |
| `JWT_EXPIRES_IN` | — | Duração do access token (padrão: `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | — | Duração do refresh token (padrão: `7d`) |
| `PORT` | — | Porta da API (padrão: `3001`) |
| `NODE_ENV` | — | Ambiente (`development`, `production`) |
| `FRONTEND_URL` | — | URL do frontend para CORS |
| `CORS_ORIGIN` | — | Origem permitida no CORS |
| `THROTTLE_TTL` | — | Janela do rate limiter em segundos (padrão: 60) |
| `THROTTLE_LIMIT` | — | Máximo de requisições por janela (padrão: 100) |
| `GOOGLE_CLIENT_ID` | — | ID do app Google OAuth |
| `GOOGLE_CLIENT_SECRET` | — | Segredo do app Google OAuth |
| `GOOGLE_CALLBACK_URL` | — | URL de callback do Google |
| `SMTP_HOST/PORT/USER/PASS` | — | Configurações de e-mail (não implementado) |
| `UPLOAD_DIR` | — | Diretório de uploads (padrão: `./uploads`) |
| `MAX_FILE_SIZE` | — | Tamanho máximo de arquivo em bytes (padrão: 10MB) |
| `POSTGRES_USER/PASSWORD/DB` | — | Credenciais PostgreSQL (para Docker) |
| `MONGO_USER/PASSWORD/DB` | — | Credenciais MongoDB (para Docker) |
| `REDIS_PASSWORD` | — | Senha Redis (para Docker) |
| `PGADMIN_EMAIL/PASSWORD` | — | Credenciais pgAdmin (para Docker) |
| `NEXT_PUBLIC_API_URL` | — | URL base da API acessível pelo browser |

### Turborepo (`turbo.json`)

O Turborepo gerencia o build pipeline do monorepo:

| Task | Dependência | Cache | Saída |
|---|---|---|---|
| `build` | `^build` (deps primeiro) | ✅ | `.next/**`, `dist/**` |
| `dev` | — | ❌ | Modo watch, sem cache |
| `lint` | — | ✅ | — |
| `typecheck` | — | ✅ | — |
| `test` | — | ❌ | `coverage/**` |
| `db:seed` | `db:migrate` | ❌ | — |

**Execução:** `pnpm turbo run build` processa todos os pacotes em paralelo, com cache inteligente baseado em hash dos arquivos.

### CI/CD (`.github/workflows/ci.yml`)

Pipeline ativado em `push` e `pull_request` para a branch `main`:

```
1. Checkout do código (actions/checkout@v4)
2. Setup Node.js 20 (actions/setup-node@v4)
3. Setup pnpm 9 (pnpm/action-setup@v3)
4. Cache do pnpm store (baseado em pnpm-lock.yaml)
5. pnpm install --frozen-lockfile
6. pnpm lint
7. pnpm --filter @conecta/web test:run
8. pnpm build
```

> [!NOTE]
> O pipeline **não executa testes do backend** nem testes de integração. Também não faz deploy automático.

---

## 14. Segurança

### Hash de Senhas

```typescript
// Registro e reset de senha: salt rounds = 12 (mais seguro, mais lento)
const hash = await bcrypt.hash(password, 12);

// Refresh token armazenado: salt rounds = 10
const hash = await bcrypt.hash(refreshToken, 10);
```

### Proteção de Tokens

- **Access Token:** Curto prazo (15 minutos). Assinado com `JWT_SECRET`
- **Refresh Token:** Longo prazo (7 dias), mas **nunca armazenado em texto plano** — apenas seu hash bcrypt no banco
- **Invalidação:** Logout limpa `refreshToken = null` → token existente em mãos do atacante se torna inútil

### Rate Limiting

Configurado via `@nestjs/throttler` no `AppModule`:
```typescript
ThrottlerModule.forRootAsync({
  useFactory: (config) => [{
    ttl: config.get('THROTTLE_TTL', 60),    // janela de 60 segundos
    limit: config.get('THROTTLE_LIMIT', 100), // máx. 100 requests por IP
  }]
})
```

### Validação de Inputs

`ValidationPipe` global em `main.ts`:
```typescript
new ValidationPipe({
  whitelist: true,              // Remove campos não declarados no DTO
  forbidNonWhitelisted: true,   // Rejeita requests com campos desconhecidos
  transform: true,              // Converte tipos automaticamente (string → number)
  transformOptions: { enableImplicitConversion: true }
})
```

Cada DTO usa decoradores `class-validator`:
- `@IsEmail()`, `@IsString()`, `@MinLength(8)`, `@IsOptional()`, `@IsEnum()`, etc.

### Headers de Segurança HTTP

`helmet()` aplicado globalmente em `main.ts` adiciona headers como:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-XSS-Protection`

### Guards e Interceptors

- **`JwtAuthGuard`**: Globalmente aplicado (todas as rotas exigem autenticação, exceto `@Public()`)
- **`RolesGuard`**: Aplicado por endpoint quando `@Roles()` é declarado
- **`HttpExceptionFilter`**: Global, captura todas as exceções, loga erros 500+ com stack trace

### `google-auth.guard.ts`

Simples alias para `AuthGuard('google')`. Aciona a `GoogleStrategy` que:
1. Inicia o redirect para accounts.google.com
2. No callback, extrai `googleId`, `email`, `name`, `avatar` do profile
3. Chama `done(null, user)` passando os dados para o controller

Se `GOOGLE_CLIENT_ID` não estiver configurado, a estratégia usa `'placeholder'` e loga um warning. O guard não bloqueia a inicialização da aplicação.

### Validação de Variáveis de Ambiente

`env.validation.ts` usa `class-validator` no startup da aplicação:
- `DATABASE_URL`: obrigatória, string
- `JWT_SECRET`: obrigatório, mínimo 32 caracteres
- `JWT_REFRESH_SECRET`: obrigatório, mínimo 32 caracteres

Se qualquer validação falhar, a aplicação **não sobe** — falha rápida e segura.

---

## 15. Padrões de Código

### Convenções de Nomenclatura

| Elemento | Convenção | Exemplo |
|---|---|---|
| Classes | PascalCase | `AuthService`, `JwtAuthGuard` |
| Interfaces | PascalCase | `ActiveUser`, `CartItem` |
| Variáveis/funções | camelCase | `generateTokens`, `accessToken` |
| Enums | PascalCase (valor UPPER_SNAKE) | `UserRole.ADMIN`, `OrderStatus.DELIVERED` |
| Arquivos | kebab-case | `auth.service.ts`, `jwt-auth.guard.ts` |
| Tabelas Prisma | snake_case (mapeadas via `@@map`) | `order_items`, `campaign_items` |
| Rotas Next.js | kebab-case | `/como-comprar`, `/central-ajuda` |
| Componentes React | PascalCase | `MarketplaceCard`, `Header` |
| Stores Zustand | camelCase com prefixo `use` | `useAuthStore`, `useCartStore` |

### Estrutura Padrão de um Módulo NestJS

```typescript
// users.module.ts
@Module({
  imports: [PrismaModule],          // Dependências de outros módulos
  controllers: [UsersController],   // Controllers do módulo
  providers: [UsersService],        // Services, guards, etc.
  exports: [UsersService],          // O que outros módulos podem importar
})
export class UsersModule {}

// users.controller.ts
@ApiTags('users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar usuários' })
  findAll(@Query('page') page?: number) {
    return this.usersService.findAll(page);
  }
}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    // lógica de negócio
  }
}
```

### Estrutura Padrão de uma Página Next.js

```typescript
// app/catalogo/page.tsx (Server Component)
export default async function CatalogoPage({ searchParams }) {
  const products = await productService.findAll(searchParams);
  return (
    <>
      <Header />
      <main>
        {products.map(p => <MarketplaceCard key={p.id} {...p} />)}
      </main>
      <Footer />
    </>
  );
}

// app/login/page.tsx (Client Component)
'use client';
export default function LoginPage() {
  const { setAuth } = useAuthStore();
  // lógica de formulário
}
```

### Como DTOs são Validados

```typescript
// create-product.dto.ts
import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;
}
// O ValidationPipe global cuida de validar automaticamente o body
// antes de chegar ao método do controller
```

### Como Erros são Tratados (`HttpExceptionFilter`)

O filtro global captura TODAS as exceções:

```typescript
@Catch()  // Captura qualquer exceção, não apenas HttpException
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;  // 500 para exceções não-HTTP

    // Loga erro 500+ com stack trace
    if (status >= 500) {
      this.logger.error(`${method} ${url} ${status}`, exception.stack);
    } else {
      this.logger.warn(`${method} ${url} ${status} - ${message}`);
    }

    // Retorna sempre JSON padronizado:
    response.status(status).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,  // mensagem da exceção
    });
  }
}
```

### Como Logs são Gerados

O NestJS usa o `Logger` nativo:
```typescript
const logger = new Logger('HttpExceptionFilter');
logger.error('mensagem', stack);  // nível ERROR
logger.warn('mensagem');           // nível WARN
logger.log('mensagem');            // nível LOG
```

Para desenvolvimento, os logs são exibidos no terminal com coloração por nível.

---

## 16. Glossário

### Termos de Domínio

| Termo | Definição |
|---|---|
| **Wallet** | Carteira digital do usuário que armazena saldo de cashback acumulado |
| **Cashback** | Percentual ou valor fixo devolvido ao cliente após uma compra ser confirmada como entregue |
| **Seed** | Script que popula o banco de dados com dados iniciais para desenvolvimento/demonstração |
| **Empreendedor** | Perfil de usuário com cadastro simplificado (apenas nome, e-mail, WhatsApp), criado com loja automática |
| **Lojista** | Perfil de vendedor com loja registrada e aprovada pelo admin |
| **Fornecedor** | Perfil de atacadista que pode definir preços B2B |
| **Slug** | Versão da string normalizada para uso em URLs (ex: "Horta Orgânica" → "horta-organica") |
| **Campanha** | Promoção criada por um vendedor: pode ser cashback, cupom, brinde, flash sale ou frete grátis |
| **Cupom** | Código alfanumérico associado a uma campanha, aplicado pelo cliente no checkout |
| **Onboarding** | Processo simplificado de cadastro para empreendedores, criando conta e loja em uma única operação |
| **Review** | Avaliação de produto ou loja feita por um usuário, com nota de 1 a 5 e comentário opcional |
| **Soft delete** | Deleção lógica: o registro não é removido do banco, apenas marcado como inativo/deletado |
| **Atacado (B2B)** | Modalidade de venda com preço diferenciado para empresas, com quantidade mínima |
| **Varejo (B2C)** | Modalidade de venda padrão para o consumidor final |

### Siglas

| Sigla | Significado |
|---|---|
| **SSE** | Server-Sent Events — protocolo de comunicação unidirecional servidor → cliente via HTTP, usado para notificações em tempo real |
| **JWT** | JSON Web Token — padrão de token de autenticação stateless, assinado digitalmente |
| **ORM** | Object-Relational Mapping — camada de abstração que mapeia objetos de código para tabelas do banco (Prisma) |
| **DTO** | Data Transfer Object — classe que define a estrutura dos dados de entrada/saída de um endpoint |
| **RBAC** | Role-Based Access Control — controle de acesso baseado em papéis (roles) |
| **CUID** | Collision-resistant Unique Identifier — tipo de ID gerado pelo Prisma, mais legível que UUID |
| **B2B** | Business to Business — transações entre empresas |
| **B2C** | Business to Consumer — transações de empresa para consumidor final |
| **SSR** | Server-Side Rendering — renderização de páginas no servidor (Next.js) |
| **SSG** | Static Site Generation — geração estática de páginas (Next.js) |
| **CORS** | Cross-Origin Resource Sharing — política que controla quais origens podem acessar a API |
| **OAuth** | Open Authorization — protocolo de autorização usado para login social (Google) |
| **SMTP** | Simple Mail Transfer Protocol — protocolo de envio de e-mails |
| **pnpm** | Package manager eficiente com workspaces, usando hard links para economizar espaço |
| **CI/CD** | Continuous Integration / Continuous Deployment — pipeline automático de build, teste e deploy |
| **MVC** | Model-View-Controller — padrão arquitetural (Prisma=Model, NestJS Service=Controller, DTO=View layer) |

### Conceitos Arquiteturais

| Conceito | Definição no Projeto |
|---|---|
| **Monorepo** | Repositório único contendo múltiplos projetos (`apps/api`, `apps/web`, `packages/shared-types`) gerenciados com pnpm workspaces e Turborepo |
| **Guard (NestJS)** | Classe que implementa `CanActivate`, decide se uma requisição pode prosseguir (autenticação, autorização) |
| **Strategy (Passport)** | Implementação de um método de autenticação (JWT, Google OAuth) encapsulada em uma classe reutilizável |
| **Decorator (TypeScript)** | Função que anota classes, métodos ou parâmetros com metadados (ex: `@Roles()`, `@Public()`, `@GetCurrentUser()`) |
| **EventEmitter** | Sistema de pub/sub interno do NestJS. Um módulo emite eventos (`emit`), outro os escuta (`@OnEvent`) |
| **Observable (RxJS)** | Stream reativo de dados assíncronos. Usado para o canal SSE de notificações |
| **Subject (RxJS)** | Observable especial que pode receber valores externamente (`next()`). Funciona como bus interno de eventos |
| **Prisma Transaction** | `prisma.$transaction([...])` — executa múltiplas operações no banco de forma atômica (todas ou nenhuma) |
| **App Router (Next.js)** | Sistema de roteamento baseado em sistema de arquivos do Next.js 14, com suporte a Server Components e layouts aninhados |
| **Hydration** | Processo em que o React no browser "reconecta" com o HTML renderizado pelo servidor, tornando-o interativo |

---

> [!TIP]
> **Swagger UI** disponível em `http://localhost:3001/api/docs` quando a API está rodando. Permite testar todos os endpoints diretamente pelo browser com autenticação Bearer.

---

## Débitos Técnicos Identificados

| # | Problema | Localização | Impacto |
|---|---|---|---|
| 1 | **TODO: Envio de e-mail não implementado** | `auth.service.ts:117` | Recuperação de senha não funciona — token gerado mas e-mail não enviado |
| 2 | **Divergência de enums entre shared-types e Prisma** | `packages/shared-types/src/index.ts` vs `schema.prisma` | Frontend usa `SUPPLIER/RETAILER`, backend usa `FORNECEDOR/LOJISTA` |
| 3 | **Check de role no Header com valor inexistente** | `header.tsx:148` | `user.role === 'SELLER'` — valor não existe no enum Prisma |
| 4 | **Campos duplicados em Campaign** | `schema.prisma:383-384` | `startDate/endDate` são nullable mas `startsAt/endsAt` são not-null; os primeiros não são usados |
| 5 | **MongoDB e Redis não integrados** | `docker-compose.yml`, `package.json` | Containers existem mas não são usados no código NestJS |
| 6 | **SSE não escala horizontalmente** | `notifications.service.ts:10` | `Subject` em memória — em múltiplas instâncias, notificações se perdem |
| 7 | **Gateway de pagamento não implementado** | `payments.service.ts` | Registro de pagamento existe mas sem integração real (Stripe, Mercado Pago, etc.) |
| 8 | **Soft delete não totalmente implementado** | `schema.prisma`, `users.service.ts` | Campo `deletedAt` existe mas não é filtrado nas queries |
| 9 | **Auto-aprovação de reviews** | `reviews.service.ts:16` | Reviews criadas já com `status: 'APPROVED'` — fluxo de moderação é desnecessário |
| 10 | **twoFactor não implementado** | `schema.prisma:134-135` | Campos `twoFactorEnabled/twoFactorSecret` existem mas não há lógica de 2FA |
| 11 | **Carrinho sem validação de loja única** | `useCartStore.ts` | Checkout pode ter itens de múltiplas lojas, causando erro ao criar pedido |
| 12 | **Upload de imagens sem implementação** | `package.json` (multer, sharp) | Dependências instaladas mas sem endpoint de upload real |
