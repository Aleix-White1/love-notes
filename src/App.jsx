import React, { useState } from 'react'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import AlbumScreen from './components/AlbumScreen.jsx'
import FavoritosScreen from './components/FavoritosScreen.jsx'
import MemoriaScreen from './components/MemoriaScreen.jsx'
import NoteDetail from './components/NoteDetail.jsx'
import AddNoteModal from './components/AddNoteModal.jsx'
import { useNotes } from './hooks/useNotes.js'

export default function App() {
  const [tab, setTab] = useState('album')
  const [selectedNote, setSelectedNote] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  const { notes, notesByYear, years, favNotes, loading, error, addNote, toggleFav, deleteNote } = useNotes()

  const handleToggleFav = async (id) => {
    const updated = await toggleFav(id)
    // Keep detail in sync
    setSelectedNote(prev => prev && prev.id === id ? updated : prev)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#FBF8F3', gap: '16px',
      }}>
        <div style={{ fontSize: '36px' }}>✉</div>
        <div style={{
          fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
          fontSize: '18px', color: '#9A8878',
        }}>cargando recuerdos…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#FBF8F3', gap: '12px', padding: '24px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '36px' }}>⚠</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#2C2420' }}>
          no se pudo conectar
        </div>
        <div style={{ fontSize: '13px', color: '#9A8878' }}>{error}</div>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '8px', padding: '10px 24px',
            background: '#2C2420', color: '#F5ECD7',
            border: 'none', borderRadius: '8px',
            fontFamily: "'Lato', sans-serif", fontSize: '12px',
            letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer',
          }}
        >reintentar</button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: '#FBF8F3' }}>
      <Header />

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
        {tab === 'album' && (
          <AlbumScreen notesByYear={notesByYear} years={years} onNoteClick={setSelectedNote} />
        )}
        {tab === 'favoritos' && (
          <FavoritosScreen favNotes={favNotes} onNoteClick={setSelectedNote} />
        )}
        {tab === 'memoria' && (
          <MemoriaScreen notes={notes} notesByYear={notesByYear} years={years} />
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAdd(true)}
        aria-label="Añadir nota"
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '16px',
          width: '52px', height: '52px',
          background: '#2C2420',
          border: 'none', borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(44,36,32,0.35)',
          zIndex: 40,
          transition: 'transform 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="#F5ECD7" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      <BottomNav active={tab} onChange={setTab} />

      {showAdd && (
        <AddNoteModal
          onClose={() => setShowAdd(false)}
          onSave={async (data) => {
            await addNote(data)
            setTab('album')
          }}
        />
      )}

      {selectedNote && (
        <NoteDetail
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onToggleFav={handleToggleFav}
          onDelete={deleteNote}
        />
      )}
    </div>
  )
}
