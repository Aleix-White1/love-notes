import { useState, useEffect, useCallback } from 'react'

const API = import.meta.env.VITE_API_URL || ''

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API}${path}`, opts)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  return res.json()
}

export function useNotes() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiFetch('/api/notes')
      .then(setNotes)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const addNote = useCallback(async ({ subtitle, date, imgFile }) => {
    const form = new FormData()
    form.append('subtitle', subtitle)
    form.append('date', date)
    if (imgFile) form.append('image', imgFile)
    const note = await apiFetch('/api/notes', { method: 'POST', body: form })
    setNotes(prev => [note, ...prev])
    return note
  }, [])

  const toggleFav = useCallback(async (id) => {
    const updated = await apiFetch(`/api/notes/${id}/fav`, { method: 'PATCH' })
    setNotes(prev => prev.map(n => n.id === id ? updated : n))
    return updated
  }, [])

  const deleteNote = useCallback(async (id) => {
    await apiFetch(`/api/notes/${id}`, { method: 'DELETE' })
    setNotes(prev => prev.filter(n => n.id !== id))
  }, [])

  const notesByYear = notes.reduce((acc, n) => {
    const y = parseInt(n.date.split('-')[0])
    if (!acc[y]) acc[y] = []
    acc[y].push(n)
    return acc
  }, {})

  const years = Object.keys(notesByYear).map(Number).sort((a, b) => b - a)
  const favNotes = notes.filter(n => n.fav)

  return { notes, notesByYear, years, favNotes, loading, error, addNote, toggleFav, deleteNote }
}
