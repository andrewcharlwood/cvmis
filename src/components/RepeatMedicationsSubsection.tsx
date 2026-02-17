import React from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  BarChart3, Code2, Database, PieChart, FileCode2,
  Sheet, GitBranch, Workflow, Pill, Users, FileCheck,
  TrendingUp, Route, ShieldAlert, Banknote, Handshake,
  MessageSquare, UserPlus, RefreshCw, Calculator, Presentation,
  ChevronRight,
} from 'lucide-react'
import { CardHeader } from './Card'
import { skills } from '@/data/skills'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import { getSkillsUICopy } from '@/lib/profile-content'
import type { SkillMedication } from '@/types/pmr'

const iconMap: Record<string, LucideIcon> = {
  BarChart3, Code2, Database, PieChart, FileCode2,
  Sheet, GitBranch, Workflow, Pill, Users, FileCheck,
  TrendingUp, Route, ShieldAlert, Banknote, Handshake,
  MessageSquare, UserPlus, RefreshCw, Calculator, Presentation,
}


interface SkillRowProps {
  skill: SkillMedication
  yearsSuffix: string
  onClick: () => void
  onHighlight?: (id: string | null) => void
}

function SkillRow({ skill, yearsSuffix, onClick, onHighlight }: SkillRowProps) {
  const IconComponent = iconMap[skill.icon]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={`${skill.name}: ${skill.frequency}, ${skill.yearsOfExperience} years experience. Click for details.`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        minHeight: '44px',
        background: 'var(--bg-dashboard)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-light)',
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-border)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
        onHighlight?.(skill.id)
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-light)'
        e.currentTarget.style.boxShadow = 'none'
        onHighlight?.(null)
      }}
    >
      <div
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '6px',
          background: 'var(--accent-light)',
          color: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {IconComponent && <IconComponent size={15} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}
        >
          {skill.name}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            fontFamily: '"Geist Mono", monospace',
          }}
        >
          {skill.frequency} · {skill.yearsOfExperience} {yearsSuffix}
        </div>
      </div>
      <div
        style={{
          fontSize: '11px',
          fontWeight: 500,
          padding: '3px 8px',
          borderRadius: '20px',
          background: 'var(--success-light)',
          color: 'var(--success)',
          border: '1px solid var(--success-border)',
          flexShrink: 0,
        }}
      >
        {skill.status}
      </div>
      <ChevronRight
        size={14}
        style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}
      />
    </div>
  )
}

interface CategorySectionProps {
  label: string
  skills: SkillMedication[]
  itemCountSuffix: string
  yearsSuffix: string
  onSkillClick: (skill: SkillMedication) => void
  isFirst: boolean
  onNodeHighlight?: (id: string | null) => void
}

function CategorySection({
  label,
  skills: categorySkills,
  itemCountSuffix,
  yearsSuffix,
  onSkillClick,
  isFirst,
  onNodeHighlight,
}: CategorySectionProps) {
  return (
    <div style={{ marginTop: isFirst ? 0 : '16px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-tertiary)',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'var(--border-light)',
          }}
        />
        <span
          style={{
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            fontFamily: '"Geist Mono", monospace',
            whiteSpace: 'nowrap',
          }}
        >
          {categorySkills.length} {itemCountSuffix}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {categorySkills.map((skill) => (
          <SkillRow
            key={skill.id}
            skill={skill}
            yearsSuffix={yearsSuffix}
            onClick={() => onSkillClick(skill)}
            onHighlight={onNodeHighlight}
          />
        ))}
      </div>
    </div>
  )
}

interface RepeatMedicationsSubsectionProps {
  onNodeHighlight?: (id: string | null) => void
}

export function RepeatMedicationsSubsection({ onNodeHighlight }: RepeatMedicationsSubsectionProps) {
  const { openPanel } = useDetailPanel()
  const skillsCopy = getSkillsUICopy()

  const groupedSkills = skillsCopy.categories.map(({ id, label }) => ({
    id,
    label,
    skills: skills
      .filter((s) => s.category === id)
      .sort((a, b) => b.yearsOfExperience - a.yearsOfExperience),
  }))

  const handleSkillClick = (skill: SkillMedication) => {
    openPanel({ type: 'skill', skill })
  }

  return (
    <div>
      <CardHeader
        dotColor="amber"
        title={skillsCopy.sectionTitle}
        rightText={skillsCopy.rightText}
      />
      <div className="medications-grid">
        {groupedSkills.map((group) => (
          <CategorySection
            key={group.id}
            label={group.label}
            skills={group.skills}
            itemCountSuffix={skillsCopy.itemCountSuffix}
            yearsSuffix={skillsCopy.yearsSuffix}
            onSkillClick={handleSkillClick}
            isFirst
            onNodeHighlight={onNodeHighlight}
          />
        ))}
      </div>
    </div>
  )
}
