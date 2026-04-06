/**
 * db.js — thin synchronous wrapper around sql.js
 * Persists the DB to disk on every write.
 */
const path = require('path')
const fs   = require('fs')
const initSqlJs = require('sql.js')

let _db = null
let _dbPath = null

async function open(dbPath) {
  _dbPath = dbPath
  const SQL = await initSqlJs()

  if (fs.existsSync(dbPath)) {
    const buf = fs.readFileSync(dbPath)
    _db = new SQL.Database(buf)
  } else {
    _db = new SQL.Database()
  }

  _db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id        TEXT PRIMARY KEY,
      subtitle  TEXT NOT NULL DEFAULT '',
      date      TEXT NOT NULL,
      fav       INTEGER NOT NULL DEFAULT 0,
      emoji     TEXT NOT NULL DEFAULT '✉',
      img_name  TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
  flush()
  return _db
}

function flush() {
  if (!_db || !_dbPath) return
  const data = _db.export()
  fs.writeFileSync(_dbPath, Buffer.from(data))
}

/** Run a write statement and persist */
function run(sql, params = []) {
  _db.run(sql, params)
  flush()
}

/** Return all rows as plain objects */
function all(sql, params = []) {
  const stmt = _db.prepare(sql)
  stmt.bind(params)
  const rows = []
  while (stmt.step()) rows.push(stmt.getAsObject())
  stmt.free()
  return rows
}

/** Return first row or undefined */
function get(sql, params = []) {
  return all(sql, params)[0]
}

module.exports = { open, run, all, get, flush }
