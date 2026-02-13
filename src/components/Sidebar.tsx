import { AlertTriangle, AlertCircle } from 'lucide-react'
import { patient } from '@/data/patient'
import { tags } from '@/data/tags'
import { alerts } from '@/data/alerts'
import type { Tag, Alert } from '@/types/pmr'

interface SectionTitleProps {
  children: React.ReactNode
}

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '10px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-tertiary)',
        marginBottom: '10px',
      }}
    >
      <span>{children}</span>
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'var(--border-light)',
        }}
      />
    </div>
  )
}

interface TagPillProps {
  tag: Tag
}

function TagPill({ tag }: TagPillProps) {
  const styles: Record<Tag['colorVariant'], React.CSSProperties> = {
    teal: {
      background: 'var(--accent-light)',
      color: 'var(--accent)',
      border: '1px solid var(--accent-border)',
    },
    amber: {
      background: 'var(--amber-light)',
      color: 'var(--amber)',
      border: '1px solid var(--amber-border)',
    },
    green: {
      background: 'var(--success-light)',
      color: 'var(--success)',
      border: '1px solid var(--success-border)',
    },
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        fontSize: '10.5px',
        fontWeight: 500,
        padding: '3px 8px',
        borderRadius: '4px',
        lineHeight: 1.3,
        ...styles[tag.colorVariant],
      }}
    >
      {tag.label}
    </span>
  )
}

interface AlertFlagProps {
  alert: Alert
}

function AlertFlag({ alert }: AlertFlagProps) {
  const Icon = alert.icon === 'AlertTriangle' ? AlertTriangle : AlertCircle

  const styles: Record<Alert['severity'], React.CSSProperties> = {
    alert: {
      background: 'var(--alert-light)',
      color: 'var(--alert)',
      border: '1px solid var(--alert-border)',
    },
    amber: {
      background: 'var(--amber-light)',
      color: 'var(--amber)',
      border: '1px solid var(--amber-border)',
    },
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11px',
        fontWeight: 700,
        padding: '7px 10px',
        borderRadius: 'var(--radius-sm)',
        letterSpacing: '0.02em',
        ...styles[alert.severity],
      }}
    >
      <div
        style={{
          width: '16px',
          height: '16px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={14} strokeWidth={2.5} />
      </div>
      <span>{alert.message}</span>
    </div>
  )
}

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        minWidth: 'var(--sidebar-width)',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border)',
        overflowY: 'auto',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}
      className="pmr-scrollbar"
    >
      {/* PersonHeader Section */}
      <div
        style={{
          borderBottom: '2px solid var(--accent)',
          paddingBottom: '16px',
          marginBottom: '6px',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), #0A8080)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(13,110,110,0.25)',
            marginBottom: '12px',
          }}
        >
          AC
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          CHARLWOOD, Andrew
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '11.5px',
            fontFamily: 'Geist Mono, monospace',
            fontWeight: 400,
            color: 'var(--text-secondary)',
            marginTop: '2px',
          }}
        >
          Pharmacy Data Technologist
        </div>

        {/* Status badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            marginTop: '8px',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--success)',
            background: 'var(--success-light)',
            border: '1px solid var(--success-border)',
            padding: '3px 9px',
            borderRadius: '20px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--success)',
              animation: 'pulse 2s infinite',
            }}
          />
          <span>{patient.badge}</span>
        </div>

        {/* Details grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '6px',
            marginTop: '12px',
          }}
        >
          {/* GPhC No. */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11.5px',
              padding: '2px 0',
            }}
          >
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>
              GPhC No.
            </span>
            <span
              style={{
                color: 'var(--text-primary)',
                fontWeight: 500,
                fontFamily: 'Geist Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.12em',
              }}
            >
              {patient.nhsNumber.replace(/\s/g, '')}
            </span>
          </div>

          {/* Education */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11.5px',
              padding: '2px 0',
            }}
          >
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>
              Education
            </span>
            <span
              style={{
                color: 'var(--text-primary)',
                fontWeight: 500,
                textAlign: 'right',
              }}
            >
              {patient.qualification}
            </span>
          </div>

          {/* Location */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11.5px',
              padding: '2px 0',
            }}
          >
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>
              Location
            </span>
            <span
              style={{
                color: 'var(--text-primary)',
                fontWeight: 500,
                textAlign: 'right',
              }}
            >
              {patient.address}
            </span>
          </div>

          {/* Phone */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11.5px',
              padding: '2px 0',
            }}
          >
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>
              Phone
            </span>
            <a
              href={`tel:${patient.phone}`}
              style={{
                color: 'var(--accent)',
                fontWeight: 500,
                textDecoration: 'none',
                textAlign: 'right',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = 'underline')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = 'none')
              }
            >
              {patient.phone.replace(/(\d{5})(\d{6})/, '$1 $2')}
            </a>
          </div>

          {/* Email */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11.5px',
              padding: '2px 0',
            }}
          >
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>
              Email
            </span>
            <a
              href={`mailto:${patient.email}`}
              style={{
                color: 'var(--accent)',
                fontWeight: 500,
                textDecoration: 'none',
                textAlign: 'right',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = 'underline')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = 'none')
              }
            >
              {patient.email}
            </a>
          </div>

          {/* Registered */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11.5px',
              padding: '2px 0',
            }}
          >
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>
              Registered
            </span>
            <span
              style={{
                color: 'var(--text-primary)',
                fontWeight: 500,
                textAlign: 'right',
              }}
            >
              {patient.registrationYear}
            </span>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div style={{ padding: '14px 0 6px' }}>
        <SectionTitle>Tags</SectionTitle>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '5px',
          }}
        >
          {tags.map((tag) => (
            <TagPill key={tag.label} tag={tag} />
          ))}
        </div>
      </div>

      {/* Alerts / Highlights Section */}
      <div style={{ padding: '14px 0 6px' }}>
        <SectionTitle>Alerts / Highlights</SectionTitle>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {alerts.map((alert, index) => (
            <AlertFlag key={index} alert={alert} />
          ))}
        </div>
      </div>
    </aside>
  )
}
