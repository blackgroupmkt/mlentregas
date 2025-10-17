# 📚 Comandos Heroku - Referência Rápida

## 🚀 Deploy Inicial

```bash
# Configurar buildpack Node.js
heroku buildpacks:clear -a SEU_APP
heroku buildpacks:add heroku/nodejs -a SEU_APP

# Configurar stack
heroku stack:set heroku-22 -a SEU_APP

# Configurar variáveis essenciais
heroku config:set NPM_CONFIG_PRODUCTION=false -a SEU_APP
heroku config:set NODE_ENV=production -a SEU_APP
heroku config:set FOUR_M_PAGAMENTOS_API_KEY=SUA_CHAVE -a SEU_APP

# Deploy
git push heroku main --force
```

## 🔧 Configuração

```bash
# Ver todas configurações
heroku config -a SEU_APP

# Adicionar variável
heroku config:set CHAVE=valor -a SEU_APP

# Remover variável
heroku config:unset CHAVE -a SEU_APP

# Ver buildpacks
heroku buildpacks -a SEU_APP

# Ver stack
heroku stack -a SEU_APP
```

## 📊 Monitoramento

```bash
# Logs em tempo real
heroku logs --tail -a SEU_APP

# Últimas 100 linhas
heroku logs -n 100 -a SEU_APP

# Filtrar por erro
heroku logs --tail -a SEU_APP | grep -i error

# Status dos dynos
heroku ps -a SEU_APP
```

## 🔄 Controle de Dynos

```bash
# Reiniciar app
heroku restart -a SEU_APP

# Parar app
heroku ps:scale web=0 -a SEU_APP

# Iniciar app
heroku ps:scale web=1 -a SEU_APP

# Ver informações do dyno
heroku ps:type -a SEU_APP
```

## 🐛 Debug

```bash
# Executar bash no dyno
heroku run bash -a SEU_APP

# Executar comando específico
heroku run node -v -a SEU_APP
heroku run npm list -a SEU_APP

# Ver releases
heroku releases -a SEU_APP

# Rollback para release anterior
heroku rollback -a SEU_APP
```

## 🌐 Acesso

```bash
# Abrir app no navegador
heroku open -a SEU_APP

# Dashboard web
heroku dashboard -a SEU_APP

# Ver informações do app
heroku info -a SEU_APP
```

## 🔗 Git

```bash
# Adicionar remote Heroku
heroku git:remote -a SEU_APP

# Ver remotes
git remote -v

# Push específico de branch
git push heroku main
git push heroku develop:main
```

## 🗄️ Base de Dados

```bash
# Se usar Postgres
heroku pg:info -a SEU_APP
heroku pg:psql -a SEU_APP

# Fazer backup
heroku pg:backups:capture -a SEU_APP
heroku pg:backups:download -a SEU_APP
```

## 📦 Dependências

```bash
# Ver pacotes instalados
heroku run npm list -a SEU_APP

# Limpar cache de build
heroku plugins:install heroku-repo
heroku repo:purge_cache -a SEU_APP
```

## 🔍 Troubleshooting Específico

### Erro H10 (App Crashed)
```bash
# Ver por que crashou
heroku logs --tail -a SEU_APP

# Reiniciar
heroku restart -a SEU_APP

# Verificar se porta está correta
heroku run bash -a SEU_APP
# Dentro do bash: echo $PORT
```

### Build Falha
```bash
# Ver log de build
heroku builds -a SEU_APP
heroku builds:info BUILD_ID -a SEU_APP

# Limpar cache e rebuildar
heroku repo:purge_cache -a SEU_APP
git commit --allow-empty -m "Rebuild"
git push heroku main
```

### Node Version Errada
```bash
# Ver versão atual
heroku run node -v -a SEU_APP

# Especificar no package.json:
{
  "engines": {
    "node": "18.x"
  }
}
```

## ⚡ Scripts Prontos

### Script de Deploy Completo
```bash
./deploy-heroku.sh
```

### Deploy Rápido
```bash
./quick-deploy.sh SEU_APP
```

### Verificação de Status
```bash
./heroku-check.sh SEU_APP
```

## 🆘 Comandos de Emergência

```bash
# App totalmente travado
heroku restart -a SEU_APP
heroku ps:scale web=0 -a SEU_APP
heroku ps:scale web=1 -a SEU_APP

# Reset completo de buildpacks
heroku buildpacks:clear -a SEU_APP
heroku buildpacks:add heroku/nodejs -a SEU_APP
git commit --allow-empty -m "Reset buildpacks"
git push heroku main --force

# Rollback total
heroku releases -a SEU_APP
heroku rollback v123 -a SEU_APP  # Substitua v123 pela versão
```

## 📝 Checklist Pré-Deploy

- [ ] `package.json` tem `engines.node` definido
- [ ] `package.json` tem script `start`
- [ ] `Procfile` está correto
- [ ] Servidor escuta em `process.env.PORT`
- [ ] Variáveis de ambiente configuradas
- [ ] `.gitignore` não bloqueia arquivos necessários
- [ ] Buildpacks corretos (apenas Node.js)
- [ ] Stack é heroku-22 ou superior

## 🔗 Links Úteis

- [Heroku Dev Center](https://devcenter.heroku.com/)
- [Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Error Codes](https://devcenter.heroku.com/articles/error-codes)
- [CLI Commands](https://devcenter.heroku.com/articles/heroku-cli-commands)
