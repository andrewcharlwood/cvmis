import type { KPI } from '@/types/pmr'
import { KPI_COLORS } from '@/lib/theme-colors'
import { detailRootStyle, sectionHeadingStyle, bulletListStyle, bodyTextStyle, paragraphStyle } from './detail-styles'

interface KPIDetailProps {
  kpi: KPI
}

export function KPIDetail({ kpi }: KPIDetailProps) {
  // If story exists, render rich content; otherwise fallback to explanation
  if (!kpi.story) {
    return (
      <div
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '14px',
          lineHeight: '1.6',
          color: 'var(--text-primary)',
        }}
      >
        <div
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: KPI_COLORS[kpi.colorVariant],
            marginBottom: '16px',
          }}
        >
          {kpi.value}
        </div>
        <p>{kpi.explanation}</p>
      </div>
    )
  }

  const { context, role, outcomes, period } = kpi.story

  return (
    <div style={detailRootStyle}>
      {/* Headline number */}
      <div>
        <div
          style={{
            fontSize: '48px',
            fontWeight: 700,
            color: KPI_COLORS[kpi.colorVariant],
            lineHeight: '1',
            marginBottom: '8px',
          }}
        >
          {kpi.value}
        </div>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          {kpi.label}
        </div>
        <div
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-geist)',
            color: 'var(--text-tertiary)',
            marginTop: '2px',
          }}
        >
          {kpi.sub}
        </div>
      </div>

      {/* Period badge (if present) */}
      {period && (
        <div
          style={{
            display: 'inline-block',
            padding: '4px 10px',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent)',
            fontSize: '11px',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-geist)',
            alignSelf: 'flex-start',
          }}
        >
          {period}
        </div>
      )}

      {/* Context paragraph */}
      <div>
        <h3 style={sectionHeadingStyle}>Context</h3>
        <p style={paragraphStyle}>{context}</p>
      </div>

      {/* My role paragraph */}
      <div>
        <h3 style={sectionHeadingStyle}>My Role</h3>
        <p style={paragraphStyle}>{role}</p>
      </div>

      {/* Outcome bullets */}
      <div>
        <h3 style={sectionHeadingStyle}>Key Outcomes</h3>
        <ul style={bulletListStyle}>
          {outcomes.map((outcome, index) => (
            <li key={index} style={bodyTextStyle}>
              {outcome}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
