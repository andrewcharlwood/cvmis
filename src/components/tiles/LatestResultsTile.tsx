import React, { useState, useCallback } from 'react'
import { Card, CardHeader } from '../Card'
import { kpis } from '@/data/kpis'
import type { KPI } from '@/types/pmr'

const colorMap: Record<KPI['colorVariant'], string> = {
  green: '#059669',
  amber: '#D97706',
  teal: '#0D6E6E',
}

interface MetricCardProps {
  kpi: KPI
  isFlipped: boolean
  onFlip: (id: string) => void
}

function MetricCard({ kpi, isFlipped, onFlip }: MetricCardProps) {
  const handleClick = () => {
    onFlip(kpi.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onFlip(kpi.id)
    }
  }

  const outerStyles: React.CSSProperties = {
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-light)',
    background: 'var(--bg-dashboard)',
    overflow: 'hidden',
  }

  const innerStyles: React.CSSProperties = {
    padding: '14px',
  }

  const valueStyles: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    color: colorMap[kpi.colorVariant],
  }

  const labelStyles: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginTop: '3px',
  }

  const subStyles: React.CSSProperties = {
    fontSize: '10px',
    color: 'var(--text-tertiary)',
    fontFamily: "'Geist Mono', monospace",
    marginTop: '4px',
  }

  const backStyles: React.CSSProperties = {
    padding: '14px',
    background: 'var(--accent-light)',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    fontFamily: 'var(--font-ui)',
    display: 'flex',
    alignItems: 'center',
  }

  return (
    <div
      className="metric-card"
      style={outerStyles}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${kpi.label}: ${kpi.value}. ${isFlipped ? 'Showing explanation. Click to show value.' : 'Click to show explanation.'}`}
    >
      <div className={`metric-card-inner${isFlipped ? ' flipped' : ''}`}>
        <div className="metric-card-front" style={innerStyles}>
          <div style={valueStyles}>{kpi.value}</div>
          <div style={labelStyles}>{kpi.label}</div>
          <div style={subStyles}>{kpi.sub}</div>
        </div>
        <div className="metric-card-back" style={backStyles}>
          {kpi.explanation}
        </div>
      </div>
    </div>
  )
}

export function LatestResultsTile() {
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null)

  const handleFlip = useCallback((id: string) => {
    setFlippedCardId((prev) => (prev === id ? null : id))
  }, [])

  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  }

  return (
    <Card>
      <CardHeader dotColor="teal" title="LATEST RESULTS" rightText="Updated May 2025" />
      <div style={gridStyles}>
        {kpis.map((kpi) => (
          <MetricCard
            key={kpi.id}
            kpi={kpi}
            isFlipped={flippedCardId === kpi.id}
            onFlip={handleFlip}
          />
        ))}
      </div>
    </Card>
  )
}
