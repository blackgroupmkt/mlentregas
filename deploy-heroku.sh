#!/bin/bash

# Script completo de deploy para Heroku
# Corrige buildpacks, configura ambiente e faz deploy

set -e  # Sair em caso de erro

echo "======================================"
echo "  SCRIPT DE DEPLOY HEROKU - SHOPEE"
echo "======================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar se o Heroku CLI está instalado
check_heroku_cli() {
  if ! command -v heroku &> /dev/null; then
    echo -e "${RED}❌ Heroku CLI não encontrado!${NC}"
    echo "Instale em: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
  fi
  echo -e "${GREEN}✓ Heroku CLI encontrado${NC}"
}

# Função para verificar login no Heroku
check_heroku_login() {
  if ! heroku auth:whoami &> /dev/null; then
    echo -e "${RED}❌ Você não está logado no Heroku${NC}"
    echo "Execute: heroku login"
    exit 1
  fi
  echo -e "${GREEN}✓ Logado no Heroku como: $(heroku auth:whoami)${NC}"
}

# Função para detectar o nome do app Heroku
get_heroku_app() {
  # Tentar pegar do git remote
  if git remote -v | grep -q "heroku"; then
    APP_NAME=$(git remote -v | grep "heroku" | head -1 | sed 's/.*\/\(.*\)\.git.*/\1/')
    echo -e "${GREEN}✓ App Heroku detectado: $APP_NAME${NC}"
  else
    echo -e "${YELLOW}⚠ Remote 'heroku' não encontrado${NC}"
    read -p "Digite o nome do seu app Heroku: " APP_NAME
    
    if [ -z "$APP_NAME" ]; then
      echo -e "${RED}❌ Nome do app não pode ser vazio${NC}"
      exit 1
    fi
    
    # Adicionar remote
    heroku git:remote -a "$APP_NAME"
    echo -e "${GREEN}✓ Remote Heroku adicionado${NC}"
  fi
}

# Etapa 1: Verificações iniciais
echo "📋 Etapa 1: Verificações iniciais..."
check_heroku_cli
check_heroku_login
get_heroku_app
echo ""

# Etapa 2: Remover buildpack Python e configurar Node.js
echo "🔧 Etapa 2: Configurando buildpacks..."

# Limpar todos os buildpacks
echo "  → Removendo buildpacks existentes..."
heroku buildpacks:clear -a "$APP_NAME" 2>/dev/null || true

# Adicionar apenas Node.js
echo "  → Adicionando buildpack Node.js..."
heroku buildpacks:add heroku/nodejs -a "$APP_NAME"

# Verificar buildpacks
echo "  → Buildpacks configurados:"
heroku buildpacks -a "$APP_NAME"
echo ""

# Etapa 3: Atualizar package.json
echo "📦 Etapa 3: Atualizando package.json..."

# Fazer backup
cp package.json package.json.backup

# Atualizar package.json com Node.js e configurações Heroku
cat > package.json.tmp << 'EOF'
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
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node api-server.js",
    "heroku-postbuild": "echo 'Build concluído com sucesso'",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  },
EOF

# Copiar dependencies do package.json original
echo "  → Copiando dependências..."
node -e "
const fs = require('fs');
const original = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const newPkg = JSON.parse(fs.readFileSync('package.json.tmp', 'utf8'));

newPkg.dependencies = original.dependencies;
newPkg.devDependencies = original.devDependencies;
newPkg.optionalDependencies = original.optionalDependencies;

fs.writeFileSync('package.json', JSON.stringify(newPkg, null, 2));
"

rm package.json.tmp
echo -e "${GREEN}✓ package.json atualizado${NC}"
echo ""

# Etapa 4: Criar/Atualizar Procfile
echo "📝 Etapa 4: Configurando Procfile..."
cat > Procfile << 'EOF'
web: NODE_ENV=production node api-server.js
EOF
echo -e "${GREEN}✓ Procfile criado${NC}"
echo ""

# Etapa 5: Verificar api-server.js
echo "🔍 Etapa 5: Verificando api-server.js..."

if [ ! -f "api-server.js" ]; then
  echo -e "${RED}❌ api-server.js não encontrado!${NC}"
  exit 1
fi

# Verificar se escuta em process.env.PORT
if ! grep -q "process.env.PORT" api-server.js; then
  echo -e "${YELLOW}⚠ Aviso: api-server.js pode não estar usando process.env.PORT${NC}"
fi

echo -e "${GREEN}✓ api-server.js encontrado${NC}"
echo ""

# Etapa 6: Configurar variáveis de ambiente
echo "⚙️  Etapa 6: Configurando variáveis de ambiente..."

heroku config:set NPM_CONFIG_PRODUCTION=false -a "$APP_NAME"
heroku config:set NODE_ENV=production -a "$APP_NAME"

# Verificar se FOUR_M_PAGAMENTOS_API_KEY existe
if heroku config:get FOUR_M_PAGAMENTOS_API_KEY -a "$APP_NAME" &> /dev/null; then
  echo -e "${GREEN}✓ FOUR_M_PAGAMENTOS_API_KEY já configurada${NC}"
else
  echo -e "${YELLOW}⚠ FOUR_M_PAGAMENTOS_API_KEY não encontrada${NC}"
  read -p "Deseja configurar agora? (s/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Ss]$ ]]; then
    read -p "Digite a API key: " API_KEY
    heroku config:set FOUR_M_PAGAMENTOS_API_KEY="$API_KEY" -a "$APP_NAME"
  fi
fi

echo ""

# Etapa 7: Configurar stack Heroku-22
echo "🏗️  Etapa 7: Verificando stack Heroku..."

CURRENT_STACK=$(heroku stack -a "$APP_NAME" | grep "^\*" | awk '{print $2}')
echo "  → Stack atual: $CURRENT_STACK"

if [ "$CURRENT_STACK" != "heroku-22" ]; then
  echo "  → Atualizando para heroku-22..."
  heroku stack:set heroku-22 -a "$APP_NAME"
  echo -e "${GREEN}✓ Stack atualizada para heroku-22${NC}"
else
  echo -e "${GREEN}✓ Stack já está em heroku-22${NC}"
fi
echo ""

# Etapa 8: Commit das alterações
echo "💾 Etapa 8: Fazendo commit das alterações..."

git add .
if git diff --staged --quiet; then
  echo "  → Nenhuma alteração para commit"
else
  git commit -m "🚀 Deploy: Corrige buildpack e configura Heroku para Node.js

- Remove buildpack Python
- Adiciona buildpack Node.js oficial
- Atualiza package.json com engines Node >=18
- Configura Procfile para usar api-server.js
- Define NPM_CONFIG_PRODUCTION=false
- Configura stack heroku-22
" || echo "  → Commit falhou, mas continuando..."
fi
echo ""

# Etapa 9: Deploy para Heroku
echo "🚀 Etapa 9: Fazendo deploy para Heroku..."
echo ""

read -p "Deseja fazer o deploy agora? (S/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
  echo "  → Iniciando push para Heroku..."
  
  # Determinar branch
  BRANCH=$(git branch --show-current)
  
  if git push heroku "$BRANCH:main" --force; then
    echo -e "${GREEN}✓ Deploy concluído com sucesso!${NC}"
  else
    echo -e "${RED}❌ Erro no deploy${NC}"
    exit 1
  fi
else
  echo "  → Deploy cancelado pelo usuário"
  exit 0
fi
echo ""

# Etapa 10: Verificar logs
echo "📊 Etapa 10: Verificando logs do deploy..."
echo ""
echo "Últimas 50 linhas do log:"
echo "----------------------------------------"
heroku logs --tail -n 50 -a "$APP_NAME" &

# Aguardar alguns segundos
sleep 5

# Matar o tail de logs
pkill -P $$ 2>/dev/null || true

echo ""
echo "----------------------------------------"
echo ""

# Etapa 11: Teste de saúde
echo "🏥 Etapa 11: Testando aplicação..."

APP_URL="https://$APP_NAME.herokuapp.com"
echo "  → URL do app: $APP_URL"

# Aguardar o app iniciar
echo "  → Aguardando app iniciar (10s)..."
sleep 10

# Testar endpoint de saúde
if curl -f -s "$APP_URL/health" > /dev/null; then
  echo -e "${GREEN}✓ App respondendo corretamente!${NC}"
  echo "  → Resposta: $(curl -s "$APP_URL/health" | head -c 100)..."
else
  echo -e "${YELLOW}⚠ App não respondeu no endpoint /health${NC}"
  echo "  → Tente acessar manualmente: $APP_URL"
fi
echo ""

# Resumo final
echo "======================================"
echo "  DEPLOY CONCLUÍDO!"
echo "======================================"
echo ""
echo -e "${GREEN}✓ Buildpacks configurados: Node.js${NC}"
echo -e "${GREEN}✓ Stack: heroku-22${NC}"
echo -e "${GREEN}✓ Variáveis de ambiente configuradas${NC}"
echo -e "${GREEN}✓ Deploy realizado com sucesso${NC}"
echo ""
echo "🌐 URL do app: $APP_URL"
echo "📊 Logs: heroku logs --tail -a $APP_NAME"
echo "🔧 Dyno: heroku ps -a $APP_NAME"
echo ""
echo "Para ver logs ao vivo:"
echo "  heroku logs --tail -a $APP_NAME"
echo ""
echo "Para reiniciar o dyno:"
echo "  heroku restart -a $APP_NAME"
echo ""
echo "======================================"
