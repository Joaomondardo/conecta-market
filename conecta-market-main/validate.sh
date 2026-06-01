#!/usr/bin/env bash

# Script de validação completa do monorepo Conecta Market

FAILED=0
TOTAL_STEPS=5
PASSED_STEPS=0

REPORT_FILE="validate-report.txt"
echo "=== RELATÓRIO DE VALIDAÇÃO COMPLETA ===" > "$REPORT_FILE"
echo "Data: $(date)" >> "$REPORT_FILE"
echo "---------------------------------------" >> "$REPORT_FILE"

log_result() {
  local step=$1
  local status=$2
  local msg=$3
  if [ "$status" = "SUCCESS" ]; then
    echo -e "\e[32m✅ PASSOU: $step\e[0m"
    echo "✅ PASSOU: $step - $msg" >> "$REPORT_FILE"
    ((PASSED_STEPS++))
  else
    echo -e "\e[31m❌ FALHOU: $step\e[0m"
    echo "❌ FALHOU: $step - $msg" >> "$REPORT_FILE"
    FAILED=1
  fi
}

# 1. Validação TypeScript
echo "Executando Etapa 1: Validação TypeScript..."
API_TS=$(pnpm --filter @conecta/api exec tsc --noEmit 2>&1)
API_TS_STATUS=$?
WEB_TS=$(pnpm --filter @conecta/web exec tsc --noEmit 2>&1)
WEB_TS_STATUS=$?

if [ $API_TS_STATUS -eq 0 ] && [ $WEB_TS_STATUS -eq 0 ]; then
  log_result "TypeScript" "SUCCESS" "API e Web compilando sem erros"
else
  ERR_MSG=""
  if [ $API_TS_STATUS -ne 0 ]; then
    ERR_MSG="$ERR_MSG\n[API TS Errors]:\n$API_TS"
  fi
  if [ $WEB_TS_STATUS -ne 0 ]; then
    ERR_MSG="$ERR_MSG\n[Web TS Errors]:\n$WEB_TS"
  fi
  log_result "TypeScript" "FAILURE" "Erros de compilação TS encontrados:$ERR_MSG"
fi

# 2. Validação Linter ESLint
echo "Executando Etapa 2: Validação Linter ESLint..."
API_LINT=$(pnpm --filter @conecta/api lint 2>&1)
API_LINT_STATUS=$?
WEB_LINT=$(pnpm --filter @conecta/web lint 2>&1)
WEB_LINT_STATUS=$?

if [ $API_LINT_STATUS -eq 0 ] && [ $WEB_LINT_STATUS -eq 0 ]; then
  log_result "Linter ESLint" "SUCCESS" "Sem erros de linter"
else
  ERR_MSG=""
  if [ $API_LINT_STATUS -ne 0 ]; then
    ERR_MSG="$ERR_MSG\n[API Lint Errors]:\n$API_LINT"
  fi
  if [ $WEB_LINT_STATUS -ne 0 ]; then
    ERR_MSG="$ERR_MSG\n[Web Lint Errors]:\n$WEB_LINT"
  fi
  log_result "Linter ESLint" "FAILURE" "Erros de linter encontrados:$ERR_MSG"
fi

# 3. Turborepo Build
echo "Executando Etapa 3: Build Completo Turborepo..."
BUILD_OUT=$(pnpm turbo run build 2>&1)
BUILD_STATUS=$?

if [ $BUILD_STATUS -eq 0 ]; then
  log_result "Build" "SUCCESS" "Build completo executado com sucesso"
else
  log_result "Build" "FAILURE" "Falha no build do Turborepo. Output:\n$BUILD_OUT"
fi

# 4. Testes
echo "Executando Etapa 4: Testes..."
TEST_OUT=$(pnpm turbo run test -- --passWithNoTests 2>&1)
TEST_STATUS=$?

if [ $TEST_STATUS -eq 0 ]; then
  log_result "Testes" "SUCCESS" "Testes executados com sucesso (ou sem testes cadastrados)"
else
  log_result "Testes" "FAILURE" "Falha na suíte de testes. Output:\n$TEST_OUT"
fi

# 5. Validação de rotas/links quebrados no frontend
echo "Executando Etapa 5: Validação de Links do Frontend..."
LINK_VAL_OUT=$(node -e '
const fs = require("fs");
const path = require("path");

const appDir = path.join("apps", "web", "src", "app");
const validRoutes = [];

function scanRoutes(dir, currentRoute = "") {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      let segment = file;
      if (segment.startsWith("(") && segment.endsWith(")")) {
        scanRoutes(fullPath, currentRoute);
      } else {
        scanRoutes(fullPath, currentRoute + "/" + segment);
      }
    } else if (file === "page.tsx" || file === "page.ts" || file === "page.js") {
      validRoutes.push(currentRoute === "" ? "/" : currentRoute);
    }
  }
}

scanRoutes(appDir);

const routeRegexes = validRoutes.map(r => {
  let pattern = "^" + r.replace(/\[\.\.\.[^\]]+\]/g, ".*").replace(/\[[^\]]+\]/g, "[^/]+") + "$";
  return { route: r, regex: new RegExp(pattern) };
});

const srcDir = path.join("apps", "web", "src");
const brokenLinks = [];

function scanFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanFiles(fullPath);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      const matches = content.matchAll(/href="([^"]+)"/g);
      for (const match of matches) {
        const link = match[1];
        if (link.startsWith("/")) {
          const cleanLink = link.split("?")[0].split("#")[0];
          let matched = false;
          for (const item of routeRegexes) {
            if (item.regex.test(cleanLink)) {
              matched = true;
              break;
            }
          }
          if (!matched) {
            brokenLinks.push({ file: fullPath, link: link });
          }
        }
      }
    }
  }
}

scanFiles(srcDir);

if (brokenLinks.length > 0) {
  console.log("BROKEN_LINKS_FOUND");
  brokenLinks.forEach(b => console.log(`Arquivo: ${b.file} -> Link quebrado: ${b.link}`));
  process.exit(1);
} else {
  console.log("ALL_LINKS_VALID");
  process.exit(0);
}
' 2>&1)
LINK_VAL_STATUS=$?

if [ $LINK_VAL_STATUS -eq 0 ]; then
  log_result "Links Frontend" "SUCCESS" "Todos os links apontam para rotas válidas"
else
  log_result "Links Frontend" "FAILURE" "Links quebrados ou inválidos detectados:\n$LINK_VAL_OUT"
fi

# Consolidar resultados no terminal e no relatório
echo ""
echo "=== RESUMO CONSOLIDADO ==="
echo "Etapas bem-sucedidas: $PASSED_STEPS / $TOTAL_STEPS"
if [ $FAILED -eq 0 ]; then
  echo -e "\e[32m✅ STATUS GERAL: APROVADO\e[0m"
else
  echo -e "\e[31m❌ STATUS GERAL: REPROVADO\e[0m"
fi

echo "" >> "$REPORT_FILE"
echo "=== RESUMO CONSOLIDADO ===" >> "$REPORT_FILE"
echo "Etapas bem-sucedidas: $PASSED_STEPS / $TOTAL_STEPS" >> "$REPORT_FILE"
if [ $FAILED -eq 0 ]; then
  echo "STATUS GERAL: APROVADO" >> "$REPORT_FILE"
else
  echo "STATUS GERAL: REPROVADO" >> "$REPORT_FILE"
fi

exit $FAILED
