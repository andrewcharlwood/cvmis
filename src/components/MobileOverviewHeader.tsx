import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Download, Github, Linkedin, Search, Send } from 'lucide-react'
import { CvmisLogo } from './CvmisLogo'
import { PhoneCaptcha } from './PhoneCaptcha'
import { ReferralFormModal } from './ReferralFormModal'
import { patient } from '@/data/patient'
import { tags } from '@/data/tags'
import { getSidebarCopy } from '@/lib/profile-content'
import type { Tag } from '@/types/pmr'

interface MobileOverviewHeaderProps {
  onSearchClick: () => void
}

function TagPill({ tag }: { tag: Tag }) {
  const styles: Record<Tag['colorVariant'], CSSProperties> = {
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
        fontSize: '12px',
        fontWeight: 500,
        padding: '4px 10px',
        borderRadius: '4px',
        lineHeight: 1.3,
        ...styles[tag.colorVariant],
      }}
    >
      {tag.label}
    </span>
  )
}

export function MobileOverviewHeader({ onSearchClick }: MobileOverviewHeaderProps) {
  const sidebarCopy = getSidebarCopy()
  const [showReferralForm, setShowReferralForm] = useState(false)

  return (
    <div
      data-tile-id="mobile-overview"
      style={{
        padding: '16px',
        background: 'var(--sidebar-bg)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
        marginBottom: '16px',
      }}
    >
      {/* Logo + Search row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginBottom: '12px' }}>
        <CvmisLogo cssHeight="40px" />
        <button
          type="button"
          onClick={onSearchClick}
          className="sidebar-control"
          aria-label={sidebarCopy.searchAriaLabel}
          style={{
            width: '100%',
            minHeight: '44px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--surface)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0 10px',
            cursor: 'pointer',
          }}
        >
          <Search size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <span style={{ flex: 1, textAlign: 'left', fontSize: '13px' }}>{sidebarCopy.searchLabel}</span>
        </button>
      </div>

      {/* Patient info */}
      <section style={{ borderBottom: '2px solid var(--accent)', paddingBottom: '12px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), #0A8080)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            AC
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              CHARLWOOD, Andrew
            </div>
            <div style={{ fontSize: '12px', fontFamily: 'var(--font-geist-mono)', color: 'var(--text-secondary)' }}>
              {sidebarCopy.roleTitle}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '6px' }}>
          {[
            { label: sidebarCopy.gphcLabel, value: patient.nhsNumber.replace(/\s/g, ''), mono: true },
            { label: sidebarCopy.educationLabel, value: patient.qualification },
            { label: sidebarCopy.locationLabel, value: patient.address },
            { label: sidebarCopy.registeredLabel, value: patient.registrationYear },
          ].map(({ label, value, mono }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '2px 0' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>{label}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500, textAlign: 'right', fontFamily: mono ? 'var(--font-geist-mono)' : undefined, fontSize: mono ? '12px' : undefined, letterSpacing: mono ? '0.12em' : undefined }}>
                {value}
              </span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '2px 0' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>{sidebarCopy.phoneLabel}</span>
            <PhoneCaptcha phone={patient.phone} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '2px 0' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>{sidebarCopy.emailLabel}</span>
            <a
              href={`mailto:${patient.email}`}
              style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none', textAlign: 'right' }}
            >
              {patient.email}
            </a>
          </div>
        </div>
      </section>

      {/* Tags */}
      <section style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
          {sidebarCopy.tagsTitle}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {tags.map((tag) => (
            <TagPill key={tag.label} tag={tag} />
          ))}
        </div>
      </section>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Download CV — full width */}
        <a
          href="/Andrew_Charlwood_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download CV"
          style={{
            width: '100%',
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            border: '1px solid var(--accent-border)',
            background: 'var(--surface)',
            color: 'var(--accent)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.03em',
            textDecoration: 'none',
          }}
        >
          <Download size={14} />
          Download CV
        </a>

        {/* Three icon buttons row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setShowReferralForm(true)}
            aria-label="Contact patient"
            style={{
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--accent-border)',
              background: 'var(--surface)',
              color: 'var(--accent)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
          >
            <Send size={16} />
          </button>
          <a
            href="https://www.linkedin.com/in/andrewcharlwood/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            style={{
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-light)',
              background: 'var(--surface)',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
            }}
          >
            <Linkedin size={16} />
          </a>
          <a
            href="https://github.com/andrewcharlwood"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            style={{
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-light)',
              background: 'var(--surface)',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
            }}
          >
            <Github size={16} />
          </a>
        </div>
      </div>

      <ReferralFormModal isOpen={showReferralForm} onClose={() => setShowReferralForm(false)} />
    </div>
  )
}
