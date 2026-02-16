import React from 'react'
import { FileText, ChevronRight } from 'lucide-react'
import { CardHeader } from '../Card'
import { ParentSection } from '../ParentSection'
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
    padding: '16px 16px 14px',
    background: 'var(--surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'border-color 160ms ease-out, box-shadow 160ms ease-out, transform 120ms ease-out',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  }

  const valueStyles: React.CSSProperties = {
    fontSize: '30px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    color: colorMap[kpi.colorVariant],
  }

  const labelStyles: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginTop: '4px',
  }

  const subStyles: React.CSSProperties = {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-geist-mono)',
    marginTop: '2px',
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={buttonStyles}
      className="metric-card"
      aria-label={`${kpi.label}: ${kpi.value}. Click to view details.`}
    >
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          color: 'var(--accent)',
          opacity: 0.85,
        }}
        aria-hidden="true"
      >
        <FileText size={13} />
      </div>
      <div style={valueStyles}>{kpi.value}</div>
      <div style={labelStyles}>{kpi.label}</div>
      <div style={subStyles}>{kpi.sub}</div>
      <div
        style={{
          marginTop: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--accent)',
          fontFamily: 'var(--font-geist-mono)',
        }}
      >
        Click to view evidence
        <ChevronRight size={12} />
      </div>
    </button>
  )
}

export function PatientSummaryTile() {
  const profileTextStyles: React.CSSProperties = {
    fontSize: '15px',
    lineHeight: '1.65',
    color: 'var(--text-primary)',
  }

  const kpiGridStyles: React.CSSProperties = {
    display: 'grid',
    gap: '10px',
    gridTemplateColumns: '1fr',
  }

  return (
    <ParentSection title="Patient Summary" tileId="patient-summary">
      {/* Profile text */}
      <div style={profileTextStyles}>
        <strong>Healthcare leader</strong> combining clinical pharmacy expertise with proficiency in{' '}
        <strong>Python, SQL, and data analytics</strong>, self-taught over the past decade through a drive to find root causes in data and build the most efficient solutions to complex problems. Currently{' '}
        <strong>leading population health analytics for NHS Norfolk & Waveney ICB</strong>, serving a population of 1.2 million. Experienced in working with messy, real-world prescribing data at scale to deliver actionable insights—from{' '}
        <strong>financial scenario modelling</strong> and <strong>pharmaceutical rebate negotiation</strong> to{' '}
        <strong>algorithm design</strong> and <strong>population-level pathway development</strong>. Proven track record of identifying and prioritising efficiency programmes worth{' '}
        <strong>£14.6M+</strong> through automated, data-driven analysis. Skilled at translating complex clinical, financial, and analytical requirements into clear recommendations for{' '}
        <strong>executive stakeholders</strong>.
      </div>

      {/* Latest Results subsection */}
      <div style={{ marginTop: '28px' }}>
        <div className="latest-results-header">
          <CardHeader dotColor="teal" title="LATEST RESULTS (CLICK TO VIEW FULL REFERENCE RANGE)" rightText="Updated May 2025" />
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-geist-mono)',
            }}
          >
            Select a metric to inspect methodology, impact, and outcomes.
          </p>
        </div>
        <div className="latest-results-grid" style={kpiGridStyles}>
          {kpis.map((kpi) => (
            <MetricCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </div>
    </ParentSection>
  )
}
