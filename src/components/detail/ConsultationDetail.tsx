import type { Consultation } from '@/types/pmr'
import { detailRootStyle, sectionHeadingStyle, bulletListStyle, bodyTextStyle, paragraphStyle } from './detail-styles'

interface ConsultationDetailProps {
  consultation: Consultation
}

export function ConsultationDetail({ consultation }: ConsultationDetailProps) {
  return (
    <div style={detailRootStyle}>
      {/* Role header */}
      <div>
        <div
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: '1.3',
            marginBottom: '4px',
          }}
        >
          {consultation.role}
        </div>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: consultation.orgColor,
            marginBottom: '8px',
          }}
        >
          {consultation.organization}
        </div>
        <div
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-geist)',
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>{consultation.duration}</span>
          {consultation.isCurrent && (
            <span
              style={{
                padding: '2px 8px',
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                fontSize: '10px',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Current
            </span>
          )}
        </div>
      </div>

      {/* History (presenting complaint) */}
      <div>
        <h3 style={sectionHeadingStyle}>History</h3>
        <p style={paragraphStyle}>
          {consultation.history}
        </p>
      </div>

      {/* Examination (achievements) */}
      {consultation.examination && consultation.examination.length > 0 && (
        <div>
          <h3 style={sectionHeadingStyle}>Key Achievements</h3>
          <ul style={bulletListStyle}>
            {consultation.examination.map((item, index) => (
              <li key={index} style={bodyTextStyle}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Plan (outcomes) */}
      {consultation.plan && consultation.plan.length > 0 && (
        <div>
          <h3 style={sectionHeadingStyle}>Outcomes & Impact</h3>
          <ul style={bulletListStyle}>
            {consultation.plan.map((item, index) => (
              <li key={index} style={bodyTextStyle}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Coded entries (technical environment / tags) */}
      {consultation.codedEntries && consultation.codedEntries.length > 0 && (
        <div>
          <h3 style={sectionHeadingStyle}>Coded Entries</h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            {consultation.codedEntries.map((entry, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: 'var(--bg-dashboard)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-geist)',
                    fontWeight: 600,
                    color: 'var(--accent)',
                  }}
                >
                  {entry.code}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {entry.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
