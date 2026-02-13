import { Card, CardHeader } from '../Card'

/**
 * Education tile - displays academic qualifications
 * Full-width card below Career Activity
 */
export function EducationTile() {
  // Education entries from CV, presented in reverse chronological order
  const educationEntries = [
    {
      degree: 'MPharm (Hons) — 2:1',
      detail: 'University of East Anglia · 2015',
    },
    {
      degree: 'NHS Leadership Academy — Mary Seacole Programme',
      detail: '2018 · 78%',
    },
    {
      degree: 'A-Levels: Mathematics (A*), Chemistry (B), Politics (C)',
      detail: 'Highworth Grammar School · 2009–2011',
    },
  ]

  return (
    <Card full>
      <CardHeader dotColor="purple" title="EDUCATION" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {educationEntries.map((entry, index) => (
          <div
            key={index}
            style={{
              padding: '7px 10px',
              background: 'var(--surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11.5px',
              color: 'var(--text-primary)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontWeight: 600,
              }}
            >
              {entry.degree}
            </span>
            <span
              style={{
                color: 'var(--text-secondary)',
                fontSize: '11px',
                marginTop: '2px',
                display: 'block',
              }}
            >
              {entry.detail}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
