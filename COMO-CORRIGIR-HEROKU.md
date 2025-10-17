# 🚀 Como Corrigir o Deploy no Heroku

## ❌ Problema

Seu app está crashando no Heroku com erro **H10 (App crashed)**.

## ✅ Solução em 3 Passos

### Passo 1: Aplicar Correções Localmente

Execute este comando:

```bash
./apply-heroku-fix.sh
```

**O que este script faz:**
- ✅ Cria backup do package.json original
- ✅ Substitui por versão otimizada para Heroku
- ✅ Atualiza Procfile para usar servidor simplificado
- ✅ Faz commit das mudanças

### Passo 2: Configurar Heroku Dashboard

Acesse: https://dashboard.heroku.com/apps/mlnova-0fd22bb288f2/settings

**A. Buildpacks:**
1. Role até "Buildpacks"
2. **REMOVA** todos os buildpacks existentes (especialmente Python)
3. Clique em "Add buildpack"
4. Adicione: `heroku/nodejs`
5. Salve

**B. Config Vars (Variáveis de Ambiente):**
1. Role até "Config Vars"
2. Clique em "Reveal Config Vars"
3. Adicione/atualize:
   - `NODE_ENV` = `production`
   - `NPM_CONFIG_PRODUCTION` = `false`
   - `FOUR_M_PAGAMENTOS_API_KEY` = `[sua-chave-aqui]`

### Passo 3: Deploy

**Opção A - Via Heroku Dashboard (Mais Fácil):**

1. Vá em "Deploy" tab
2. Em "Deployment method", escolha GitHub
3. Conecte ao seu repositório
4. Em "Manual deploy", clique em "Deploy Branch"

**Opção B - Via Git (Linha de Comando):**

```bash
git push heroku main --force
```

Se não tiver o remote Heroku:
```bash
heroku git:remote -a mlnova-0fd22bb288f2
git push heroku main --force
```

## 📊 Verificação

Após o deploy, teste:

```bash
# Health check
curl https://mlnova-0fd22bb288f2.herokuapp.com/health

# Resposta esperada:
# {"status":"ok","timestamp":"...","environment":"production"}
```

Ou abra no navegador: https://mlnova-0fd22bb288f2.herokuapp.com/health

## 🔍 Ver Logs

**Via Dashboard:**
1. Vá em "More" > "View logs"

**Via CLI:**
```bash
heroku logs --tail -a mlnova-0fd22bb288f2
```

## 📋 Checklist de Verificação

Marque cada item:

- [ ] Script `apply-heroku-fix.sh` executado
- [ ] package.json atualizado (backup criado)
- [ ] Procfile atualizado para `web: node start-heroku.js`
- [ ] Buildpack no Heroku é APENAS `heroku/nodejs` (não Python)
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] URL `/health` responde com status "ok"

## 🐛 Se Não Funcionar

### 1. Verificar Buildpacks

No terminal:
```bash
heroku buildpacks -a mlnova-0fd22bb288f2
```

Deve mostrar APENAS:
```
=== mlnova-0fd22bb288f2 Buildpack URL
heroku/nodejs
```

Se mostrar Python ou outros, limpe:
```bash
heroku buildpacks:clear -a mlnova-0fd22bb288f2
heroku buildpacks:add heroku/nodejs -a mlnova-0fd22bb288f2
```

### 2. Reiniciar App

```bash
heroku restart -a mlnova-0fd22bb288f2
```

### 3. Ver Erros Específicos

```bash
heroku logs -n 100 -a mlnova-0fd22bb288f2 | grep -i error
```

### 4. Limpar Cache (Último Recurso)

```bash
heroku plugins:install heroku-repo
heroku repo:purge_cache -a mlnova-0fd22bb288f2
git commit --allow-empty -m "Force rebuild"
git push heroku main --force
```

## 📝 Arquivos Criados

Todos prontos para uso:

| Arquivo | Descrição |
|---------|-----------|
| `start-heroku.js` | ✅ Servidor simplificado garantido para funcionar |
| `apply-heroku-fix.sh` | ✅ Script que aplica todas as correções |
| `package.json.heroku` | ✅ Versão otimizada do package.json |
| `Procfile` | ✅ Atualizado para usar start-heroku.js |
| `HEROKU-FIX-MANUAL.md` | 📖 Guia detalhado completo |

## 🎯 Resumo

```bash
# 1. Aplicar correções localmente
./apply-heroku-fix.sh

# 2. Configurar Heroku Dashboard
# - Buildpacks: apenas heroku/nodejs
# - Config Vars: NODE_ENV, NPM_CONFIG_PRODUCTION, API_KEY

# 3. Deploy
git push heroku main --force

# 4. Verificar
curl https://mlnova-0fd22bb288f2.herokuapp.com/health
```

## 🆘 Precisa de Ajuda?

Consulte o guia detalhado:
- `HEROKU-FIX-MANUAL.md` - Instruções completas passo a passo
- `COMANDOS-HEROKU.md` - Referência de todos os comandos

## ✅ Sucesso!

Quando funcionar, você verá:

```json
{
  "status": "ok",
  "timestamp": "2025-10-17T...",
  "environment": "production",
  "port": 5000,
  "uptime": 42.5
}
```

E seu app estará disponível em: https://mlnova-0fd22bb288f2.herokuapp.com
