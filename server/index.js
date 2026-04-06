const express   = require('express')
const cors      = require('cors')
const multer    = require('multer')
const sharp     = require('sharp')
const { v4: uuidv4 } = require('uuid')
const path      = require('path')
const fs        = require('fs')
const db        = require('./db')

const app  = express()
const PORT = process.env.PORT || 3001
const IS_PROD = process.env.NODE_ENV === 'production'

// ── Directories ───────────────────────────────────────────────────────────────
// Railway mounts volume at /data, Render at its own path, local at ./data
const DATA_DIR    = process.env.DATA_DIR || path.join(__dirname, 'data')
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')
const DB_PATH     = path.join(DATA_DIR, 'notes.db')
fs.mkdirSync(UPLOADS_DIR, { recursive: true })

// ── Multer ────────────────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Solo imágenes'))
    cb(null, true)
  },
})

// ── Middleware ────────────────────────────────────────────────────────────────
// In production, serve frontend from same origin → no CORS needed
// In dev, allow localhost:5173
app.use(cors({
  origin: IS_PROD ? false : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))
app.use(express.json())

// Serve uploaded images with cache headers
app.use('/uploads', express.static(UPLOADS_DIR, {
  maxAge: '365d',
  immutable: true,
}))

// Serve built frontend (production)
const FRONTEND_DIST = path.join(__dirname, '..', 'dist')
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST))
  console.log('Serving frontend from dist/')
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const EMOJIS = ['✉','💌','📝','🌷','☁','🌙','⭐','🌸','🕊','🌺']
const rndEmoji = () => EMOJIS[Math.floor(Math.random() * EMOJIS.length)]

function toJson(row) {
  return {
    id:        row.id,
    subtitle:  row.subtitle,
    date:      row.date,
    fav:       row.fav === 1 || row.fav === true,
    emoji:     row.emoji,
    imgUrl:    row.img_name ? `/uploads/${row.img_name}` : null,
    createdAt: row.created_at,
  }
}

// ── API Routes ────────────────────────────────────────────────────────────────

// GET /api/notes
app.get('/api/notes', (req, res) => {
  try {
    const rows = db.all('SELECT * FROM notes ORDER BY date DESC, created_at DESC')
    res.json(rows.map(toJson))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// POST /api/notes  (multipart/form-data: subtitle, date, image?)
app.post('/api/notes', upload.single('image'), async (req, res) => {
  try {
    const { subtitle = '', date, emoji } = req.body
    if (!date) return res.status(400).json({ error: 'date requerida' })

    let img_name = null
    if (req.file) {
      const filename = `${uuidv4()}.webp`
      await sharp(req.file.buffer)
        .rotate()                        // auto-orient from EXIF
        .resize({ width: 1200, height: 1800, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(path.join(UPLOADS_DIR, filename))
      img_name = filename
    }

    const id = uuidv4()
    db.run(
      'INSERT INTO notes (id,subtitle,date,fav,emoji,img_name) VALUES (?,?,?,0,?,?)',
      [id, subtitle.trim(), date, emoji || rndEmoji(), img_name]
    )
    const row = db.get('SELECT * FROM notes WHERE id=?', [id])
    res.status(201).json(toJson(row))
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }) }
})

// PATCH /api/notes/:id/fav
app.patch('/api/notes/:id/fav', (req, res) => {
  try {
    const row = db.get('SELECT * FROM notes WHERE id=?', [req.params.id])
    if (!row) return res.status(404).json({ error: 'not found' })
    const newFav = row.fav ? 0 : 1
    db.run('UPDATE notes SET fav=? WHERE id=?', [newFav, row.id])
    res.json(toJson({ ...row, fav: newFav }))
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// DELETE /api/notes/:id
app.delete('/api/notes/:id', (req, res) => {
  try {
    const row = db.get('SELECT * FROM notes WHERE id=?', [req.params.id])
    if (!row) return res.status(404).json({ error: 'not found' })
    if (row.img_name) {
      const fp = path.join(UPLOADS_DIR, row.img_name)
      if (fs.existsSync(fp)) fs.unlinkSync(fp)
    }
    db.run('DELETE FROM notes WHERE id=?', [req.params.id])
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// GET /api/stats
app.get('/api/stats', (req, res) => {
  try {
    const total   = db.get('SELECT COUNT(*) as n FROM notes').n
    const favs    = db.get('SELECT COUNT(*) as n FROM notes WHERE fav=1').n
    const byYear  = db.all('SELECT substr(date,1,4) as year, COUNT(*) as count FROM notes GROUP BY year ORDER BY year DESC')
    const byMonth = db.all('SELECT CAST(substr(date,6,2) AS INTEGER) as month, COUNT(*) as count FROM notes GROUP BY month')
    res.json({ total, favs, byYear, byMonth })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// SPA fallback — must be last
if (fs.existsSync(FRONTEND_DIST)) {
  app.get('*', (_, res) => res.sendFile(path.join(FRONTEND_DIST, 'index.html')))
}

// ── Start ──────────────────────────────────────────────────────────────────────
db.open(DB_PATH).then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Love Notes ✉  http://0.0.0.0:${PORT}`)
    console.log(`Data: ${DATA_DIR}`)
    console.log(`Mode: ${IS_PROD ? 'production' : 'development'}`)
  })
}).catch(e => { console.error('DB error:', e); process.exit(1) })
