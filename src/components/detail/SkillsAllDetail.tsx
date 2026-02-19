import React, { useEffect, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  BarChart3, Code2, Database, LayoutDashboard, Bot, FileCode2,
  Pill, Users, FileCheck, Stethoscope,
  TrendingUp, Route, BookOpen, Store,
  Presentation, Calculator, Banknote, Handshake, RefreshCw,
  GitBranch, Workflow, UserPlus, ChevronRight,
} from 'lucide-react'
import { skills } from '@/data/skills'
import { useDetailPanel } from '@/contexts/DetailPanelContext'
import { getSkillsUICopy } from '@/lib/profile-content'
import type { SkillMedication, SkillCategory } from '@/types/pmr'

const iconMap: Record<string, LucideIcon> = {
  BarChart3, Code2, Database, LayoutDashboard, Bot, FileCode2,
  Pill, Users, FileCheck, Stethoscope,
  TrendingUp, Route, BookOpen, Store,
  Presentation, Calculator, Banknote, Handshake, RefreshCw,
  GitBranch, Workflow, UserPlus,
}

interface SkillsAllDetailProps {
  category?: SkillCategory
}

export function SkillsAllDetail({ category }: SkillsAllDetailProps) {
  const { openPanel } = useDetailPanel()
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const skillsCopy = getSkillsUICopy()

  // Scroll to highlighted category on mount
  useEffect(() => {
    if (category && categoryRefs.current[category]) {
      categoryRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [category])

  const frequencyRank = (freq: string): number => {
    if (freq.includes('daily')) return freq.startsWith('4') ? 0 : freq.startsWith('3') ? 1 : freq.startsWith('1') ? 3 : 2
    if (freq === 'Daily') return 4
    if (freq.includes('weekly')) return freq.startsWith('2') ? 5 : freq.startsWith('1') ? 6 : 7
    if (freq === 'Weekly') return 7
    if (freq === 'Bi-monthly') return 8
    return 9 // As needed
  }

  const groupedSkills = skillsCopy.categories.map(({ id, label }) => ({
    id,
    label,
    skills: skills
      .filter((s) => s.category === id)
      .sort((a, b) => frequencyRank(a.frequency) - frequencyRank(b.frequency)),
  }))

  const handleSkillClick = (skill: SkillMedication) => {
    openPanel({ type: 'skill', skill })
  }

  return (
    <div style={{ fontFamily: 'var(--font-ui)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {groupedSkills.map((group) => {
        const isHighlighted = category === group.id

        return (
          <div
            key={group.id}
            ref={(el) => { categoryRefs.current[group.id] = el }}
          >
            {/* Category header — divider style */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
                paddingBottom: '6px',
                borderBottom: isHighlighted ? '2px solid var(--accent)' : undefined,
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: isHighlighted ? 'var(--accent)' : 'var(--text-tertiary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {group.label}
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
                    fontSize: '10px',
                    color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-geist-mono)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {group.skills.length} {skillsCopy.itemCountSuffix}
                </span>
              </div>

            {/* Skill rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {group.skills.map((skill) => (
                <SkillRow
                  key={skill.id}
                  skill={skill}
                  yearsSuffix={skillsCopy.yearsSuffix}
                  onClick={() => handleSkillClick(skill)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface SkillRowProps {
  skill: SkillMedication
  yearsSuffix: string
  onClick: () => void
}

function SkillRow({ skill, yearsSuffix, onClick }: SkillRowProps) {
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
        padding: '8px 10px',
        background: 'var(--bg-dashboard)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-light)',
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-border)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-light)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '6px',
          background: 'var(--accent-light)',
          color: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {IconComponent && <IconComponent size={13} />}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '12.5px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}
        >
          {skill.name}
        </div>
        <div
          style={{
            fontSize: '10.5px',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-geist-mono)',
          }}
        >
          {skill.frequency} · {skill.yearsOfExperience} {yearsSuffix}
        </div>
      </div>

      {/* Chevron */}
      <ChevronRight
        size={14}
        style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}
      />
    </div>
  )
}
