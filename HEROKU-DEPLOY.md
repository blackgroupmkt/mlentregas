# 🚀 Guia de Deploy no Heroku

Este guia detalha como corrigir e fazer deploy da aplicação Shopee Delivery Partners no Heroku.

## 🔧 Problema Identificado

**Erro atual:**
```
/bin/bash: line 1: node: command not found
```

**Causa:** O Heroku está usando o buildpack Python em vez do Node.js.

## ✅ Solução Automática

Execute o script de deploy automático:

```bash
./deploy-heroku.sh
```

Este script fará automaticamente:

### 1. ✓ Verificações Iniciais
- Verifica se Heroku CLI está instalado
- Confirma login no Heroku
- Detecta nome do app Heroku

### 2. ✓ Configura Buildpacks
- Remove buildpack Python
- Adiciona buildpack Node.js oficial
- Configura para Heroku-22 stack

### 3. ✓ Atualiza package.json
- Define `engines.node: ">=18.0.0"`
- Configura scripts Heroku-compatíveis
- Mantém todas as dependências

### 4. ✓ Cria/Atualiza Procfile
```
web: NODE_ENV=production node api-server.js
```

### 5. ✓ Configura Variáveis de Ambiente
- `NPM_CONFIG_PRODUCTION=false`
- `NODE_ENV=production`
- Solicita `FOUR_M_PAGAMENTOS_API_KEY` se não configurada

### 6. ✓ Deploy
- Faz commit das alterações
- Push para Heroku
- Verifica logs
- Testa saúde da aplicação

## 📋 Pré-requisitos

1. **Heroku CLI instalado:**
   ```bash
   # Verificar se está instalado
   heroku --version
   
   # Se não estiver, instalar:
   # macOS: brew tap heroku/brew && brew install heroku
   # Ubuntu: curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
   # Windows: Baixar de https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login no Heroku:**
   ```bash
   heroku login
   ```

3. **Git configurado:**
   ```bash
   git remote -v  # Deve mostrar remote 'heroku'
   ```

## 🎯 Execução Passo a Passo

### Opção 1: Executar Script Completo (Recomendado)

```bash
# Tornar executável (se necessário)
chmod +x deploy-heroku.sh

# Executar
./deploy-heroku.sh
```

### Opção 2: Executar Manualmente

```bash
# 1. Configurar buildpacks
heroku buildpacks:clear -a SEU_APP
heroku buildpacks:add heroku/nodejs -a SEU_APP

# 2. Configurar stack
heroku stack:set heroku-22 -a SEU_APP

# 3. Configurar variáveis
heroku config:set NPM_CONFIG_PRODUCTION=false -a SEU_APP
heroku config:set NODE_ENV=production -a SEU_APP
heroku config:set FOUR_M_PAGAMENTOS_API_KEY=SUA_API_KEY -a SEU_APP

# 4. Fazer deploy
git add .
git commit -m "Corrige buildpack Heroku"
git push heroku main --force

# 5. Ver logs
heroku logs --tail -a SEU_APP
```

## 🔍 Verificação

### 1. Verificar Buildpacks
```bash
heroku buildpacks -a SEU_APP
```

**Saída esperada:**
```
=== SEU_APP Buildpack URL
heroku/nodejs
```

### 2. Verificar Stack
```bash
heroku stack -a SEU_APP
```

**Saída esperada:**
```
* heroku-22
```

### 3. Verificar Variáveis
```bash
heroku config -a SEU_APP
```

**Deve incluir:**
- `NODE_ENV: production`
- `NPM_CONFIG_PRODUCTION: false`
- `FOUR_M_PAGAMENTOS_API_KEY: [sua-chave]`

### 4. Testar Aplicação
```bash
# Verificar se está rodando
heroku ps -a SEU_APP

# Abrir no navegador
heroku open -a SEU_APP

# Testar endpoint de saúde
curl https://SEU_APP.herokuapp.com/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-17T...",
  "env": "production",
  "port": 5000
}
```

## 🐛 Troubleshooting

### Erro: "node: command not found"
**Solução:** Execute o script de deploy completo para configurar buildpacks corretamente.

### Erro: "Application error" (H10)
**Causa:** App não está escutando em `process.env.PORT`

**Verificar:**
```bash
# Ver logs
heroku logs --tail -a SEU_APP

# Reiniciar
heroku restart -a SEU_APP
```

### Erro: "npm ERR! missing script: start"
**Solução:** Verificar se `package.json` tem script `start`:
```json
{
  "scripts": {
    "start": "NODE_ENV=production node api-server.js"
  }
}
```

### Build falha com erros de dependências
**Solução:** Garantir que `NPM_CONFIG_PRODUCTION=false`:
```bash
heroku config:set NPM_CONFIG_PRODUCTION=false -a SEU_APP
```

## 📊 Comandos Úteis

```bash
# Ver logs em tempo real
heroku logs --tail -a SEU_APP

# Status dos dynos
heroku ps -a SEU_APP

# Reiniciar aplicação
heroku restart -a SEU_APP

# Executar comando no dyno
heroku run bash -a SEU_APP

# Ver configurações
heroku config -a SEU_APP

# Escalar dynos
heroku ps:scale web=1 -a SEU_APP

# Abrir dashboard
heroku dashboard -a SEU_APP
```

## 🎉 Deploy Bem-Sucedido

Quando o deploy for concluído com sucesso, você verá:

```
✓ Buildpacks configurados: Node.js
✓ Stack: heroku-22
✓ Variáveis de ambiente configuradas
✓ Deploy realizado com sucesso

🌐 URL do app: https://SEU_APP.herokuapp.com
```

A aplicação estará disponível em:
- **Frontend/API:** `https://SEU_APP.herokuapp.com`
- **Health Check:** `https://SEU_APP.herokuapp.com/health`
- **Regions API:** `https://SEU_APP.herokuapp.com/api/regions`

## 📝 Notas Importantes

1. **api-server.js** é o arquivo principal que roda no Heroku
2. Ele já está configurado para escutar em `process.env.PORT`
3. O servidor usa **ES Modules** (`type: "module"` no package.json)
4. CORS está configurado para aceitar requisições do frontend Netlify

## 🔗 Links Úteis

- [Heroku Node.js Buildpack](https://devcenter.heroku.com/articles/nodejs-support)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- [Heroku Logs](https://devcenter.heroku.com/articles/logging)
- [Heroku Stack](https://devcenter.heroku.com/articles/stack)
