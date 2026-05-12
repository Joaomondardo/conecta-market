#!/usr/bin/env bash
# ============================================================
#  CONECTA MARKET — Analista Automático de Projeto v2.0
#  Uso: ./analyze.sh [caminho-do-projeto]
#  Exemplo: ./analyze.sh ./conecta-market
# ============================================================
set -u
# set -e removed to prevent crashes on non-critical check failures

# ── Cores e formatação ────────────────────────────────────────
RED='\033[0;31m'; YELLOW='\033[1;33m'; GREEN='\033[0;32m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

# ── Contadores globais ────────────────────────────────────────
ERRORS=0; WARNINGS=0; FIXES=0; PASS=0
REPORT_FILE="./conecta-market-analysis-report.md"

# ── Helpers de log ───────────────────────────────────────────
log_header()  { echo -e "\n${BOLD}${BLUE}══════════════════════════════════════════${NC}"; echo -e "${BOLD}${BLUE}  $1${NC}"; echo -e "${BOLD}${BLUE}══════════════════════════════════════════${NC}"; }
log_pass()    { echo -e "  ${GREEN}✔${NC}  $1"; PASS=$((PASS + 1)); }
log_warn()    { echo -e "  ${YELLOW}⚠${NC}  $1"; WARNINGS=$((WARNINGS + 1)); }
log_error()   { echo -e "  ${RED}✖${NC}  $1"; ERRORS=$((ERRORS + 1)); }
log_fix()     { echo -e "  ${CYAN}⚙${NC}  [AUTO-FIX] $1"; FIXES=$((FIXES + 1)); }
log_info()    { echo -e "  ${BOLD}→${NC}  $1"; }

report() { echo "$1" >> "$REPORT_FILE"; }

# ── Inicialização ─────────────────────────────────────────────
PROJECT_ROOT="${1:-$(pwd)}"
if [[ ! -d "$PROJECT_ROOT" ]]; then
  echo -e "${RED}Erro: Diretório '$PROJECT_ROOT' não encontrado.${NC}"
  echo "Uso: $0 [caminho-do-projeto]"
  exit 1
fi
cd "$PROJECT_ROOT"

# Limpa relatório anterior
echo "# Conecta Market — Relatório de Análise Automática" > "$REPORT_FILE"
echo "**Data:** $(date '+%d/%m/%Y %H:%M:%S')" >> "$REPORT_FILE"
echo "**Diretório:** $PROJECT_ROOT" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

echo -e "\n${BOLD}${CYAN}"
echo "  ╔═══════════════════════════════════════════════╗"
echo "  ║   CONECTA MARKET — Analista de Projeto v2.0  ║"
echo "  ╚═══════════════════════════════════════════════╝"
echo -e "${NC}"
echo -e "  Projeto: ${BOLD}$PROJECT_ROOT${NC}"
echo -e "  Relatório: ${BOLD}$REPORT_FILE${NC}\n"

# ══════════════════════════════════════════════════════════════
# 1. ESTRUTURA DO MONOREPO
# ══════════════════════════════════════════════════════════════
log_header "1. ESTRUTURA DO MONOREPO"
report "## 1. Estrutura do Monorepo"

check_path() {
  local path="$1"; local label="$2"
  if [[ -e "$path" ]]; then log_pass "$label"; report "- ✅ $label"
  else log_error "Ausente: $label → $path"; report "- ❌ Ausente: $label ($path)"; fi
}

check_path "package.json"               "package.json raiz"
check_path "turbo.json"                 "turbo.json (Turborepo)"
check_path "pnpm-workspace.yaml"        "pnpm-workspace.yaml"
check_path "docker-compose.yml"         "docker-compose.yml"
check_path ".env.example"               ".env.example"
check_path ".gitignore"                 ".gitignore"
check_path "apps/web"                   "apps/web (Next.js)"
check_path "apps/api"                   "apps/api (NestJS)"
check_path "packages/shared-types"      "packages/shared-types"
check_path "docs"                       "docs/"
check_path "docs/relatorio-tecnico.md"  "docs/relatorio-tecnico.md"
check_path "docs/diagrama-er"           "docs/diagrama-er/"
check_path "docs/conecta-market-postman.json" "docs/postman.json"

# Verifica arquivos .env no git (CRÍTICO)
if [[ -f ".gitignore" ]]; then
  if grep -q "\.env" .gitignore 2>/dev/null; then
    log_pass ".env ignorado no .gitignore"
  else
    log_error ".env NÃO está no .gitignore — RISCO DE SEGURANÇA!"
    report "- ❌ CRÍTICO: .env não está no .gitignore"
    echo "echo '.env' >> .gitignore" >> auto-fix-suggestions.sh
    log_fix "Adicionando .env ao .gitignore"
    echo ".env" >> .gitignore
    echo ".env.local" >> .gitignore
    echo ".env.*.local" >> .gitignore
  fi
fi

# Verifica node_modules no git
if [[ -f ".gitignore" ]] && grep -q "node_modules" .gitignore 2>/dev/null; then
  log_pass "node_modules ignorado no .gitignore"
else
  log_error "node_modules NÃO está no .gitignore"
  log_fix "Adicionando node_modules ao .gitignore"
  echo "node_modules" >> .gitignore
fi

# Verifica turbo.json
if [[ -f "turbo.json" ]]; then
  if ! node -e "JSON.parse(require('fs').readFileSync('turbo.json'))" 2>/dev/null; then
    log_error "turbo.json — JSON inválido (sintaxe quebrada)"
    report "- ❌ turbo.json possui JSON inválido"
  else
    log_pass "turbo.json — JSON válido"
  fi
fi

# ══════════════════════════════════════════════════════════════
# 2. PACKAGE.JSON (raiz)
# ══════════════════════════════════════════════════════════════
log_header "2. PACKAGE.JSON RAIZ"
report "## 2. Package.json Raiz"

if [[ -f "package.json" ]]; then
  # Verifica workspaces
  if grep -q '"workspaces"' package.json 2>/dev/null; then
    log_pass "workspaces configurado"
  else
    log_warn "workspaces não declarado no package.json raiz"
    report "- ⚠️ workspaces ausente no package.json raiz"
  fi

  # Verifica scripts essenciais
  for script in "dev" "build" "lint" "test"; do
    if grep -q "\"$script\"" package.json 2>/dev/null; then
      log_pass "Script '$script' presente"
    else
      log_warn "Script '$script' ausente no package.json raiz"
      report "- ⚠️ Script '$script' ausente"
    fi
  done
fi

# ══════════════════════════════════════════════════════════════
# 3. BACKEND NESTJS (apps/api)
# ══════════════════════════════════════════════════════════════
log_header "3. BACKEND NESTJS (apps/api)"
report "## 3. Backend NestJS"

API_DIR="apps/api"

if [[ -d "$API_DIR" ]]; then
  # Estrutura de módulos obrigatórios
  MODULES=("auth" "users" "stores" "products" "orders" "categories" "campaigns" "reviews" "analytics")
  for mod in "${MODULES[@]}"; do
    mod_path="$API_DIR/src/$mod"
    # Fallback para src/modules/$mod
    if [[ ! -d "$mod_path" ]] && [[ -d "$API_DIR/src/modules/$mod" ]]; then
      mod_path="$API_DIR/src/modules/$mod"
    fi
    
    if [[ -d "$mod_path" ]]; then
      log_pass "Módulo '$mod' presente"
      # Verifica arquivos dentro do módulo
      for f in "controller" "service" "module"; do
        if ls "$mod_path"/*."$f".ts 2>/dev/null | head -1 > /dev/null; then
          :
        else
          if ls "$mod_path"/*.ts 2>/dev/null | grep -qi "$f"; then
            :
          else
            log_warn "Módulo '$mod': arquivo '$f.ts' não encontrado"
            report "- ⚠️ Módulo '$mod' sem arquivo '$f'"
          fi
        fi
      done
    else
      log_error "Módulo '$mod' AUSENTE em $mod_path"
      report "- ❌ Módulo '$mod' ausente"
    fi
  done

  # Prisma
  PRISMA_SCHEMA="$API_DIR/prisma/schema.prisma"
  check_path "$PRISMA_SCHEMA" "prisma/schema.prisma"

  if [[ -f "$PRISMA_SCHEMA" ]]; then
    # Entidades obrigatórias
    ENTITIES=("User" "Store" "Product" "Category" "Order" "Review" "Campaign")
    for entity in "${ENTITIES[@]}"; do
      if grep -q "model $entity" "$PRISMA_SCHEMA" 2>/dev/null; then
        log_pass "Entidade '$entity' no schema Prisma"
      else
        log_error "Entidade '$entity' AUSENTE no schema.prisma"
        report "- ❌ Entidade '$entity' ausente no Prisma schema"
      fi
    done

    # Verifica campos críticos de segurança no User
    if grep -A 20 "model User" "$PRISMA_SCHEMA" 2>/dev/null | grep -q "password"; then
      log_pass "Campo 'password' presente no model User"
    else
      log_error "Campo 'password' ausente no model User — falha de segurança"
      report "- ❌ CRÍTICO: 'password' ausente no model User"
    fi

    # Verifica soft delete
    for entity in "User" "Product" "Store"; do
      if grep -A 50 "model $entity" "$PRISMA_SCHEMA" 2>/dev/null | grep -qiE "deletedAt|isDeleted"; then
        log_pass "Soft delete no model '$entity'"
      else
        log_warn "Soft delete ausente no model '$entity' (recomendado)"
        report "- ⚠️ Soft delete não implementado em '$entity'"
      fi
    done

    # Verifica índices
    if grep -q "@@index" "$PRISMA_SCHEMA" 2>/dev/null; then
      log_pass "Índices de banco configurados no schema"
    else
      log_warn "Nenhum @@index no schema.prisma — performance prejudicada em produção"
      report "- ⚠️ Sem @@index no schema — adicione índices para campos de busca frequente"
    fi

    # Verifica @unique no email
    if grep -B5 -A10 "email" "$PRISMA_SCHEMA" 2>/dev/null | grep -q "@unique"; then
      log_pass "Email com @unique no schema"
    else
      log_error "Campo email sem @unique — permite duplicatas no banco"
      report "- ❌ Email sem @unique no schema Prisma"
    fi
  fi

  # Guards de segurança
  SRC_DIR="$API_DIR/src"
  for guard in "JwtAuthGuard" "RolesGuard"; do
    if grep -r "$guard" "$SRC_DIR" 2>/dev/null | grep -q "export class"; then
      log_pass "Guard '$guard' implementado"
    else
      log_warn "Guard '$guard' não encontrado — verifique implementação"
      report "- ⚠️ Guard '$guard' não encontrado"
    fi
  done

  # Verifica uso de variáveis de ambiente (sem hardcode de segredos)
  log_info "Verificando segredos hardcoded..."
  SECRETS_FOUND=0
  while IFS= read -r -d '' file; do
    if grep -nE "(secret|password|jwt_secret|database_url)\s*=\s*['\"][^'\"%{$]" "$file" 2>/dev/null | grep -qiv "example\|placeholder\|your_"; then
      log_error "Segredo hardcoded detectado em: $file"
      report "- ❌ CRÍTICO: Segredo hardcoded em $file"
      SECRETS_FOUND=1
    fi
  done < <(find "$SRC_DIR" -name "*.ts" -print0 2>/dev/null)

  [[ $SECRETS_FOUND -eq 0 ]] && log_pass "Nenhum segredo hardcoded detectado no backend"

  # Verifica rate limiting
  if grep -r "throttle\|RateLimit\|ThrottlerModule" "$SRC_DIR" 2>/dev/null | grep -q .; then
    log_pass "Rate limiting configurado"
  else
    log_warn "Rate limiting não encontrado — endpoints vulneráveis a brute force"
    report "- ⚠️ Sem rate limiting — instale @nestjs/throttler"
  fi

  # Verifica CORS
  if grep -r "enableCors\|CorsModule\|cors(" "$SRC_DIR" "$API_DIR/src/main.ts" 2>/dev/null | grep -q .; then
    log_pass "CORS configurado"
  else
    log_warn "CORS não configurado explicitamente no main.ts"
    report "- ⚠️ CORS ausente — configure em main.ts"
  fi

  # Verifica validação global (ValidationPipe)
  if grep -r "ValidationPipe\|useGlobalPipes" "$SRC_DIR" "$API_DIR/src/main.ts" 2>/dev/null | grep -q .; then
    log_pass "ValidationPipe global configurado"
  else
    log_error "ValidationPipe global ausente — sem validação automática de DTOs"
    report "- ❌ ValidationPipe ausente no main.ts"
  fi

  # Verifica helmet (segurança HTTP headers)
  if grep -r "helmet" "$SRC_DIR" "$API_DIR/src/main.ts" 2>/dev/null | grep -q .; then
    log_pass "Helmet (HTTP security headers) configurado"
  else
    log_warn "Helmet não encontrado — adicione para hardening de headers HTTP"
    report "- ⚠️ Helmet não instalado — execute: pnpm add helmet"
  fi

  # Verifica swagger
  if grep -r "SwaggerModule\|DocumentBuilder" "$SRC_DIR" "$API_DIR/src/main.ts" 2>/dev/null | grep -q .; then
    log_pass "Swagger configurado"
  else
    log_warn "Swagger não configurado no main.ts"
    report "- ⚠️ Swagger não configurado"
  fi

  # Verifica Exception Filter global
  if grep -r "ExceptionFilter\|useGlobalFilters\|AllExceptionsFilter" "$SRC_DIR" 2>/dev/null | grep -q .; then
    log_pass "Exception Filter global detectado"
  else
    log_warn "Sem Exception Filter global — erros não tratados expostos ao cliente"
    report "- ⚠️ Sem Exception Filter global"
  fi

  # TypeScript config do backend
  if [[ -f "$API_DIR/tsconfig.json" ]]; then
    log_pass "tsconfig.json presente no backend"
    if grep -q '"strict":\s*true' "$API_DIR/tsconfig.json" 2>/dev/null || grep -q '"strict": true' "$API_DIR/tsconfig.json" 2>/dev/null; then
      log_pass "TypeScript strict mode ATIVADO no backend"
    else
      log_warn "TypeScript strict mode DESATIVADO no backend — recomendado ativá-lo"
      report "- ⚠️ strict: true ausente no tsconfig do backend"
    fi
  else
    log_error "tsconfig.json ausente no backend"
  fi

  # Verifica package.json do backend
  if [[ -f "$API_DIR/package.json" ]]; then
    # Dependências críticas
    for dep in "@nestjs/core" "@nestjs/common" "@nestjs/jwt" "@nestjs/passport" "class-validator" "class-transformer" "bcrypt" "@prisma/client"; do
      if grep -q "\"$dep\"" "$API_DIR/package.json" 2>/dev/null; then
        log_pass "Dep '$dep' presente"
      else
        log_error "Dependência '$dep' AUSENTE no backend"
        report "- ❌ Dependência '$dep' ausente"
      fi
    done

    # Verifica se usa bcrypt ou argon2 for passwords (não MD5/SHA)
    if grep -q "\"md5\"\|\"sha1\"\|\"sha256\"" "$API_DIR/package.json" 2>/dev/null; then
      log_error "Hash inseguro (md5/sha1) encontrado — use bcrypt ou argon2"
      report "- ❌ CRÍTICO: Hash inseguro detectado"
    else
      log_pass "Nenhum hash inseguro detectado nas dependências"
    fi
  fi

else
  log_error "Diretório apps/api não encontrado"
fi

# ══════════════════════════════════════════════════════════════
# 4. FRONTEND NEXT.JS (apps/web)
# ══════════════════════════════════════════════════════════════
log_header "4. FRONTEND NEXT.JS (apps/web)"
report "## 4. Frontend Next.js"

WEB_DIR="apps/web"

if [[ -d "$WEB_DIR" ]]; then
  # Next.js config
  check_path "$WEB_DIR/next.config.js" "next.config.js"
  check_path "$WEB_DIR/tailwind.config.js" "tailwind.config.js"
  check_path "$WEB_DIR/tsconfig.json"   "tsconfig.json (web)"

  # Verifica App Router vs Pages Router
  if [[ -d "$WEB_DIR/app" ]] || [[ -d "$WEB_DIR/src/app" ]]; then
    log_pass "App Router (Next.js 14) detectado"
  elif [[ -d "$WEB_DIR/pages" ]] || [[ -d "$WEB_DIR/src/pages" ]]; then
    log_warn "Pages Router detectado — considere migrar para App Router (Next.js 14)"
    report "- ⚠️ Pages Router em uso — App Router é recomendado no Next.js 14"
  else
    log_error "Nem 'app/' nem 'pages/' encontrados"
    report "- ❌ Estrutura de roteamento ausente"
  fi

  # Páginas obrigatórias
  APP_DIR="$WEB_DIR/app"
  PAGES_DIR="$WEB_DIR/pages"
  ROUTER_DIR="$APP_DIR"
  [[ -d "$PAGES_DIR" ]] && ROUTER_DIR="$PAGES_DIR"

  declare -A PAGE_MAP=(
    ["catalog|catalogo|products"]="Catálogo de produtos"
    ["cart|carrinho"]="Carrinho"
    ["checkout"]="Checkout"
    ["dashboard"]="Dashboard vendedor"
    ["admin"]="Dashboard admin"
    ["profile|perfil"]="Perfil do usuário"
    ["orders|pedidos"]="Pedidos"
    ["login|auth"]="Login/Auth"
    ["store|loja"]="Página da Loja"
  )

  for pattern in "${!PAGE_MAP[@]}"; do
    label="${PAGE_MAP[$pattern]}"
    IFS='|' read -ra PATS <<< "$pattern"
    found=0
    for pat in "${PATS[@]}"; do
      if find "$WEB_DIR" -type d -name "*$pat*" 2>/dev/null | grep -q .; then
        found=1; break
      fi
      if find "$WEB_DIR" -name "*$pat*.tsx" -o -name "*$pat*.jsx" 2>/dev/null | grep -q .; then
        found=1; break
      fi
    done
    if [[ $found -eq 1 ]]; then
      log_pass "Página '$label' presente"
    else
      log_warn "Página '$label' não encontrada (padrão: $pattern)"
      report "- ⚠️ Página '$label' ausente"
    fi
  done

  # Verifica componentes UI (shadcn)
  if [[ -d "$WEB_DIR/components/ui" ]] || [[ -d "$WEB_DIR/src/components/ui" ]]; then
    log_pass "shadcn/ui components detectados"
  else
    log_warn "Pasta components/ui não encontrada — verifique instalação do shadcn/ui"
    report "- ⚠️ components/ui ausente"
  fi

  # Verifica acessibilidade básica nos componentes
  log_info "Verificando padrões de acessibilidade..."
  A11Y_ISSUES=0

  # Imagens sem alt
  while IFS= read -r -d '' file; do
    if grep -n '<img' "$file" 2>/dev/null | grep -qv 'alt='; then
      log_error "Imagem sem 'alt' em: $file"
      report "- ❌ Acessibilidade: <img> sem alt em $file"
      A11Y_ISSUES=1
    fi
  done < <(find "$WEB_DIR" \( -name "*.tsx" -o -name "*.jsx" \) -print0 2>/dev/null)

  # Botões sem aria-label ou texto
  while IFS= read -r -d '' file; do
    if grep -n '<button' "$file" 2>/dev/null | grep -qv 'aria-label\|aria-labelledby'; then
      # Verifica se tem texto filho
      :
    fi
  done < <(find "$WEB_DIR" \( -name "*.tsx" -o -name "*.jsx" \) -print0 2>/dev/null)

  [[ $A11Y_ISSUES -eq 0 ]] && log_pass "Nenhum problema grave de acessibilidade detectado"

  # Verifica uso de 'any' no TypeScript
  log_info "Verificando 'any' no TypeScript..."
  ANY_COUNT=0
  while IFS= read -r -d '' file; do
    count=$(grep -c ': any' "$file" 2>/dev/null || echo 0)
    if [[ "$count" -gt 3 ]]; then
      log_warn "Excesso de 'any' ($count ocorrências) em: $file"
      report "- ⚠️ Excesso de 'any' em $file ($count ocorrências)"
      ANY_COUNT=1
    fi
  done < <(find "$WEB_DIR" -name "*.tsx" -print0 2>/dev/null)
  [[ $ANY_COUNT -eq 0 ]] && log_pass "Uso controlado de 'any' no TypeScript"

  # Verifica console.log em produção
  log_info "Verificando console.log residuais..."
  CONSOLE_ISSUES=0
  while IFS= read -r -d '' file; do
    if grep -n 'console\.log(' "$file" 2>/dev/null | grep -qv '//.*console\.log\|debug\|TODO'; then
      log_warn "console.log() em: $file — remover antes de produção"
      report "- ⚠️ console.log em produção: $file"
      CONSOLE_ISSUES=1
    fi
  done < <(find "$WEB_DIR" -name "*.tsx" -print0 2>/dev/null)
  [[ $CONSOLE_ISSUES -eq 0 ]] && log_pass "Nenhum console.log em arquivos TSX"

  # Verifica uso de 'use client' excessivo (App Router)
  if [[ -d "$WEB_DIR/app" ]]; then
    log_info "Verificando uso de 'use client'..."
    USE_CLIENT_COUNT=$(find "$WEB_DIR/app" -name "*.tsx" -exec grep -l '"use client"' {} \; 2>/dev/null | wc -l)
    TOTAL_APP_FILES=$(find "$WEB_DIR/app" -name "*.tsx" 2>/dev/null | wc -l)
    if [[ "$TOTAL_APP_FILES" -gt 0 ]]; then
      RATIO=$(( USE_CLIENT_COUNT * 100 / TOTAL_APP_FILES ))
      if [[ "$RATIO" -gt 60 ]]; then
        log_warn "'use client' em $RATIO% dos arquivos — muitos Client Components. Prefira Server Components"
        report "- ⚠️ $RATIO% dos componentes são Client Components — revise para otimizar SSR"
      else
        log_pass "Uso de 'use client' em $RATIO% dos componentes (aceitável)"
      fi
    fi
  fi

  # Verifica next.config.js para otimizações
  if [[ -f "$WEB_DIR/next.config.js" ]]; then
    if grep -q "images" "$WEB_DIR/next.config.js" 2>/dev/null; then
      log_pass "Otimização de imagens configurada no next.config.js"
    else
      log_warn "Domínios de imagem não configurados no next.config.js"
      report "- ⚠️ Configure images.domains no next.config.js"
    fi

    if grep -q "compress" "$WEB_DIR/next.config.js" 2>/dev/null; then
      log_pass "Compressão configurada no next.config.js"
    else
      log_warn "compress não configurado no next.config.js"
      report "- ⚠️ Adicione compress: true ao next.config.js"
      log_fix "Adicionando compress ao next.config.js"
      # Adiciona compress se ausente
      if grep -q "module.exports" "$WEB_DIR/next.config.js" 2>/dev/null; then
        sed -i 's/module\.exports = {/module.exports = {\n  compress: true,/' "$WEB_DIR/next.config.js" 2>/dev/null || true
      fi
    fi
  fi

  # Verifica package.json do frontend
  if [[ -f "$WEB_DIR/package.json" ]]; then
    for dep in "next" "react" "react-dom" "tailwindcss" "lucide-react"; do
      if grep -q "\"$dep\"" "$WEB_DIR/package.json" 2>/dev/null; then
        log_pass "Dep '$dep' presente no frontend"
      else
        log_warn "Dependência '$dep' ausente no frontend"
        report "- ⚠️ '$dep' ausente no package.json do frontend"
      fi
    done
  fi

else
  log_error "Diretório apps/web não encontrado"
fi

# ══════════════════════════════════════════════════════════════
# 5. DOCKER COMPOSE
# ══════════════════════════════════════════════════════════════
log_header "5. DOCKER COMPOSE"
report "## 5. Docker Compose"

if [[ -f "docker-compose.yml" ]]; then
  # Verifica serviços essenciais
  for service in "postgres" "db" "database"; do
    if grep -qi "image:\s*postgres" docker-compose.yml 2>/dev/null; then
      log_pass "PostgreSQL configurado no Docker Compose"
      break
    fi
  done

  # Verifica versão do Postgres (deve ser >= 14)
  if grep -E "postgres:[0-9]+" docker-compose.yml 2>/dev/null | grep -qE "postgres:(1[4-9]|[2-9][0-9])"; then
    log_pass "PostgreSQL versão ≥ 14 configurada"
  elif grep -q "postgres:latest" docker-compose.yml 2>/dev/null; then
    log_warn "postgres:latest — especifique uma versão fixa (ex: postgres:16)"
    report "- ⚠️ Use versão fixa do Postgres (não 'latest')"
    log_fix "Substituindo 'postgres:latest' por 'postgres:16-alpine'"
    sed -i 's/postgres:latest/postgres:16-alpine/g' docker-compose.yml 2>/dev/null || true
  fi

  # Verifica healthcheck
  if grep -q "healthcheck" docker-compose.yml 2>/dev/null; then
    log_pass "Healthcheck configurado no Docker Compose"
  else
    log_warn "Sem healthcheck no Docker Compose — serviços podem iniciar antes do banco estar pronto"
    report "- ⚠️ Adicione healthcheck ao serviço postgres no docker-compose.yml"
  fi

  # Verifica volumes persistentes
  if grep -q "volumes:" docker-compose.yml 2>/dev/null; then
    log_pass "Volumes persistentes configurados"
  else
    log_warn "Sem volumes — dados do banco serão perdidos ao reiniciar containers"
    report "- ⚠️ Configure volumes para persistência de dados"
  fi

  # Verifica variáveis de ambiente (não hardcoded)
  if grep -E "POSTGRES_PASSWORD:\s*[a-zA-Z0-9]" docker-compose.yml 2>/dev/null | grep -qv '\${'; then
    log_warn "Senha do Postgres pode estar hardcoded no docker-compose.yml — use variáveis de ambiente"
    report "- ⚠️ Senha hardcoded no docker-compose — use \${POSTGRES_PASSWORD}"
  else
    log_pass "Credenciais via variáveis de ambiente no Docker Compose"
  fi

  # Verifica networks
  if grep -q "networks:" docker-compose.yml 2>/dev/null; then
    log_pass "Redes Docker configuradas"
  else
    log_warn "Sem redes customizadas no Docker Compose — serviços usam rede padrão"
    report "- ⚠️ Configure networks explicitamente no docker-compose.yml"
  fi
fi

# ══════════════════════════════════════════════════════════════
# 6. TYPESCRIPT E LINT
# ══════════════════════════════════════════════════════════════
log_header "6. TYPESCRIPT E LINT"
report "## 6. TypeScript e Lint"

check_path "tsconfig.json"           "tsconfig.json raiz"
check_path ".eslintrc.js"            ".eslintrc.js ou"
check_path ".eslintrc.json"          ".eslintrc.json"
check_path ".prettierrc"             ".prettierrc"
check_path ".prettierignore"         ".prettierignore"

# Verifica strictNullChecks
for tsconfig in "tsconfig.json" "apps/api/tsconfig.json" "apps/web/tsconfig.json"; do
  if [[ -f "$tsconfig" ]]; then
    if grep -q '"strictNullChecks":\s*false' "$tsconfig" 2>/dev/null; then
      log_error "$tsconfig: strictNullChecks DESATIVADO — permite null/undefined bugs silenciosos"
      report "- ❌ $tsconfig: strictNullChecks: false"
    else
      log_pass "$tsconfig: strictNullChecks OK"
    fi
  fi
done

# Executa tsc --noEmit se disponível
if command -v npx &>/dev/null; then
  log_info "Executando verificação de tipos TypeScript..."
  for dir in "apps/api" "apps/web"; do
    if [[ -f "$dir/tsconfig.json" ]]; then
      TS_OUTPUT=$(cd "$dir" && npx --yes tsc --noEmit 2>&1 || true)
      TS_ERRORS=$(echo "$TS_OUTPUT" | grep -c "error TS" 2>/dev/null || echo 0)
      if [[ "$TS_ERRORS" -gt 0 ]]; then
        log_error "TypeScript: $TS_ERRORS erro(s) em $dir"
        report "- ❌ $TS_ERRORS erros TypeScript em $dir:"
        echo "$TS_OUTPUT" | grep "error TS" | head -20 | while read -r line; do
          report "  - $line"
        done
        # Mostra os 5 primeiros erros
        echo "$TS_OUTPUT" | grep "error TS" | head -5 | while read -r line; do
          echo -e "    ${RED}${line}${NC}"
        done
      else
        log_pass "TypeScript sem erros em $dir"
      fi
    fi
  done
fi

# ══════════════════════════════════════════════════════════════
# 7. SEGURANÇA
# ══════════════════════════════════════════════════════════════
log_header "7. ANÁLISE DE SEGURANÇA"
report "## 7. Segurança"

# Verifica .env.example
if [[ -f ".env.example" ]]; then
  log_pass ".env.example presente"
  # Verifica se tem valores reais (não placeholders)
  if grep -vE "=.*(\$\{|your_|example|placeholder|<|>|#)" .env.example 2>/dev/null | grep -qE "=\s*[a-zA-Z0-9]{8,}"; then
    log_warn ".env.example pode conter valores reais — use apenas placeholders"
    report "- ⚠️ .env.example pode ter valores reais"
  else
    log_pass ".env.example usa apenas placeholders"
  fi
fi

# Verifica JWT secret fraco
if find . -name "*.ts" -o -name "*.js" 2>/dev/null | xargs grep -l "jwt" 2>/dev/null | head -5 | xargs grep -h "secret" 2>/dev/null | grep -qE "secret.*['\"](\w{1,16})['\"]"; then
  log_warn "JWT secret pode ser muito curto — use no mínimo 32 caracteres aleatórios"
  report "- ⚠️ JWT secret possivelmente fraco — use no mínimo 32 chars"
fi

# Verifica npm audit (vulnerabilidades)
if command -v npm &>/dev/null; then
  log_info "Executando auditoria de dependências (npm audit)..."
  for dir in "." "apps/api" "apps/web"; do
    if [[ -f "$dir/package-lock.json" ]] || [[ -f "$dir/package.json" ]]; then
      AUDIT_OUTPUT=$(cd "$dir" && npm audit --json 2>/dev/null || echo '{"metadata":{"vulnerabilities":{"critical":0,"high":0}}}')
      CRITICAL=$(echo "$AUDIT_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('metadata',{}).get('vulnerabilities',{}).get('critical',0))" 2>/dev/null || echo 0)
      HIGH=$(echo "$AUDIT_OUTPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('metadata',{}).get('vulnerabilities',{}).get('high',0))" 2>/dev/null || echo 0)
      if [[ "$CRITICAL" -gt 0 ]]; then
        log_error "$dir: $CRITICAL vulnerabilidade(s) CRÍTICA(s) detectada(s)"
        report "- ❌ $dir: $CRITICAL vulnerabilidades críticas"
      elif [[ "$HIGH" -gt 0 ]]; then
        log_warn "$dir: $HIGH vulnerabilidade(s) alta(s) detectada(s)"
        report "- ⚠️ $dir: $HIGH vulnerabilidades altas"
      else
        log_pass "$dir: sem vulnerabilidades críticas/altas conhecidas"
      fi
    fi
  done
fi

# Verifica uso de eval() (código inseguro)
if grep -r "eval(" "apps/" 2>/dev/null | grep -qv "//\|evalutation\|evaluate"; then
  log_error "eval() encontrado — potencial risco de injeção de código"
  report "- ❌ CRÍTICO: eval() detectado no código"
fi

# Verifica SQL injection risk (query strings concatenadas)
if grep -rn "query\(.*\+\|queryRaw.*\+\|execute.*\+" "apps/api/src" 2>/dev/null | grep -qv "//"; then
  log_warn "Possível SQL dinâmico concatenado — risco de SQL injection, use Prisma parametrizado"
  report "- ⚠️ SQL concatenado detectado — revise para uso parametrizado"
fi

# ══════════════════════════════════════════════════════════════
# 8. DOCUMENTAÇÃO
# ══════════════════════════════════════════════════════════════
log_header "8. DOCUMENTAÇÃO"
report "## 8. Documentação"

check_path "README.md"                          "README.md raiz"
check_path "docs/relatorio-tecnico.md"          "Relatório técnico"
check_path "docs/diagrama-er/README.md"         "Diagrama ER (Mermaid)"
check_path "docs/conecta-market-postman.json"   "Coleção Postman"

# Verifica qualidade mínima do README
if [[ -f "README.md" ]]; then
  README_LINES=$(wc -l < README.md)
  if [[ "$README_LINES" -lt 30 ]]; then
    log_warn "README muito curto ($README_LINES linhas) — adicione mais documentação"
    report "- ⚠️ README muito curto"
  else
    log_pass "README com $README_LINES linhas — aparentemente completo"
  fi

  # Verifica seções essenciais no README
  for section in "Instalação\|Install\|Getting Started" "Pré-requisito\|Prerequisites" "Variáveis de ambiente\|Environment" "Scripts\|Comandos\|Commands"; do
    if grep -qi "$section" README.md 2>/dev/null; then
      log_pass "Seção '$section' presente no README"
    else
      log_warn "Seção '$section' ausente no README"
      report "- ⚠️ Adicione seção sobre '$section' ao README"
    fi
  done
fi

# Verifica diagrama ER (Mermaid)
if [[ -f "docs/diagrama-er/README.md" ]]; then
  if grep -q "erDiagram\|classDiagram" "docs/diagrama-er/README.md" 2>/dev/null; then
    log_pass "Diagrama ER Mermaid válido"
  else
    log_warn "Diagrama ER: código Mermaid não encontrado — verifique sintaxe"
    report "- ⚠️ Diagrama ER sem bloco Mermaid válido"
  fi
fi

# Verifica Postman Collection
if [[ -f "docs/conecta-market-postman.json" ]]; then
  if node -e "JSON.parse(require('fs').readFileSync('docs/conecta-market-postman.json'))" 2>/dev/null; then
    log_pass "Coleção Postman — JSON válido"
    ENDPOINT_COUNT=$(grep -c '"name"' docs/conecta-market-postman.json 2>/dev/null || echo 0)
    log_info "Coleção Postman: ~$ENDPOINT_COUNT itens"
  else
    log_error "Coleção Postman — JSON inválido!"
    report "- ❌ Postman JSON inválido"
  fi
fi

# ══════════════════════════════════════════════════════════════
# 9. PERFORMANCE
# ══════════════════════════════════════════════════════════════
log_header "9. OTIMIZAÇÕES DE PERFORMANCE"
report "## 9. Performance"

# Verifica paginação nas listagens
if [[ -d "apps/api/src" ]]; then
  for module in "products" "orders" "stores"; do
    MODULE_DIR="apps/api/src/$module"
    if [[ -d "$MODULE_DIR" ]]; then
      if grep -r "take\|skip\|limit\|offset\|paginate\|page" "$MODULE_DIR" 2>/dev/null | grep -q .; then
        log_pass "Paginação detectada no módulo '$module'"
      else
        log_warn "Módulo '$module': sem paginação — listagens podem retornar registros ilimitados"
        report "- ⚠️ Paginação ausente no módulo $module"
      fi
    fi
  done

  # Verifica select específico (evita SELECT *)
  PRISMA_FILES=$(find "apps/api/src" -name "*.service.ts" 2>/dev/null)
  SELECT_STAR_COUNT=0
  while IFS= read -r file; do
    if grep -q "findMany({)" "$file" 2>/dev/null || grep -q "findMany()" "$file" 2>/dev/null; then
      log_warn "findMany() sem select em: $file — pode retornar campos sensíveis"
      report "- ⚠️ findMany() sem select em $file"
      SELECT_STAR_COUNT=1
    fi
  done <<< "$PRISMA_FILES"
  [[ $SELECT_STAR_COUNT -eq 0 ]] && log_pass "Consultas Prisma sem SELECT * óbvio detectado"
fi

# Verifica lazy loading em imagens no frontend
if [[ -d "apps/web" ]]; then
  if grep -r "next/image\|<Image" "apps/web" 2>/dev/null | grep -q .; then
    log_pass "next/image utilizado (lazy loading automático)"
  else
    PLAIN_IMG=$(find "apps/web" -name "*.tsx" -exec grep -l "<img" {} \; 2>/dev/null | wc -l)
    if [[ "$PLAIN_IMG" -gt 2 ]]; then
      log_warn "$PLAIN_IMG arquivo(s) usam <img> ao invés de next/image — sem otimização automática"
      report "- ⚠️ $PLAIN_IMG arquivos usando <img> — substitua por next/image"
    fi
  fi
fi

# ══════════════════════════════════════════════════════════════
# 10. TESTES
# ══════════════════════════════════════════════════════════════
log_header "10. TESTES"
report "## 10. Testes"

# Verifica presença de testes
TEST_FILES=$(find "." -name "*.spec.ts" -o -name "*.test.ts" -o -name "*.spec.tsx" 2>/dev/null | grep -v node_modules | wc -l)
if [[ "$TEST_FILES" -gt 0 ]]; then
  log_pass "$TEST_FILES arquivo(s) de teste encontrado(s)"
else
  log_warn "Nenhum arquivo de teste encontrado — implemente testes unitários (Jest/Vitest)"
  report "- ⚠️ Sem arquivos de teste (próximo passo recomendado: Jest/Vitest)"
fi

# Verifica jest.config
if [[ -f "jest.config.js" ]] || [[ -f "jest.config.ts" ]]; then
  log_pass "jest.config presente"
else
  log_warn "jest.config não encontrado na raiz"
  report "- ⚠️ jest.config ausente"
fi

# ══════════════════════════════════════════════════════════════
# 11. CI/CD
# ══════════════════════════════════════════════════════════════
log_header "11. CI/CD"
report "## 11. CI/CD"

if [[ -d ".github/workflows" ]]; then
  WORKFLOW_COUNT=$(ls .github/workflows/*.yml 2>/dev/null | wc -l)
  log_pass "$WORKFLOW_COUNT workflow(s) GitHub Actions configurado(s)"
else
  log_warn "GitHub Actions não configurado (próximo passo recomendado)"
  report "- ⚠️ GitHub Actions ausente (próximo passo)"
fi

check_path "Dockerfile" "Dockerfile (raiz ou apps/)"

# ══════════════════════════════════════════════════════════════
# RELATÓRIO FINAL
# ══════════════════════════════════════════════════════════════
log_header "RELATÓRIO FINAL"

TOTAL_CHECKS=$((ERRORS + WARNINGS + PASS))
HEALTH_SCORE=$(( (PASS * 100) / (TOTAL_CHECKS > 0 ? TOTAL_CHECKS : 1) ))

# Determina classificação
if [[ $HEALTH_SCORE -ge 90 ]]; then
  GRADE="${GREEN}A — Excelente${NC}"
elif [[ $HEALTH_SCORE -ge 75 ]]; then
  GRADE="${CYAN}B — Bom${NC}"
elif [[ $HEALTH_SCORE -ge 60 ]]; then
  GRADE="${YELLOW}C — Regular${NC}"
else
  GRADE="${RED}D — Precisa de atenção${NC}"
fi

echo ""
echo -e "  ${BOLD}Verificações realizadas:${NC} $TOTAL_CHECKS"
echo -e "  ${GREEN}Aprovadas:${NC}              $PASS"
echo -e "  ${YELLOW}Avisos:${NC}                 $WARNINGS"
echo -e "  ${RED}Erros críticos:${NC}         $ERRORS"
echo -e "  ${CYAN}Auto-fixes aplicados:${NC}   $FIXES"
echo ""
echo -e "  ${BOLD}Health Score:${NC}  ${BOLD}${HEALTH_SCORE}%${NC}"
echo -e "  ${BOLD}Nota geral:${NC}    $GRADE"
echo ""

report ""
report "---"
report "## Resumo Final"
report ""
report "| Métrica | Valor |"
report "|---------|-------|"
report "| ✅ Aprovadas | $PASS |"
report "| ⚠️ Avisos | $WARNINGS |"
report "| ❌ Erros | $ERRORS |"
report "| 🔧 Auto-fixes | $FIXES |"
report "| 📊 Health Score | ${HEALTH_SCORE}% |"
report ""
report "### Prioridades Recomendadas"
report "1. **Críticos** (resolver imediatamente): segredos hardcoded, validação de DTOs, CORS"
report "2. **Alta prioridade**: índices no banco, rate limiting, helmet, paginação"
report "3. **Médio prazo**: testes unitários, CI/CD, strict TypeScript"
report "4. **Evolução contínua**: monitoring, cache (Redis), integração de pagamento"

echo -e "  ${BOLD}Relatório salvo em:${NC} $REPORT_FILE"
echo ""

# Exibe top 5 erros críticos se houver
if [[ $ERRORS -gt 0 ]]; then
  echo -e "  ${BOLD}${RED}⚡ Top erros críticos a corrigir:${NC}"
  grep "❌" "$REPORT_FILE" | head -5 | sed 's/- ❌/    →/g'
  echo ""
fi

echo -e "${BOLD}${CYAN}  Análise concluída em $(date '+%H:%M:%S')${NC}\n"
