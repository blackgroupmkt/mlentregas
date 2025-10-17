#!/bin/bash

# Script de build para Heroku
# Constrói o frontend antes de iniciar o servidor

echo "🔨 Iniciando build do frontend..."

# Verificar se tem vite
if command -v vite &> /dev/null; then
  echo "✓ Vite encontrado, construindo frontend..."
  npm run build || vite build
else
  echo "⚠️  Vite não encontrado, tentando com npm..."
  npm run build || echo "Build não disponível"
fi

# Verificar se o build foi criado
if [ -d "dist/public" ] || [ -d "dist" ]; then
  echo "✅ Build concluído com sucesso!"
  ls -la dist/ || ls -la dist/public/
else
  echo "⚠️  Pasta dist não encontrada, mas continuando..."
fi

echo "✅ Pronto para iniciar o servidor"
