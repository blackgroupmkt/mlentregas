#!/bin/bash

# Script de verificação do Heroku
# Mostra status completo da aplicação

APP_NAME="${1:-mlnova-0fd22bb288f2}"

echo "======================================"
echo "  STATUS DO APP HEROKU: $APP_NAME"
echo "======================================"
echo ""

# 1. Buildpacks
echo "📦 BUILDPACKS:"
heroku buildpacks -a "$APP_NAME" 2>/dev/null || echo "  ❌ Erro ao obter buildpacks"
echo ""

# 2. Stack
echo "🏗️  STACK:"
heroku stack -a "$APP_NAME" 2>/dev/null || echo "  ❌ Erro ao obter stack"
echo ""

# 3. Dynos
echo "⚙️  DYNOS:"
heroku ps -a "$APP_NAME" 2>/dev/null || echo "  ❌ Erro ao obter dynos"
echo ""

# 4. Variáveis de ambiente
echo "🔐 VARIÁVEIS DE AMBIENTE:"
heroku config -a "$APP_NAME" 2>/dev/null | grep -E "(NODE_ENV|NPM_CONFIG|FOUR_M)" || echo "  ⚠️ Variáveis importantes não encontradas"
echo ""

# 5. Últimos logs
echo "📊 ÚLTIMOS LOGS (20 linhas):"
heroku logs -n 20 -a "$APP_NAME" 2>/dev/null || echo "  ❌ Erro ao obter logs"
echo ""

# 6. Teste de saúde
echo "🏥 TESTE DE SAÚDE:"
APP_URL="https://$APP_NAME.herokuapp.com"
echo "  URL: $APP_URL"

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL/health" 2>/dev/null)

if [ "$RESPONSE" = "200" ]; then
  echo "  ✅ Status: OK (HTTP $RESPONSE)"
  curl -s "$APP_URL/health" | head -c 200
  echo ""
else
  echo "  ❌ Status: ERRO (HTTP $RESPONSE)"
fi
echo ""

echo "======================================"
echo ""

# Resumo
if [ "$RESPONSE" = "200" ]; then
  echo "✅ App está funcionando corretamente!"
else
  echo "❌ App com problemas. Execute:"
  echo "   heroku logs --tail -a $APP_NAME"
fi
