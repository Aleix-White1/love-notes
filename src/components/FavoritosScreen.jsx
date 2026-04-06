import React from 'react'
import NoteThumb from './NoteThumb.jsx'

export default function FavoritosScreen({ favNotes, onNoteClick }) {
  if (favNotes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9A8878' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>♡</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '18px', color: '#6B5A52', marginBottom: '8px' }}>
          aún no hay favoritos
        </div>
        <div style={{ fontSize: '13px' }}>abre una nota y marca ♡ para guardarla aquí</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '16px 16px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
      }}>
        {favNotes.map(note => (
          <NoteThumb key={note.id} note={note} onClick={onNoteClick} />
        ))}
      </div>
      <div style={{ height: '100px' }} />
    </div>
  )
}
