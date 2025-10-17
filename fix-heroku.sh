#!/bin/bash

# Script de correção completa para deploy no Heroku
# Resolve o erro H10 (App crashed)

set -e

APP_NAME="mlnova-0fd22bb288f2"

echo "🔧 Corrigindo configuração para Heroku..."
echo ""

# 1. Atualizar package.json com Node.js e script correto
echo "📦 1. Atualizando package.json..."

node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Adicionar engines
pkg.engines = {
  node: '>=18.0.0',
  npm: '>=9.0.0'
};

// Atualizar scripts
pkg.scripts = pkg.scripts || {};
pkg.scripts.start = 'node api-server.js';
pkg.scripts['heroku-postbuild'] = 'echo \"Heroku build complete\"';

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✓ package.json atualizado');
"

# 2. Garantir que Procfile está correto
echo ""
echo "📝 2. Atualizando Procfile..."
cat > Procfile << 'EOF'
web: node api-server.js
EOF
echo "✓ Procfile atualizado"

# 3. Limpar buildpacks e configurar Node.js
echo ""
echo "🏗️  3. Configurando buildpacks Heroku..."
heroku buildpacks:clear -a "$APP_NAME" 2>/dev/null || true
heroku buildpacks:add heroku/nodejs -a "$APP_NAME"
echo "✓ Buildpacks configurados"

# 4. Configurar stack
echo ""
echo "🔧 4. Configurando stack..."
heroku stack:set heroku-22 -a "$APP_NAME" 2>/dev/null || echo "Stack já configurado"
echo "✓ Stack configurado"

# 5. Configurar variáveis de ambiente
echo ""
echo "⚙️  5. Configurando variáveis de ambiente..."
heroku config:set NPM_CONFIG_PRODUCTION=false -a "$APP_NAME"
heroku config:set NODE_ENV=production -a "$APP_NAME"
echo "✓ Variáveis configuradas"

# 6. Verificar api-server.js
echo ""
echo "🔍 6. Verificando api-server.js..."
if [ -f "api-server.js" ]; then
  echo "✓ api-server.js encontrado"
else
  echo "❌ ERRO: api-server.js não encontrado!"
  exit 1
fi

# 7. Commit das alterações
echo ""
echo "💾 7. Salvando alterações..."
git add package.json Procfile
git diff --staged --quiet || git commit -m "Fix: Corrige configuração Heroku para api-server.js

- Atualiza script start para node api-server.js
- Adiciona engines com Node.js >=18
- Configura Procfile correto
- Remove NODE_ENV do Procfile (já está nas variáveis)"

# 8. Deploy
echo ""
echo "🚀 8. Fazendo deploy para Heroku..."
echo ""

BRANCH=$(git branch --show-current)
git push heroku "$BRANCH:main" --force

# 9. Aguardar e verificar
echo ""
echo "⏳ 9. Aguardando app iniciar..."
sleep 10

# 10. Verificar logs
echo ""
echo "📊 10. Verificando logs..."
heroku logs -n 30 -a "$APP_NAME"

echo ""
echo "======================================"
echo "  CORREÇÃO CONCLUÍDA!"
echo "======================================"
echo ""
echo "🌐 URL: https://$APP_NAME.herokuapp.com"
echo "📊 Logs: heroku logs --tail -a $APP_NAME"
echo ""

# Teste final
echo "🏥 Testando aplicação..."
sleep 5

if curl -f -s "https://$APP_NAME.herokuapp.com/health" > /dev/null 2>&1; then
  echo "✅ App respondendo corretamente!"
  curl -s "https://$APP_NAME.herokuapp.com/health" | head -c 200
  echo ""
else
  echo "⚠️  App ainda não respondeu. Verifique os logs:"
  echo "   heroku logs --tail -a $APP_NAME"
fi

echo ""
echo "======================================"
