import React, { useState, useRef, useEffect } from 'react'

const EMOJIS = ['✉','💌','📝','🌷','☁','🌙','⭐','🌸','🕊','🌺']

export default function AddNoteModal({ onClose, onSave }) {
  const [subtitle, setSubtitle] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [imgFile, setImgFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()
  const subtitleRef = useRef()

  // Focus subtitle on open
  useEffect(() => {
    const t = setTimeout(() => subtitleRef.current?.focus(), 100)
    return () => clearTimeout(t)
  }, [])

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImgFile(file)
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  const clearImage = (e) => {
    e.stopPropagation()
    setImgFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    fileRef.current.value = ''
  }

  const handleSave = async () => {
    if (!subtitle.trim() && !imgFile) return
    setSaving(true)
    try {
      await onSave({ subtitle, date, imgFile })
      onClose()
    } catch (err) {
      alert('Error al guardar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const canSave = (subtitle.trim() || imgFile) && !saving

  return (
    /*
     * Overlay: flex-col, justify-end — sheet sube desde abajo.
     * NO height fijo en el sheet: crece con el contenido.
     * El contenido hace scroll interno si es necesario.
     * Cuando el teclado sube en móvil, el viewport se reduce y
     * el sheet sigue pegado al bottom pero el scroll interno funciona.
     */
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(44,36,32,0.72)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        /* Importante: el overlay respeta el viewport visible (con teclado) */
        maxHeight: '100dvh',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: '#FBF8F3',
          borderRadius: '20px 20px 0 0',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          /* Máximo: 90% del viewport visible — con teclado esto se reduce automáticamente */
          maxHeight: '90dvh',
          overflow: 'hidden',
          animation: 'slideUp 0.25s cubic-bezier(0.32,0.72,0,1)',
        }}
        /* Evita que el tap dentro cierre el modal */
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to   { transform: translateY(0); }
          }
        `}</style>

        {/* ── Handle ── */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
          <div style={{ width: '36px', height: '4px', background: '#DDD5C8', borderRadius: '2px' }} />
        </div>

        {/* ── Header ── */}
        <div style={{
          flexShrink: 0,
          padding: '10px 20px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '0.5px solid #DDD5C8',
        }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: '19px',
            color: '#2C2420',
          }}>nueva nota</span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            color: '#9A8878', fontSize: '24px',
            lineHeight: 1, padding: '4px 8px', cursor: 'pointer',
          }}>×</button>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          padding: '18px 20px',
          /* Extra espacio en fondo para que el botón no quede pegado al teclado */
          paddingBottom: '24px',
          WebkitOverflowScrolling: 'touch',
        }}>

          {/* Upload zone */}
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
            style={{
              border: `1.5px dashed ${dragging ? '#C9704A' : '#DDD5C8'}`,
              borderRadius: '10px',
              background: dragging ? '#FFF5EB' : '#FFF9F0',
              marginBottom: '16px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s',
              /* Altura fija si no hay imagen, contenido si la hay */
              ...(preview ? {} : { padding: '24px 16px', textAlign: 'center' }),
            }}
          >
            {preview ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={preview}
                  alt=""
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }}
                />
                <button
                  onClick={clearImage}
                  style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: 'rgba(44,36,32,0.72)', color: '#F5ECD7',
                    border: 'none', borderRadius: '50%',
                    width: '30px', height: '30px',
                    fontSize: '16px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >×</button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>📷</div>
                <div style={{ fontSize: '13px', color: '#6B5A52' }}>fotografía tu nota</div>
                <div style={{ fontSize: '11px', color: '#9A8878', marginTop: '3px' }}>
                  toca para cámara · arrastra para subir
                </div>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />

          {/* Subtitle */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>subtítulo</label>
            <input
              ref={subtitleRef}
              style={inputStyle}
              type="text"
              placeholder="ej. «primera cita» o «buenas noches»"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
              maxLength={60}
              enterKeyHint="done"
            />
          </div>

          {/* Date */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>fecha de la nota</label>
            <input
              style={inputStyle}
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          {/* Save button — dentro del scroll para que suba con el teclado */}
          <button
            onClick={handleSave}
            disabled={!canSave}
            style={{
              width: '100%',
              background: canSave ? '#2C2420' : '#BBA898',
              color: '#F5ECD7',
              border: 'none',
              borderRadius: '10px',
              padding: '15px',
              fontFamily: "'Lato', sans-serif",
              fontSize: '12px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: canSave ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s, opacity 0.2s',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'guardando…' : 'guardar recuerdo'}
          </button>
        </div>
      </div>
    </div>
  )
}

const labelStyle = {
  fontSize: '10px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: '#9A8878',
  marginBottom: '6px',
  display: 'block',
}

const inputStyle = {
  width: '100%',
  background: '#FFF9F0',
  border: '0.5px solid #DDD5C8',
  borderRadius: '6px',
  padding: '11px 12px',
  fontFamily: "'Lato', sans-serif",
  fontSize: '16px', /* 16px evita zoom automático en iOS */
  color: '#2C2420',
  outline: 'none',
  WebkitAppearance: 'none',
}
