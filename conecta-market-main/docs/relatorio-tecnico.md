# Relatório Técnico — Conecta Market

## 1. Visão Geral do Projeto
O **Conecta Market** é uma plataforma inovadora de marketplace híbrido B2B e B2C. O projeto tem como diferencial a inclusão digital e social, oferecendo um ecossistema completo para fornecedores, lojistas, pequenos empreendedores e clientes finais com uma experiência de uso otimizada para diferentes níveis de letramento digital.

## 2. Arquitetura da Solução
A arquitetura escolhida foi a de um **Monorepo** gerenciado pelo **Turborepo** e **pnpm**, dividida em:
- **Frontend (apps/web)**: Construído com React 18 e Next.js 14 utilizando o App Router para aproveitar os recursos avançados do Server Components (RSC) e otimização de SEO. A interface é estruturada utilizando TailwindCSS e componentes do shadcn/ui. O estado global leve é gerido pelo Zustand e as mutações assíncronas via React Query.
- **Backend (apps/api)**: Desenvolvido com NestJS, utilizando uma arquitetura modular por domínios (Auth, Users, Stores, Products, Orders, etc). A modelagem de dados relacional é orquestrada através do Prisma ORM (PostgreSQL).
- **Pacotes Compartilhados**: `packages/shared-types` encapsula as tipagens, DTOs compartilháveis e interfaces para uso simultâneo no frontend e backend.

## 3. Decisões de Design
- **Inclusão Digital**: A navegação foi estruturada com uso intenso de micro-interações, ícones descritivos (Lucide React) e alto contraste. Formulários longos foram subdivididos ou simplificados.
- **Híbrido B2B/B2C**: A estrutura do banco suporta preços diferenciados no varejo (b2cPrice) e atacado (b2bPrice) com regra de quantidade mínima de compra.
- **Micro-componentização**: Os componentes de UI (shadcn) encapsulam a lógica de estilo baseando-se em classes utilitárias (Tailwind), evitando repetição de código CSS e facilitando a tematização global (`globals.css`).

## 4. Estrutura e Modelo de Dados
Os dados principais do ecossistema estão agrupados nas seguintes entidades:
- **User**: Gerenciamento de credenciais e roles (`ADMIN`, `SELLER`, `CUSTOMER`, `SUPPLIER`).
- **Store**: Representação da pessoa jurídica/física no marketplace, contendo dados visuais e regras de negócio.
- **Product & Category**: Gestão de catálogo, hierarquia de produtos e precificação.
- **Order & OrderItem**: Processamento do fluxo de compra.

O modelo ER detalhado pode ser consultado no diagrama dentro da pasta `/docs/diagrama-er`.

## 5. Fluxos Principais
1. **Onboarding de Vendedor**: O usuário cria a conta, navega para a página de vendas, cria sua "Store" preenchendo as informações e aguardando a aprovação por parte de um admin.
2. **Gestão de Catálogo (Vendedor)**: O vendedor tem acesso a um painel (Dashboard) com listagem de pedidos, vendas mensais e CRUD de produtos.
3. **Fluxo de Compra B2C/B2B**: O cliente pode acessar a loja virtual (ou catálogo), e a aplicação adapta o preço a exibir baseado no seu carrinho de compras e tipo de perfil ativo.
4. **Checkout**: Finalização da compra centralizada com a criação do Order e diminuição do Stock (estoque).

## 6. Instruções de Deploy
1. **Infraestrutura**: Recomenda-se utilizar a AWS, Vercel (para Frontend) e um serviço de contêineres como Render, Railway ou AWS ECS para o Backend.
2. **Banco de Dados**: O PostgreSQL (junto com o Prisma) deve ser hospedado em instâncias gerenciadas (ex: AWS RDS, Supabase, Neon).
3. **Pipeline (CI/CD)**: O projeto inclui configurações base. O Turborepo possui o comando de `build` global:
   ```bash
   pnpm install
   pnpm build
   ```
4. **Variáveis de Ambiente**: Todas as instâncias em produção devem refletir o `.env.example`, incluindo chaves de API, segredos de JWT (`JWT_SECRET`) e chaves OAuth (quando ativado).

## 7. Próximos Passos (Evolução)
- Implementação de um módulo robusto para sistema de comissionamento de marketplace via gateways de pagamento como Stripe Connect ou Pagar.me.
- Expansão do módulo Mongoose/MongoDB para armazenar e consultar rapidamente Logs de sistema e auditorias de alta volumetria.
- Integração da IA (Gemini/OpenAI) para criação automática de descrição de produtos visando facilitar o trabalho do vendedor de baixo letramento digital.
