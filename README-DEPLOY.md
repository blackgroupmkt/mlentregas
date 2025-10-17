# 🚀 Deploy Automático no Heroku - Shopee Delivery Partners

## ⚡ Início Rápido

Execute este comando para deploy automático completo:

```bash
./deploy-heroku.sh
```

Ou para deploy rápido (se você já conhece o processo):

```bash
./quick-deploy.sh mlnova-0fd22bb288f2
```

## 📋 O Que Foi Criado

### Scripts de Deploy

| Script | Descrição | Uso |
|--------|-----------|-----|
| `deploy-heroku.sh` | ✨ Deploy completo automático | `./deploy-heroku.sh` |
| `quick-deploy.sh` | ⚡ Deploy rápido | `./quick-deploy.sh SEU_APP` |
| `heroku-check.sh` | 🔍 Verificação de status | `./heroku-check.sh SEU_APP` |

### Documentação

| Arquivo | Descrição |
|---------|-----------|
| `HEROKU-DEPLOY.md` | 📖 Guia completo de deploy |
| `COMANDOS-HEROKU.md` | 📚 Referência rápida de comandos |
| `README-DEPLOY.md` | 📝 Este arquivo (índice) |

## 🎯 Como Usar

### 1. Deploy Completo (Recomendado para primeira vez)

```bash
# Torna executável (primeira vez)
chmod +x deploy-heroku.sh

# Executa deploy completo
./deploy-heroku.sh
```

**O que este script faz:**
- ✅ Verifica pré-requisitos (Heroku CLI, login)
- ✅ Remove buildpack Python
- ✅ Adiciona buildpack Node.js
- ✅ Atualiza package.json com engines
- ✅ Cria Procfile correto
- ✅ Configura variáveis de ambiente
- ✅ Configura stack heroku-22
- ✅ Faz commit e push
- ✅ Verifica logs
- ✅ Testa aplicação

### 2. Deploy Rápido (Para deploys subsequentes)

```bash
./quick-deploy.sh mlnova-0fd22bb288f2
```

### 3. Verificar Status

```bash
./heroku-check.sh mlnova-0fd22bb288f2
```

## 🔧 Problema Resolvido

**Erro Original:**
```
/bin/bash: line 1: node: command not found
Error: H10 (App crashed)
```

**Causa:** Heroku estava usando buildpack Python em vez de Node.js

**Solução Aplicada:**
1. ✅ Removido buildpack Python
2. ✅ Adicionado buildpack Node.js oficial
3. ✅ Configurado stack heroku-22
4. ✅ Ajustado package.json com engines Node >=18
5. ✅ Configurado variáveis de ambiente corretas
6. ✅ Procfile aponta para api-server.js

## 📊 Estrutura de Deploy

```
┌─────────────────────────────────────┐
│  package.json                       │
│  - engines.node: ">=18.0.0"         │
│  - scripts.start: "node api-server" │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Procfile                           │
│  web: NODE_ENV=production node ...  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Heroku Buildpack: Node.js          │
│  Stack: heroku-22                   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  api-server.js                      │
│  - Escuta em process.env.PORT       │
│  - Serve API e frontend             │
└─────────────────────────────────────┘
```

## ✅ Checklist de Verificação

Após executar o deploy, verifique:

- [ ] Buildpack é `heroku/nodejs` (não Python)
- [ ] Stack é `heroku-22`
- [ ] `NODE_ENV=production` está configurado
- [ ] `NPM_CONFIG_PRODUCTION=false` está configurado
- [ ] `FOUR_M_PAGAMENTOS_API_KEY` está configurado
- [ ] App responde em `/health`
- [ ] Logs não mostram erros

Execute para verificar:
```bash
./heroku-check.sh mlnova-0fd22bb288f2
```

## 🐛 Troubleshooting

### Erro persiste após deploy?

```bash
# 1. Limpar cache de build
heroku plugins:install heroku-repo
heroku repo:purge_cache -a mlnova-0fd22bb288f2

# 2. Forçar rebuild
git commit --allow-empty -m "Force rebuild"
git push heroku main --force

# 3. Verificar logs
heroku logs --tail -a mlnova-0fd22bb288f2
```

### App não inicia?

```bash
# Verificar se está escutando em PORT correto
heroku config -a mlnova-0fd22bb288f2 | grep PORT

# Reiniciar dynos
heroku restart -a mlnova-0fd22bb288f2

# Escalar dynos
heroku ps:scale web=1 -a mlnova-0fd22bb288f2
```

### Precisa de ajuda?

Consulte a documentação completa:
- `HEROKU-DEPLOY.md` - Guia passo a passo
- `COMANDOS-HEROKU.md` - Todos os comandos disponíveis

## 📝 Comandos Mais Usados

```bash
# Ver logs em tempo real
heroku logs --tail -a mlnova-0fd22bb288f2

# Status do app
heroku ps -a mlnova-0fd22bb288f2

# Reiniciar
heroku restart -a mlnova-0fd22bb288f2

# Abrir no navegador
heroku open -a mlnova-0fd22bb288f2

# Ver configurações
heroku config -a mlnova-0fd22bb288f2
```

## 🌐 URLs Importantes

Após deploy bem-sucedido:

- **App:** https://mlnova-0fd22bb288f2.herokuapp.com
- **Health:** https://mlnova-0fd22bb288f2.herokuapp.com/health
- **API Regions:** https://mlnova-0fd22bb288f2.herokuapp.com/api/regions

## 🎉 Sucesso!

Se tudo funcionou, você verá:

```
✓ Buildpacks configurados: Node.js
✓ Stack: heroku-22
✓ Variáveis de ambiente configuradas
✓ Deploy realizado com sucesso

🌐 URL do app: https://mlnova-0fd22bb288f2.herokuapp.com
```

## 📞 Suporte

- [Documentação Heroku](https://devcenter.heroku.com/)
- [Heroku Status](https://status.heroku.com/)
- [CLI Reference](https://devcenter.heroku.com/articles/heroku-cli-commands)
