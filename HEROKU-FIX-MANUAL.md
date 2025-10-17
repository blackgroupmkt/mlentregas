# 🔧 Correção Manual do Deploy Heroku

## ❌ Problema Atual

**Erro H10:** App crashed
- O app não está iniciando no Heroku
- Buildpack ou configuração incorreta

## ✅ Solução Passo a Passo

### Opção A: Script Automático (Recomendado)

Se você tem Heroku CLI instalado:

```bash
./fix-heroku.sh
```

### Opção B: Correção Manual via Dashboard Heroku

#### 1. Atualizar package.json

No seu `package.json`, faça estas mudanças:

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "scripts": {
    "start": "node start-heroku.js",
    "heroku-postbuild": "echo 'Build complete'"
  }
}
```

#### 2. Atualizar Procfile

Crie/edite o arquivo `Procfile` na raiz com:

```
web: node start-heroku.js
```

#### 3. Configurar Buildpacks no Heroku Dashboard

1. Acesse https://dashboard.heroku.com/apps/mlnova-0fd22bb288f2/settings
2. Em "Buildpacks", clique em "Add buildpack"
3. **REMOVA** qualquer buildpack Python
4. **ADICIONE** apenas: `heroku/nodejs`
5. Salve as alterações

#### 4. Configurar Variáveis de Ambiente

No Dashboard do Heroku:
1. Vá em "Settings" > "Config Vars"
2. Adicione/atualize:
   - `NODE_ENV` = `production`
   - `NPM_CONFIG_PRODUCTION` = `false`
   - `FOUR_M_PAGAMENTOS_API_KEY` = `[sua-chave]`

#### 5. Fazer Deploy

**Via Git:**
```bash
git add .
git commit -m "Fix: Corrige deploy Heroku com start-heroku.js"
git push heroku main
```

**Via Heroku Dashboard:**
1. Vá em "Deploy"
2. Conecte com GitHub (se ainda não conectou)
3. Escolha o branch `main`
4. Clique em "Deploy Branch"

#### 6. Verificar Logs

```bash
heroku logs --tail -a mlnova-0fd22bb288f2
```

Ou no Dashboard: "More" > "View logs"

### Opção C: Deploy via Heroku CLI (Linha de Comando)

```bash
# 1. Limpar buildpacks
heroku buildpacks:clear -a mlnova-0fd22bb288f2

# 2. Adicionar Node.js
heroku buildpacks:add heroku/nodejs -a mlnova-0fd22bb288f2

# 3. Configurar stack
heroku stack:set heroku-22 -a mlnova-0fd22bb288f2

# 4. Configurar variáveis
heroku config:set NPM_CONFIG_PRODUCTION=false -a mlnova-0fd22bb288f2
heroku config:set NODE_ENV=production -a mlnova-0fd22bb288f2

# 5. Deploy
git push heroku main --force

# 6. Ver logs
heroku logs --tail -a mlnova-0fd22bb288f2
```

## 📋 Arquivos Criados

Estes arquivos já foram criados e estão prontos:

1. ✅ `start-heroku.js` - Servidor simplificado garantido para funcionar
2. ✅ `fix-heroku.sh` - Script de correção automática
3. ✅ `Procfile` - Configuração de processo Heroku

## 🔍 Verificação

Após o deploy, teste:

```bash
# Endpoint raiz
curl https://mlnova-0fd22bb288f2.herokuapp.com/

# Health check
curl https://mlnova-0fd22bb288f2.herokuapp.com/health

# Regions API
curl https://mlnova-0fd22bb288f2.herokuapp.com/api/regions
```

**Resposta esperada do /health:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-17T...",
  "environment": "production",
  "port": 5000
}
```

## 🐛 Se Ainda Não Funcionar

### 1. Verificar Buildpacks
```bash
heroku buildpacks -a mlnova-0fd22bb288f2
```

**Deve mostrar APENAS:**
```
=== mlnova-0fd22bb288f2 Buildpack URL
heroku/nodejs
```

### 2. Verificar Logs em Detalhe
```bash
heroku logs -n 100 -a mlnova-0fd22bb288f2 | grep -i error
```

### 3. Reiniciar App
```bash
heroku restart -a mlnova-0fd22bb288f2
```

### 4. Verificar Dynos
```bash
heroku ps -a mlnova-0fd22bb288f2
```

**Deve mostrar:**
```
=== web (Free): node start-heroku.js
web.1: up [data/hora]
```

### 5. Último Recurso: Reset Completo

```bash
# Limpar tudo
heroku repo:purge_cache -a mlnova-0fd22bb288f2

# Rebuild completo
git commit --allow-empty -m "Force rebuild"
git push heroku main --force
```

## 📝 Checklist Final

- [ ] Buildpack é `heroku/nodejs` (NÃO Python)
- [ ] Stack é `heroku-22`
- [ ] Arquivo `start-heroku.js` existe
- [ ] Procfile aponta para `node start-heroku.js`
- [ ] package.json tem `engines` com Node >=18
- [ ] package.json tem script `start`: `node start-heroku.js`
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy feito com sucesso
- [ ] Logs não mostram erros
- [ ] App responde em /health

## 🆘 Comandos Úteis

```bash
# Status completo
heroku ps -a mlnova-0fd22bb288f2
heroku config -a mlnova-0fd22bb288f2
heroku buildpacks -a mlnova-0fd22bb288f2

# Logs
heroku logs --tail -a mlnova-0fd22bb288f2
heroku logs -n 200 -a mlnova-0fd22bb288f2 > logs.txt

# Controle
heroku restart -a mlnova-0fd22bb288f2
heroku ps:scale web=1 -a mlnova-0fd22bb288f2

# Informações
heroku info -a mlnova-0fd22bb288f2
heroku releases -a mlnova-0fd22bb288f2

# Rollback (se necessário)
heroku rollback -a mlnova-0fd22bb288f2
```

## 🎯 Próximos Passos

Após corrigir o deploy:

1. ✅ Verifique que https://mlnova-0fd22bb288f2.herokuapp.com/health responde
2. ✅ Teste os endpoints da API
3. ✅ Configure domínio customizado (se necessário)
4. ✅ Monitore os logs por algumas horas
