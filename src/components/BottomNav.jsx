import React from 'react'

const tabs = [
  { id: 'album', label: 'álbum' },
  { id: 'favoritos', label: 'favoritos' },
  { id: 'memoria', label: 'memoria' },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '480px',
      background: '#2C2420',
      borderTop: '0.5px solid #3D3028',
      display: 'flex',
      padding: '8px 8px 20px',
      zIndex: 50,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            background: active === tab.id ? '#3D3028' : 'transparent',
            border: 'none',
            color: active === tab.id ? '#F5ECD7' : '#9A8878',
            fontFamily: "'Lato', sans-serif",
            fontSize: '11px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            padding: '10px 4px',
            borderRadius: '6px',
            transition: 'all 0.2s',
            cursor: 'pointer',
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
