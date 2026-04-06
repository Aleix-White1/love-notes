import React, { useMemo } from 'react'

const statCard = {
  background: '#FFF9F0',
  border: '0.5px solid #DDD5C8',
  borderRadius: '10px',
  padding: '16px 18px',
}

const statNum = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '42px',
  color: '#2C2420',
  lineHeight: 1,
}

const statLabel = {
  fontSize: '10px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: '#9A8878',
  marginTop: '4px',
}

export default function MemoriaScreen({ notes, notesByYear, years }) {
  const total = notes.length
  const favCount = notes.filter(n => n.fav).length

  const sortedYears = [...years].sort((a, b) => a - b)
  const firstYear = sortedYears[0]
  const lastYear = sortedYears[sortedYears.length - 1]
  const yearsCount = lastYear && firstYear ? lastYear - firstYear + 1 : years.length

  const maxCount = useMemo(() => {
    if (years.length === 0) return 1
    return Math.max(...years.map(y => notesByYear[y].length))
  }, [notesByYear, years])

  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']

  const monthCounts = useMemo(() => {
    const counts = Array(12).fill(0)
    notes.forEach(n => {
      const m = parseInt(n.date.split('-')[1]) - 1
      counts[m]++
    })
    return counts
  }, [notes])

  const maxMonth = Math.max(...monthCounts, 1)

  const mostActiveMonth = monthCounts.indexOf(Math.max(...monthCounts))

  return (
    <div style={{ padding: '16px 16px' }}>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        <div style={statCard}>
          <div style={statNum}>{total}</div>
          <div style={statLabel}>notas guardadas</div>
        </div>
        <div style={statCard}>
          <div style={statNum}>{yearsCount}</div>
          <div style={statLabel}>años juntos</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        <div style={statCard}>
          <div style={statNum}>{favCount}</div>
          <div style={statLabel}>favoritas</div>
        </div>
        <div style={{ ...statCard, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ ...statNum, fontSize: '20px', fontStyle: 'italic', marginTop: '6px', lineHeight: 1.2 }}>
            {total > 0 ? months[mostActiveMonth] : '—'}
          </div>
          <div style={statLabel}>mes más activo</div>
        </div>
      </div>

      {/* Timeline by year */}
      {years.length > 0 && (
        <div style={{ ...statCard, marginBottom: '12px' }}>
          <div style={{ ...statLabel, marginBottom: '14px' }}>notas por año</div>
          {[...years].sort((a, b) => b - a).map(year => (
            <div key={year} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontSize: '12px', color: '#6B5A52' }}>
              <span style={{ minWidth: '38px', fontSize: '11px' }}>{year}</span>
              <div style={{ flex: 1, height: '6px', background: '#EDE0C8', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.round(notesByYear[year].length / maxCount * 100)}%`,
                  background: '#C9704A',
                  borderRadius: '3px',
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <span style={{ fontSize: '11px', color: '#9A8878', minWidth: '20px', textAlign: 'right' }}>
                {notesByYear[year].length}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Monthly activity */}
      {total > 0 && (
        <div style={{ ...statCard, marginBottom: '12px' }}>
          <div style={{ ...statLabel, marginBottom: '14px' }}>actividad mensual</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '60px' }}>
            {monthCounts.map((count, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '100%',
                  height: `${count > 0 ? Math.max(6, Math.round(count / maxMonth * 44)) : 0}px`,
                  background: i === mostActiveMonth && count > 0 ? '#C9704A' : '#DDD5C8',
                  borderRadius: '2px 2px 0 0',
                  transition: 'height 0.5s ease',
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
            {months.map((m, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '8px', color: '#9A8878' }}>
                {m.charAt(0)}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', padding: '16px 0 8px', fontSize: '12px', color: '#BBA898', letterSpacing: '0.5px' }}>
        cada nota, un recuerdo para siempre ♡
      </div>

      <div style={{ height: '100px' }} />
    </div>
  )
}
