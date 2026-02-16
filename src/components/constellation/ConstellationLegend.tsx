import React from 'react'
import { supportsCoarsePointer } from './constants'

interface ConstellationLegendProps {
  isTouch: boolean
}

export const ConstellationLegend: React.FC<ConstellationLegendProps> = ({ isTouch }) => {
  const items = [
    { label: 'Technical', color: 'var(--accent)' },
    { label: 'Clinical', color: 'var(--success)' },
    { label: 'Leadership', color: 'var(--amber)' },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '12px',
        padding: '6px 12px',
        fontFamily: 'var(--font-geist-mono)',
        fontSize: '10px',
        color: 'var(--text-tertiary)',
        lineHeight: '24px',
      }}
    >
      {items.map((item, i) => (
        <React.Fragment key={item.label}>
          {i > 0 && (
            <span style={{ color: 'var(--border)', userSelect: 'none' }} aria-hidden="true">·</span>
          )}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: item.color,
                flexShrink: 0,
              }}
            />
            {item.label}
          </span>
        </React.Fragment>
      ))}
      <span style={{ color: 'var(--border)', userSelect: 'none' }} aria-hidden="true">·</span>
      <span style={{ opacity: 0.7 }}>{isTouch || supportsCoarsePointer ? 'Tap to explore connections' : 'Hover to explore connections'}</span>
    </div>
  )
}
