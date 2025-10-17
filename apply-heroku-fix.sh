#!/bin/bash

# Script para aplicar correção do Heroku LOCALMENTE
# Execute este script antes de fazer push para o Heroku

set -e

echo "🔧 Aplicando correções para Heroku..."
echo ""

# 1. Backup do package.json original
echo "📦 1. Fazendo backup do package.json..."
cp package.json package.json.replit.backup
echo "✓ Backup criado: package.json.replit.backup"

# 2. Criar package.json para Heroku
echo ""
echo "📝 2. Criando package.json otimizado para Heroku..."

cat > package.json << 'EOF'
{
  "name": "shopee-delivery-partners",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "scripts": {
    "start": "node start-heroku.js",
    "heroku-postbuild": "echo 'Heroku build complete'"
  },
  "dependencies": {
    "express": "^4.21.2",
    "cors": "^2.8.5",
    "compression": "^1.8.0",
    "axios": "^1.8.4"
  }
}
EOF

echo "✓ package.json atualizado para Heroku"

# 3. Verificar arquivos necessários
echo ""
echo "🔍 3. Verificando arquivos necessários..."

if [ ! -f "start-heroku.js" ]; then
  echo "❌ ERRO: start-heroku.js não encontrado!"
  exit 1
fi
echo "✓ start-heroku.js encontrado"

if [ ! -f "Procfile" ]; then
  echo "❌ ERRO: Procfile não encontrado!"
  exit 1
fi
echo "✓ Procfile encontrado"

# 4. Verificar conteúdo do Procfile
echo ""
echo "📋 4. Verificando Procfile..."
PROCFILE_CONTENT=$(cat Procfile)
if [[ "$PROCFILE_CONTENT" == *"start-heroku.js"* ]]; then
  echo "✓ Procfile correto: $PROCFILE_CONTENT"
else
  echo "⚠️  Atualizando Procfile..."
  echo "web: node start-heroku.js" > Procfile
  echo "✓ Procfile atualizado"
fi

# 5. Preparar .gitignore para Heroku
echo ""
echo "📂 5. Configurando .gitignore..."

# Garantir que arquivos importantes NÃO sejam ignorados
if [ -f ".gitignore" ]; then
  # Remover start-heroku.js do gitignore se estiver lá
  sed -i '/start-heroku\.js/d' .gitignore 2>/dev/null || true
  sed -i '/Procfile/d' .gitignore 2>/dev/null || true
  echo "✓ .gitignore atualizado"
else
  echo "⚠️  .gitignore não encontrado (não é problema)"
fi

# 6. Commit das mudanças
echo ""
echo "💾 6. Salvando mudanças no Git..."

git add package.json Procfile start-heroku.js

if git diff --staged --quiet; then
  echo "⚠️  Nenhuma mudança para commitar"
else
  git commit -m "Fix: Configura Heroku com start-heroku.js simplificado

- Substitui package.json por versão Heroku-otimizada
- Atualiza Procfile para usar start-heroku.js
- Adiciona servidor simplificado garantido para funcionar
- Configura engines com Node.js >=18

Resolve erro H10 (App crashed)" || echo "⚠️  Commit falhou, mas continuando..."
fi

echo ""
echo "======================================"
echo "  ✅ CORREÇÕES APLICADAS!"
echo "======================================"
echo ""
echo "Arquivos atualizados:"
echo "  ✓ package.json (backup em package.json.replit.backup)"
echo "  ✓ Procfile"
echo "  ✓ start-heroku.js"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Configure buildpacks no Heroku Dashboard:"
echo "   https://dashboard.heroku.com/apps/mlnova-0fd22bb288f2/settings"
echo "   - Remova Python"
echo "   - Adicione apenas: heroku/nodejs"
echo ""
echo "2. Configure variáveis de ambiente:"
echo "   - NODE_ENV=production"
echo "   - NPM_CONFIG_PRODUCTION=false"
echo ""
echo "3. Faça o deploy:"
echo "   git push heroku main --force"
echo ""
echo "4. Verifique os logs:"
echo "   heroku logs --tail -a mlnova-0fd22bb288f2"
echo ""
echo "======================================"
echo ""
echo "Para reverter ao package.json original:"
echo "  mv package.json.replit.backup package.json"
echo ""
