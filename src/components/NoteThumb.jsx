import React from 'react'
import { formatDate } from '../utils.js'

export default function NoteThumb({ note, onClick }) {
  return (
    <div
      onClick={() => onClick(note)}
      style={{
        aspectRatio: '3/4',
        background: '#FFF9F0',
        border: '0.5px solid #DDD5C8',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {note.imgUrl ? (
        <img
          src={note.imgUrl}
          alt={note.subtitle}
          loading="lazy"
          style={{ width: '100%', height: '70%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{
          width: '100%', height: '70%',
          background: 'linear-gradient(135deg, #F5ECD7 0%, #EDE0C8 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '26px',
        }}>{note.emoji}</div>
      )}

      <div style={{ padding: '6px 8px' }}>
        <div style={{
          fontSize: '10px', fontWeight: 400, color: '#2C2420',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          lineHeight: 1.3,
        }}>{note.subtitle}</div>
        <div style={{ fontSize: '9px', color: '#9A8878', marginTop: '2px' }}>
          {formatDate(note.date)}
        </div>
      </div>

      {note.fav && (
        <div style={{
          position: 'absolute', top: '6px', right: '6px',
          width: '8px', height: '8px',
          background: '#C9704A', borderRadius: '50%',
        }} />
      )}
    </div>
  )
}
