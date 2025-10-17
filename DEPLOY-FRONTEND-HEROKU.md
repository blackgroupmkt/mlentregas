# 🚀 Deploy Full-Stack no Heroku (Frontend + API)

## ✅ CORREÇÃO APLICADA

O problema foi identificado e corrigido:

### ❌ Problema:
O Heroku estava servindo **apenas a API**, não o **frontend** (página web).

### ✅ Solução:
Criado servidor full-stack que serve **API + Frontend**.

---

## 📋 EXECUTAR AGORA:

### Opção 1: Deploy Rápido (Recomendado)

```bash
# 1. Fazer commit das mudanças
git add Procfile heroku-fullstack.js
git commit -m "Fix: Adiciona servidor full-stack para Heroku"

# 2. Push para Heroku
git push heroku main --force

# 3. Aguardar e testar
sleep 10
curl https://mlnova-0fd22bb288f2.herokuapp.com/
```

### Opção 2: Via Dashboard Heroku

1. Acesse: https://dashboard.heroku.com/apps/mlnova-0fd22bb288f2/deploy
2. Em "Manual deploy", clique em "Deploy Branch"
3. Aguarde o build concluir
4. Abra: https://mlnova-0fd22bb288f2.herokuapp.com/

---

## 🔍 O QUE MUDOU:

### Antes (❌ Só API):
```
Procfile: web: node start-heroku.js
→ Servidor mostrava apenas: {"name":"API","version":"1.0.0"...}
```

### Agora (✅ Full-Stack):
```
Procfile: web: node heroku-fullstack.js
→ Servidor serve: Frontend (página web) + API
```

---

## 📊 ESTRUTURA DO NOVO SERVIDOR:

```javascript
heroku-fullstack.js
├── API Routes
│   ├── /health                    → Status
│   ├── /api/regions              → Regiões
│   └── /api/payments/create-pix  → Pagamentos
│
└── Frontend (SPA)
    ├── Serve arquivos de dist/public ou dist/
    └── Fallback: todas rotas → index.html
```

---

## 🧪 TESTE:

Após deploy, acesse:

**Frontend:**
- https://mlnova-0fd22bb288f2.herokuapp.com/
  → Deve mostrar a **página de cadastro** completa

**API:**
- https://mlnova-0fd22bb288f2.herokuapp.com/health
  → {"status":"ok",...}

- https://mlnova-0fd22bb288f2.herokuapp.com/api/regions
  → Array com estados do Brasil

---

## 📁 ARQUIVOS CRIADOS:

| Arquivo | Descrição |
|---------|-----------|
| **heroku-fullstack.js** | ✅ Servidor que serve API + Frontend |
| **Procfile** | ✅ Atualizado para usar heroku-fullstack.js |
| **heroku-build.sh** | 🔧 Script de build (se necessário) |
| **package.json.heroku-full** | 📦 Package com build frontend |

---

## ⚙️ SE O FRONTEND NÃO APARECER:

O servidor tenta encontrar o frontend em:
1. `dist/public/`
2. `dist/`
3. `public/`
4. `build/`

### Verificar se existe:
```bash
ls -la dist/public/index.html
# ou
ls -la dist/index.html
```

### Se não existir, construir localmente:
```bash
npm run build
# ou
vite build
```

Depois fazer deploy:
```bash
git add dist/
git commit -m "Add frontend build"
git push heroku main
```

---

## 🔧 TROUBLESHOOTING:

### 1. Ainda mostra só API?

**Verificar logs:**
```bash
heroku logs -n 50 -a mlnova-0fd22bb288f2 | grep "Frontend"
```

**Deve mostrar:**
```
✓ Frontend encontrado em: /app/dist/public
✓ Frontend configurado - servindo SPA
```

**Se mostrar:**
```
⚠️  Frontend não encontrado. Servindo apenas API.
```

**Solução:** Build do frontend não foi incluído no deploy.

### 2. Construir Frontend Manualmente:

```bash
# Local
npm run build

# Verificar
ls dist/public/index.html

# Commit e deploy
git add dist/
git commit -m "Add frontend build"
git push heroku main
```

### 3. Forçar Rebuild no Heroku:

```bash
heroku config:set REBUILD=true -a mlnova-0fd22bb288f2
git commit --allow-empty -m "Force rebuild"
git push heroku main
```

---

## ✅ VERIFICAÇÃO FINAL:

Marque ao concluir:

- [ ] Procfile aponta para `heroku-fullstack.js`
- [ ] Commit e push realizados
- [ ] Deploy concluído sem erros
- [ ] URL raiz mostra o **frontend** (página de cadastro)
- [ ] `/health` responde com status "ok"
- [ ] `/api/regions` retorna array de estados

---

## 🎉 SUCESSO!

Quando funcionar, você verá:

**URL Raiz:** https://mlnova-0fd22bb288f2.herokuapp.com/
```
Página completa de cadastro Shopee Delivery Partners
com formulário, seleção de estado, etc.
```

**Health Check:** https://mlnova-0fd22bb288f2.herokuapp.com/health
```json
{
  "status": "ok",
  "environment": "production"
}
```

---

## 📞 PRÓXIMOS PASSOS:

1. ✅ Execute o deploy:
   ```bash
   git add .
   git commit -m "Deploy full-stack"
   git push heroku main
   ```

2. ✅ Aguarde 1-2 minutos

3. ✅ Abra: https://mlnova-0fd22bb288f2.herokuapp.com/

4. ✅ Verifique se mostra a página completa do site

Se precisar de ajuda, veja os logs:
```bash
heroku logs --tail -a mlnova-0fd22bb288f2
```
