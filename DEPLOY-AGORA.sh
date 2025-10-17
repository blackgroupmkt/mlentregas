#!/bin/bash

# SCRIPT RÁPIDO DE DEPLOY - EXECUTE AGORA!
# Corrige tudo e faz deploy automaticamente

set -e

echo "╔════════════════════════════════════════╗"
echo "║   CORREÇÃO RÁPIDA HEROKU - SHOPEE     ║"
echo "╚════════════════════════════════════════╝"
echo ""

APP_NAME="mlnova-0fd22bb288f2"

# 1. Aplicar correções locais
echo "🔧 1/5 - Aplicando correções locais..."
./apply-heroku-fix.sh

echo ""
echo "✅ Correções aplicadas!"
echo ""

# 2. Verificar se tem Heroku CLI
if command -v heroku &> /dev/null; then
  echo "🎯 2/5 - Heroku CLI detectado! Configurando buildpacks..."
  
  # Limpar e configurar buildpacks
  heroku buildpacks:clear -a "$APP_NAME" 2>/dev/null || true
  heroku buildpacks:add heroku/nodejs -a "$APP_NAME"
  
  # Configurar variáveis
  heroku config:set NPM_CONFIG_PRODUCTION=false -a "$APP_NAME"
  heroku config:set NODE_ENV=production -a "$APP_NAME"
  
  echo "✅ Buildpacks e variáveis configurados!"
  echo ""
  
  echo "🚀 3/5 - Fazendo deploy..."
  BRANCH=$(git branch --show-current)
  git push heroku "$BRANCH:main" --force
  
  echo ""
  echo "⏳ 4/5 - Aguardando app iniciar..."
  sleep 10
  
  echo ""
  echo "📊 5/5 - Verificando logs..."
  heroku logs -n 20 -a "$APP_NAME"
  
  echo ""
  echo "╔════════════════════════════════════════╗"
  echo "║          DEPLOY CONCLUÍDO!            ║"
  echo "╚════════════════════════════════════════╝"
  echo ""
  
  # Testar
  echo "🏥 Testando app..."
  sleep 3
  
  if curl -f -s "https://$APP_NAME.herokuapp.com/health" > /dev/null 2>&1; then
    echo "✅ APP FUNCIONANDO!"
    echo ""
    curl -s "https://$APP_NAME.herokuapp.com/health" | head -c 200
    echo ""
  else
    echo "⚠️  App ainda não respondeu."
    echo "Execute: heroku logs --tail -a $APP_NAME"
  fi
  
else
  echo "⚠️  2/5 - Heroku CLI não encontrado."
  echo ""
  echo "╔════════════════════════════════════════╗"
  echo "║    CONFIGURE MANUALMENTE NO HEROKU    ║"
  echo "╚════════════════════════════════════════╝"
  echo ""
  echo "📋 Próximos passos:"
  echo ""
  echo "1. Acesse: https://dashboard.heroku.com/apps/$APP_NAME/settings"
  echo ""
  echo "2. Em 'Buildpacks':"
  echo "   - REMOVA todos buildpacks"
  echo "   - ADICIONE: heroku/nodejs"
  echo ""
  echo "3. Em 'Config Vars':"
  echo "   - NODE_ENV = production"
  echo "   - NPM_CONFIG_PRODUCTION = false"
  echo ""
  echo "4. Vá em 'Deploy' e clique 'Deploy Branch'"
  echo ""
  echo "5. Veja os logs em 'More' > 'View logs'"
  echo ""
fi

echo ""
echo "╔════════════════════════════════════════╗"
echo "║              LINKS ÚTEIS              ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "🌐 App:      https://$APP_NAME.herokuapp.com"
echo "🏥 Health:   https://$APP_NAME.herokuapp.com/health"
echo "📊 Dashboard: https://dashboard.heroku.com/apps/$APP_NAME"
echo ""
