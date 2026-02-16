import React, { useEffect, useState } from 'react'
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

const KPI_COACHMARK_KEY = 'kpi-evidence-coachmark-dismissed-v1'

interface MetricCardProps {
  kpi: KPI
  showCoachmark?: boolean
  onOpen: () => void
}

function MetricCard({ kpi, showCoachmark = false, onOpen }: MetricCardProps) {
  const { openPanel } = useDetailPanel()

  const handleClick = () => {
    onOpen()
    openPanel({ type: 'kpi', kpi })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen()
      openPanel({ type: 'kpi', kpi })
    }
  }

  const buttonStyles: React.CSSProperties = {
    width: '100%',
    textAlign: 'left',
    padding: '20px',
    background: 'var(--surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'border-color 160ms ease-out, box-shadow 160ms ease-out, transform 120ms ease-out',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  }

  const valueStyles: React.CSSProperties = {
    fontSize: '34px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    color: colorMap[kpi.colorVariant],
  }

  const labelStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginTop: '4px',
  }

  const subStyles: React.CSSProperties = {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    fontFamily: 'var(--font-geist-mono)',
    marginTop: '2px',
  }

  return (
    <div className={showCoachmark ? 'kpi-card-coachmark-target' : undefined} style={{ position: 'relative' }}>
      {showCoachmark && (
        <div className="kpi-coachmark" role="status" aria-live="polite">
          Open any metric to see evidence
        </div>
      )}
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={buttonStyles}
        className={`metric-card ${showCoachmark ? 'metric-card-pulse' : ''}`}
        aria-label={`${kpi.label}: ${kpi.value}. Click to view details.`}
      >
        <div
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            color: 'var(--accent)',
            opacity: 0.85,
          }}
          aria-hidden="true"
        >
          <FileText size={14} />
        </div>
        <div style={valueStyles}>{kpi.value}</div>
        <div style={labelStyles}>{kpi.label}</div>
        <div style={subStyles}>{kpi.sub}</div>
        <div
          style={{
            marginTop: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--accent)',
            fontFamily: 'var(--font-geist-mono)',
          }}
        >
          Click to view evidence
          <ChevronRight size={13} />
        </div>
      </button>
    </div>
  )
}

export function PatientSummaryTile() {
  const [showCoachmark, setShowCoachmark] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hasDismissed = window.localStorage.getItem(KPI_COACHMARK_KEY) === '1'
    if (!hasDismissed) {
      setShowCoachmark(true)
    }
  }, [])

  const handleMetricOpen = () => {
    if (!showCoachmark) return
    setShowCoachmark(false)
    window.localStorage.setItem(KPI_COACHMARK_KEY, '1')
  }

  const profileTextStyles: React.CSSProperties = {
    fontSize: '15px',
    lineHeight: '1.65',
    color: 'var(--text-primary)',
  }

  const kpiGridStyles: React.CSSProperties = {
    display: 'grid',
    gap: '16px',
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
        <CardHeader dotColor="teal" title="LATEST RESULTS (CLICK TO VIEW FULL REFERENCE RANGE)" rightText="Updated May 2025" />
        <p
          style={{
            margin: '0 0 12px 0',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-geist-mono)',
          }}
        >
          Select a metric to inspect methodology, impact, and outcomes.
        </p>
        <div className="grid-cols-1 xs:grid-cols-2" style={kpiGridStyles}>
          {kpis.map((kpi, index) => (
            <MetricCard key={kpi.id} kpi={kpi} onOpen={handleMetricOpen} showCoachmark={showCoachmark && index === 0} />
          ))}
        </div>
      </div>
    </ParentSection>
  )
}
