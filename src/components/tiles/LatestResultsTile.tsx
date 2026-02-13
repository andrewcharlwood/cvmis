import React from 'react'
import { Card, CardHeader } from '../Card'
import { kpis } from '@/data/kpis'
import type { KPI } from '@/types/pmr'
import { useDetailPanel } from '@/contexts/DetailPanelContext'

const colorMap: Record<KPI['colorVariant'], string> = {
  green: '#059669',
  amber: '#D97706',
  teal: '#0D6E6E',
}

interface MetricCardProps {
  kpi: KPI
}

function MetricCard({ kpi }: MetricCardProps) {
  const { openPanel } = useDetailPanel()

  const handleClick = () => {
    openPanel({ type: 'kpi', kpi })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openPanel({ type: 'kpi', kpi })
    }
  }

  const buttonStyles: React.CSSProperties = {
    width: '100%',
    textAlign: 'left',
    padding: '16px',
    background: 'var(--surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'border-color 150ms ease-out, box-shadow 150ms ease-out',
  }

  const valueStyles: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    color: colorMap[kpi.colorVariant],
  }

  const labelStyles: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginTop: '4px',
  }

  const subStyles: React.CSSProperties = {
    fontSize: '10px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-geist-mono)',
    marginTop: '2px',
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={buttonStyles}
      aria-label={`${kpi.label}: ${kpi.value}. Click to view details.`}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-border)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-light)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={valueStyles}>{kpi.value}</div>
      <div style={labelStyles}>{kpi.label}</div>
      <div style={subStyles}>{kpi.sub}</div>
    </button>
  )
}

export function LatestResultsTile() {
  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  }

  return (
    <Card tileId="latest-results">
      <CardHeader dotColor="teal" title="LATEST RESULTS" rightText="Updated May 2025" />
      <div style={gridStyles}>
        {kpis.map((kpi) => (
          <MetricCard key={kpi.id} kpi={kpi} />
        ))}
      </div>
    </Card>
  )
}
