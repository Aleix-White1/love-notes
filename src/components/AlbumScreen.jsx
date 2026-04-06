import React from 'react'
import NoteThumb from './NoteThumb.jsx'

const yearLabel = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '13px',
  color: '#9A8878',
  letterSpacing: '1px',
  margin: '20px 0 10px',
  borderBottom: '0.5px solid #DDD5C8',
  paddingBottom: '6px',
}

export default function AlbumScreen({ notesByYear, years, onNoteClick }) {
  if (years.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9A8878' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>✉</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '18px', color: '#6B5A52', marginBottom: '8px' }}>
          aún no hay notas
        </div>
        <div style={{ fontSize: '13px' }}>toca + para añadir vuestra primera nota</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '4px 16px 16px' }}>
      {years.map((year, i) => (
        <div key={year}>
          <div style={{ ...yearLabel, marginTop: i === 0 ? '16px' : '20px' }}>{year}</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
          }}>
            {notesByYear[year].map(note => (
              <NoteThumb key={note.id} note={note} onClick={onNoteClick} />
            ))}
          </div>
        </div>
      ))}
      <div style={{ height: '100px' }} />
    </div>
  )
}
