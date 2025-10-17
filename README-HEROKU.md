# 🚀 Correção Completa do Deploy Heroku

## ⚡ SOLUÇÃO RÁPIDA

Execute este comando AGORA:

```bash
./DEPLOY-AGORA.sh
```

Este script vai:
1. ✅ Aplicar todas as correções localmente
2. ✅ Configurar buildpacks no Heroku (se tiver CLI)
3. ✅ Fazer deploy automaticamente
4. ✅ Testar a aplicação

---

## 📋 O Que Foi Corrigido

### ❌ Problema Original
- **Erro H10:** App crashed
- Buildpack Python em vez de Node.js
- package.json com configuração errada
- Procfile apontando para arquivo incorreto

### ✅ Correções Aplicadas

1. **Criado `start-heroku.js`**
   - Servidor Express simplificado
   - Garantido para funcionar no Heroku
   - Escuta corretamente em `process.env.PORT`
   - Log detalhado de inicialização

2. **Atualizado `Procfile`**
   ```
   web: node start-heroku.js
   ```

3. **Criado `package.json.heroku`**
   - Versão otimizada com apenas dependências necessárias
   - Engines Node.js >=18 especificado
   - Script start correto

4. **Scripts de Deploy Automático**
   - `DEPLOY-AGORA.sh` - Correção e deploy em um comando
   - `apply-heroku-fix.sh` - Aplica correções localmente
   - `fix-heroku.sh` - Deploy completo com verificações

---

## 🎯 Opções de Deploy

### Opção 1: Automático com CLI (Recomendado)

```bash
./DEPLOY-AGORA.sh
```

### Opção 2: Manual via Dashboard

1. **Aplicar correções:**
   ```bash
   ./apply-heroku-fix.sh
   ```

2. **Configurar no Dashboard:**
   - Acesse: https://dashboard.heroku.com/apps/mlnova-0fd22bb288f2/settings
   - **Buildpacks:** Remova todos, adicione apenas `heroku/nodejs`
   - **Config Vars:**
     - `NODE_ENV` = `production`
     - `NPM_CONFIG_PRODUCTION` = `false`
     - `FOUR_M_PAGAMENTOS_API_KEY` = `[sua-chave]`

3. **Deploy:**
   - Vá em "Deploy" > "Deploy Branch"

### Opção 3: Linha de Comando Manual

```bash
# 1. Aplicar correções locais
./apply-heroku-fix.sh

# 2. Configurar buildpacks
heroku buildpacks:clear -a mlnova-0fd22bb288f2
heroku buildpacks:add heroku/nodejs -a mlnova-0fd22bb288f2

# 3. Configurar variáveis
heroku config:set NPM_CONFIG_PRODUCTION=false -a mlnova-0fd22bb288f2
heroku config:set NODE_ENV=production -a mlnova-0fd22bb288f2

# 4. Deploy
git push heroku main --force
```

---

## 🔍 Verificação

### Teste Rápido

```bash
curl https://mlnova-0fd22bb288f2.herokuapp.com/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-17T...",
  "environment": "production",
  "port": 5000,
  "uptime": 15.2
}
```

### Ver Logs

**Via CLI:**
```bash
heroku logs --tail -a mlnova-0fd22bb288f2
```

**Via Dashboard:**
- https://dashboard.heroku.com/apps/mlnova-0fd22bb288f2
- "More" > "View logs"

---

## 📁 Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| **start-heroku.js** | ✅ Servidor simplificado garantido |
| **DEPLOY-AGORA.sh** | ⚡ Deploy rápido em 1 comando |
| **apply-heroku-fix.sh** | 🔧 Aplica correções localmente |
| **fix-heroku.sh** | 🚀 Deploy completo automático |
| **package.json.heroku** | 📦 Package.json otimizado |
| **COMO-CORRIGIR-HEROKU.md** | 📖 Guia passo a passo |
| **HEROKU-FIX-MANUAL.md** | 📚 Referência completa |
| **COMANDOS-HEROKU.md** | 📋 Lista de comandos |

---

## ✅ Checklist de Verificação

Após executar `./DEPLOY-AGORA.sh`:

- [ ] Script executou sem erros
- [ ] package.json foi atualizado (backup criado)
- [ ] Procfile aponta para `start-heroku.js`
- [ ] Buildpack é `heroku/nodejs` (verificar no Dashboard)
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] `/health` responde com status "ok"
- [ ] Logs não mostram erros

---

## 🐛 Troubleshooting

### App ainda crasha?

**1. Verificar buildpacks:**
```bash
heroku buildpacks -a mlnova-0fd22bb288f2
```

Deve mostrar APENAS: `heroku/nodejs`

**2. Limpar e reconstruir:**
```bash
heroku repo:purge_cache -a mlnova-0fd22bb288f2
git commit --allow-empty -m "Force rebuild"
git push heroku main --force
```

**3. Verificar logs detalhados:**
```bash
heroku logs -n 200 -a mlnova-0fd22bb288f2 | grep -i error
```

**4. Reiniciar:**
```bash
heroku restart -a mlnova-0fd22bb288f2
```

---

## 📊 Estrutura do Deploy

```
┌─────────────────────────────┐
│  Aplicação Local (Replit)  │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│  apply-heroku-fix.sh        │
│  - Atualiza package.json    │
│  - Atualiza Procfile        │
│  - Commit mudanças          │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│  Git Push → Heroku          │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│  Heroku Build               │
│  - Buildpack: Node.js       │
│  - Install dependencies     │
│  - Run heroku-postbuild     │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│  Heroku Runtime             │
│  - Executa: node start.js   │
│  - Porta: process.env.PORT  │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│  App Online! 🎉             │
│  https://mlnova-...com      │
└─────────────────────────────┘
```

---

## 🌐 URLs Importantes

Após deploy bem-sucedido:

- **App:** https://mlnova-0fd22bb288f2.herokuapp.com
- **Health:** https://mlnova-0fd22bb288f2.herokuapp.com/health
- **API Regions:** https://mlnova-0fd22bb288f2.herokuapp.com/api/regions
- **Dashboard:** https://dashboard.heroku.com/apps/mlnova-0fd22bb288f2

---

## 📞 Suporte

Se precisar de ajuda adicional:

1. 📖 Leia: `COMO-CORRIGIR-HEROKU.md`
2. 📚 Consulte: `HEROKU-FIX-MANUAL.md`
3. 📋 Use: `COMANDOS-HEROKU.md`

---

## 🎉 Sucesso!

Quando tudo estiver funcionando:

```
✅ App respondendo em /health
✅ Logs sem erros
✅ Buildpack: heroku/nodejs
✅ Variáveis configuradas
```

**Seu app estará online em:**
https://mlnova-0fd22bb288f2.herokuapp.com
