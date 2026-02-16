import React from 'react'
import { supportsCoarsePointer } from './constants'

interface ConstellationLegendProps {
  isTouch: boolean
  domainCounts?: Record<string, number>
}

export const ConstellationLegend: React.FC<ConstellationLegendProps> = ({ isTouch, domainCounts }) => {
  const items = [
    { label: 'Technical', domain: 'technical', color: 'var(--accent)' },
    { label: 'Clinical', domain: 'clinical', color: 'var(--success)' },
    { label: 'Leadership', domain: 'leadership', color: 'var(--amber)' },
  ]

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        padding: '8px 12px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontFamily: 'var(--font-ui)',
          color: 'var(--text-secondary)',
          opacity: 1,
        }}
      >
        {isTouch || supportsCoarsePointer ? 'Tap to explore connections' : 'Hover to explore connections'}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px',
          fontFamily: 'var(--font-geist-mono)',
          fontSize: '12px',
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
              {item.label}{domainCounts?.[item.domain] != null ? ` (${domainCounts[item.domain]})` : ''}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
