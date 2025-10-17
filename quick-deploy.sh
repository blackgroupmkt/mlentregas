#!/bin/bash

# Script rápido de deploy - Apenas o essencial
# Para usuários que já conhecem o processo

set -e

APP_NAME="${1:-mlnova-0fd22bb288f2}"

echo "🚀 Deploy Rápido para Heroku: $APP_NAME"
echo ""

# 1. Configurar buildpacks
echo "1️⃣ Configurando buildpacks..."
heroku buildpacks:clear -a "$APP_NAME"
heroku buildpacks:add heroku/nodejs -a "$APP_NAME"

# 2. Configurar stack
echo "2️⃣ Configurando stack..."
heroku stack:set heroku-22 -a "$APP_NAME"

# 3. Configurar variáveis
echo "3️⃣ Configurando variáveis..."
heroku config:set NPM_CONFIG_PRODUCTION=false -a "$APP_NAME"
heroku config:set NODE_ENV=production -a "$APP_NAME"

# 4. Commit e deploy
echo "4️⃣ Fazendo deploy..."
git add .
git commit -m "Fix Heroku buildpack" -m "- Remove Python buildpack" -m "- Add Node.js buildpack" -m "- Configure heroku-22 stack" || true
git push heroku $(git branch --show-current):main --force

echo ""
echo "✅ Deploy concluído!"
echo "📊 Logs: heroku logs --tail -a $APP_NAME"
echo "🌐 URL: https://$APP_NAME.herokuapp.com"
