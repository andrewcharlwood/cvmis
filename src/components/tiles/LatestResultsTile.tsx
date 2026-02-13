import React from 'react'
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
}

function MetricCard({ kpi }: MetricCardProps) {
  const cardStyles: React.CSSProperties = {
    padding: '14px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-light)',
    background: 'var(--bg-dashboard)',
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

  return (
    <div style={cardStyles} data-kpi-id={kpi.id}>
      <div style={valueStyles}>{kpi.value}</div>
      <div style={labelStyles}>{kpi.label}</div>
      <div style={subStyles}>{kpi.sub}</div>
    </div>
  )
}

export function LatestResultsTile() {
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
          <MetricCard key={kpi.id} kpi={kpi} />
        ))}
      </div>
    </Card>
  )
}
