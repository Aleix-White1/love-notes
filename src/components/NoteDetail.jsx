import React, { useState } from 'react'
import { formatDate } from '../utils.js'

export default function NoteDetail({ note, onClose, onToggleFav, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!note) return null

  const handleDelete = async () => {
    if (confirmDelete) {
      setDeleting(true)
      try {
        await onDelete(note.id)
        onClose()
      } catch (err) {
        alert('Error al eliminar: ' + err.message)
        setDeleting(false)
      }
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  const imgSrc = note.imgUrl || null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#1A1410',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      left: '50%',
      transform: 'translateX(-50%)',
    }}>
      {/* Top bar */}
      <div style={{
        background: 'rgba(26,20,16,0.97)',
        padding: '14px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '0.5px solid #3D3028',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          color: '#F5ECD7',
          fontSize: '15px',
        }}>{formatDate(note.date)}</span>
        <button onClick={onClose} style={{
          background: 'none', border: 'none',
          color: '#9A8878', fontSize: '24px',
          lineHeight: 1, padding: '2px 8px', cursor: 'pointer',
        }}>×</button>
      </div>

      {/* Image */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '16px',
      }}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={note.subtitle}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '10px' }}
          />
        ) : (
          <div style={{
            width: '200px', height: '266px',
            background: 'linear-gradient(150deg, #3D3028 0%, #2C2420 100%)',
            borderRadius: '10px',
            border: '0.5px solid #3D3028',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '64px',
          }}>{note.emoji}</div>
        )}
      </div>

      {/* Bottom */}
      <div style={{
        background: 'rgba(26,20,16,0.98)',
        padding: '16px 20px 36px',
        borderTop: '0.5px solid #3D3028',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: '20px',
          color: '#F5ECD7',
          marginBottom: '4px',
        }}>{note.subtitle}</div>
        <div style={{ fontSize: '12px', color: '#9A8878' }}>{formatDate(note.date)}</div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button onClick={() => onToggleFav(note.id)} style={{
            flex: 1,
            background: 'transparent',
            border: note.fav ? '1px solid #C9704A' : '0.5px solid #3D3028',
            color: note.fav ? '#C9704A' : '#9A8878',
            fontFamily: "'Lato', sans-serif",
            fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase',
            padding: '10px 4px', borderRadius: '6px', cursor: 'pointer',
            transition: 'all 0.2s',
          }}>{note.fav ? '♥ favorito' : '♡ favorito'}</button>

          <button onClick={handleDelete} disabled={deleting} style={{
            flex: 1,
            background: confirmDelete ? '#4A1B0C' : 'transparent',
            border: confirmDelete ? '1px solid #C9704A' : '0.5px solid #3D3028',
            color: confirmDelete ? '#F5ECD7' : '#9A8878',
            fontFamily: "'Lato', sans-serif",
            fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase',
            padding: '10px 4px', borderRadius: '6px', cursor: 'pointer',
            transition: 'all 0.2s',
          }}>{deleting ? '…' : confirmDelete ? '¿seguro?' : '✕ eliminar'}</button>

          <button onClick={onClose} style={{
            flex: 1,
            background: 'transparent',
            border: '0.5px solid #3D3028',
            color: '#9A8878',
            fontFamily: "'Lato', sans-serif",
            fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase',
            padding: '10px 4px', borderRadius: '6px', cursor: 'pointer',
          }}>volver</button>
        </div>
      </div>
    </div>
  )
}
