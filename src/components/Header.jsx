import React from 'react'

const styles = {
  header: {
    background: '#2C2420',
    padding: '20px 24px 14px',
    textAlign: 'center',
    flexShrink: 0,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontStyle: 'italic',
    fontSize: '28px',
    color: '#F5ECD7',
    letterSpacing: '0.5px',
    fontWeight: 400,
  },
  sub: {
    fontSize: '10px',
    letterSpacing: '3px',
    color: '#9A8878',
    textTransform: 'uppercase',
    marginTop: '4px',
  },
}

export default function Header() {
  return (
    <div style={styles.header}>
      <div style={styles.title}>love notes</div>
      <div style={styles.sub}>vuestros recuerdos</div>
    </div>
  )
}
