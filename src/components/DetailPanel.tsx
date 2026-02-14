import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { DetailPanelContent } from '@/types/pmr'
import type { CardHeaderProps } from './Card'
import { KPIDetail } from './detail/KPIDetail'
import { ConsultationDetail } from './detail/ConsultationDetail'
import { SkillDetail } from './detail/SkillDetail'
import { SkillsAllDetail } from './detail/SkillsAllDetail'
import { EducationDetail } from './detail/EducationDetail'
import { ProjectDetail } from './detail/ProjectDetail'

// Width mapping from content type
const widthMap: Record<DetailPanelContent['type'], 'narrow' | 'wide'> = {
  kpi: 'narrow',
  skill: 'narrow',
  'skills-all': 'narrow',
  consultation: 'wide',
  project: 'wide',
  education: 'narrow',
  'career-role': 'wide',
}

// Title mapping from content data
function getPanelTitle(content: DetailPanelContent): string {
  switch (content.type) {
    case 'kpi':
      return content.kpi.label
    case 'skill':
      return content.skill.name
    case 'skills-all':
      return 'All Medications'
    case 'consultation':
      return content.consultation.role
    case 'project':
      return content.investigation.name
    case 'education':
      return content.document.title
    case 'career-role':
      return content.consultation.role
  }
}

// Dot color mapping from content type
function getDotColor(content: DetailPanelContent): CardHeaderProps['dotColor'] {
  switch (content.type) {
    case 'kpi':
      return 'teal'
    case 'skill':
    case 'skills-all':
      return 'amber'
    case 'consultation':
    case 'career-role':
      return 'teal'
    case 'project':
      return 'amber'
    case 'education':
      return 'purple'
  }
}

// Dot color value map (from Card.tsx)
const dotColorValueMap: Record<CardHeaderProps['dotColor'], string> = {
  teal: '#0D6E6E',
  amber: '#D97706',
  green: '#059669',
  alert: '#DC2626',
  purple: '#7C3AED',
}

export function DetailPanel() {
  const { content, closePanel, isOpen } = useDetailPanel()
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = 'detail-panel-title'

  // Focus trap when open
  useFocusTrap(panelRef, isOpen)

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closePanel])

  if (!isOpen || !content) return null

  const width = widthMap[content.type]
  const title = getPanelTitle(content)
  const dotColor = getDotColor(content)
  const dotColorValue = dotColorValueMap[dotColor]

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--backdrop-bg)',
          backdropFilter: 'blur(var(--backdrop-blur))',
          zIndex: 1000,
          animation: 'backdrop-fade-in 150ms ease-out',
        }}
        onClick={closePanel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="detail-panel"
        data-width={width}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--surface)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          animation: 'panel-slide-in 250ms ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-light)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: dotColorValue,
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            <h2
              id={titleId}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-ui)',
              }}
            >
              {title}
            </h2>
          </div>

          <button
            onClick={closePanel}
            aria-label="Close panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              border: 'none',
              background: 'transparent',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'background-color 150ms, color 150ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-light)'
              e.currentTarget.style.color = 'var(--accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
          }}
        >
          {/* Render content based on type */}
          {content.type === 'kpi' && <KPIDetail kpi={content.kpi} />}
          {(content.type === 'consultation' || content.type === 'career-role') && (
            <ConsultationDetail consultation={content.consultation} />
          )}

          {content.type === 'skill' && <SkillDetail skill={content.skill} />}
          {content.type === 'skills-all' && <SkillsAllDetail category={content.category} />}
          {content.type === 'education' && <EducationDetail document={content.document} />}
          {content.type === 'project' && <ProjectDetail investigation={content.investigation} />}
        </div>
      </div>
    </>
  )
}
