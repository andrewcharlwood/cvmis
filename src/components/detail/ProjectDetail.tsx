import { ExternalLink } from 'lucide-react'
import type { Investigation } from '@/types/pmr'
import { PROJECT_STATUS_COLORS } from '@/lib/theme-colors'

interface ProjectDetailProps {
  investigation: Investigation
}

const statusBgMap: Record<Investigation['status'], string> = {
  Complete: 'rgba(5,150,105,0.08)',
  Ongoing: 'rgba(217,119,6,0.08)',
  Live: 'rgba(10,128,128,0.08)',
}

export function ProjectDetail({ investigation }: ProjectDetailProps) {
  const statusColor = PROJECT_STATUS_COLORS[investigation.status]
  const statusBg = statusBgMap[investigation.status]

  return (
    <div
      style={{
        fontFamily: 'var(--font-ui)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Header: name + year + status */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '8px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-geist-mono)',
              color: 'var(--text-tertiary)',
            }}
          >
            {investigation.requestedYear}
          </span>
          <span
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 600,
              color: statusColor,
              backgroundColor: statusBg,
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {investigation.status}
          </span>
        </div>
        <div
          style={{
            fontSize: '12px',
            fontFamily: 'var(--font-geist-mono)',
            color: 'var(--text-tertiary)',
          }}
        >
          {investigation.requestingClinician}
        </div>
      </div>

      {/* Methodology */}
      <div>
        <h3
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
          }}
        >
          Methodology
        </h3>
        <p
          style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: 'var(--text-primary)',
            margin: 0,
          }}
        >
          {investigation.methodology}
        </p>
      </div>

      {/* Tech stack tags */}
      <div>
        <h3
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
          }}
        >
          Tech Stack
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {investigation.techStack.map((tech) => (
            <span
              key={tech}
              style={{
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: 500,
                fontFamily: 'var(--font-geist-mono)',
                color: 'var(--accent)',
                backgroundColor: 'var(--accent-light)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--accent-border)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        <h3
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
          }}
        >
          Results
        </h3>
        <ul
          style={{
            margin: 0,
            paddingLeft: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {investigation.results.map((result, index) => (
            <li
              key={index}
              style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: 'var(--text-primary)',
              }}
            >
              {result}
            </li>
          ))}
        </ul>
      </div>

      {/* External link */}
      {investigation.externalUrl && (
        <a
          href={investigation.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'var(--font-ui)',
            color: 'var(--surface)',
            backgroundColor: 'var(--accent)',
            borderRadius: 'var(--radius-sm)',
            textDecoration: 'none',
            alignSelf: 'flex-start',
            transition: 'background-color 150ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent)'
          }}
        >
          <ExternalLink size={14} />
          View Live Project
        </a>
      )}
    </div>
  )
}
