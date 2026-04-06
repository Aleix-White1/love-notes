# Love Notes 💌

Álbum virtual de notas de papel para parejas.

**Stack:** React + Vite (frontend) · Node.js + Express + SQLite (backend) · Sharp (compresión fotos)  
**Deploy:** un solo proceso sirve frontend + API + fotos desde el mismo servidor

---

## ⚡ Publicar ahora (Railway — gratis)

```bash
# 1. Instala Railway CLI
npm install -g @railway/cli

# 2. Login (abre el navegador)
railway login

# 3. Crea el proyecto y despliega
railway init --name love-notes
railway volume add --mount /data
railway variables set NODE_ENV=production DATA_DIR=/data
railway up

# 4. Obtén tu URL pública
railway domain
```

Tu app queda en `https://love-notes-xxxx.up.railway.app` en ~2 minutos.

---

## ⚡ Publicar ahora (Render — gratis)

```bash
# 1. Sube a GitHub (necesitas gh CLI)
npm install -g gh
gh auth login
git init && git add . && git commit -m "Love Notes"
gh repo create love-notes --public --push --source=.

# 2. Ve a https://render.com
#    New → Web Service → conecta tu repo
#    Render lee render.yaml automáticamente → Apply
#    Añade un Disk en /opt/render/project/src/server/data (1 GB)
```

---

## 💻 Desarrollo local

```bash
# Terminal 1 — backend
cd server && npm install && npm run dev

# Terminal 2 — frontend  
npm install && npm run dev
```

Abre `http://localhost:5173`

---

## 📁 Estructura

```
lovenotes/
├── server/
│   ├── index.js      API Express (notas + fotos)
│   ├── db.js         SQLite puro JS (sql.js)
│   ├── package.json
│   └── data/         BD + fotos (creado automáticamente)
├── src/
│   ├── App.jsx
│   ├── components/
│   └── hooks/useNotes.js   fetch() al backend
├── railway.toml      config Railway
├── render.yaml       config Render
├── vite.config.js    proxy dev → :3001
└── package.json
```

---

## 🔌 API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/notes` | Todas las notas |
| POST | `/api/notes` | Crear (multipart: subtitle, date, image?) |
| PATCH | `/api/notes/:id/fav` | Toggle favorito |
| DELETE | `/api/notes/:id` | Eliminar nota + imagen |
| GET | `/api/stats` | Estadísticas |
| GET | `/uploads/:file` | Servir imagen |

---

Hecho con ♡
