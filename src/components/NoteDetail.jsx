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
      width: '100%',
      height: '100dvh', // 👈 mejor que 100vh en móviles
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>

      {/* Top bar */}
      <div style={{
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
          fontSize: 'clamp(13px, 3vw, 15px)', // 👈 responsive
        }}>
          {formatDate(note.date)}
        </span>

        <button onClick={onClose} style={{
          background: 'none',
          border: 'none',
          color: '#9A8878',
          fontSize: '26px',
          padding: '4px 8px',
        }}>×</button>
      </div>

      {/* Content scrollable */}
      <div style={{
        flex: 1,
        overflowY: 'auto', // 👈 scroll real
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '16px',
        gap: '16px',
      }}>

        {/* Image */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxHeight: '50vh', // 👈 clave para móvil
        }}>
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={note.subtitle}
              style={{
                width: '100%',
                maxHeight: '50vh',
                objectFit: 'contain',
                borderRadius: '10px'
              }}
            />
          ) : (
            <div style={{
              width: '140px',
              height: '180px',
              background: 'linear-gradient(150deg, #3D3028 0%, #2C2420 100%)',
              borderRadius: '10px',
              border: '0.5px solid #3D3028',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
            }}>
              {note.emoji}
            </div>
          )}
        </div>

        {/* Text */}
        <div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(18px, 5vw, 22px)',
            color: '#F5ECD7',
            marginBottom: '4px',
          }}>
            {note.subtitle}
          </div>

          <div style={{
            fontSize: '12px',
            color: '#9A8878'
          }}>
            {formatDate(note.date)}
          </div>
        </div>

      </div>

      {/* Bottom actions */}
      <div style={{
        padding: '16px',
        borderTop: '0.5px solid #3D3028',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
      }}>

        {/* Fav */}
        <button
          onClick={() => onToggleFav(note.id)}
          style={{
            background: 'transparent',
            border: note.fav ? '1px solid #C9704A' : '0.5px solid #3D3028',
            color: note.fav ? '#C9704A' : '#9A8878',
            fontSize: '12px',
            padding: '12px',
            borderRadius: '8px',
          }}
        >
          {note.fav ? '♥ favorito' : '♡ favorito'}
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            background: confirmDelete ? '#4A1B0C' : 'transparent',
            border: confirmDelete ? '1px solid #C9704A' : '0.5px solid #3D3028',
            color: confirmDelete ? '#F5ECD7' : '#9A8878',
            fontSize: '12px',
            padding: '12px',
            borderRadius: '8px',
          }}
        >
          {deleting ? '…' : confirmDelete ? '¿seguro?' : '✕ eliminar'}
        </button>

        {/* Back full width */}
        <button
          onClick={onClose}
          style={{
            gridColumn: 'span 2',
            background: 'transparent',
            border: '0.5px solid #3D3028',
            color: '#9A8878',
            fontSize: '12px',
            padding: '12px',
            borderRadius: '8px',
          }}
        >
          volver
        </button>

      </div>
    </div>
  )
}