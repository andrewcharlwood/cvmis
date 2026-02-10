import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Skill } from '../types'
import { calculateSkillOffset } from '../lib/utils'

const GAUGE_RADIUS = 34
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS

interface SkillGaugeProps {
  skill: Skill
  delay: number
  isVisible: boolean
}

function SkillGauge({ skill, delay, isVisible }: SkillGaugeProps) {
  const [animated, setAnimated] = useState(false)
  const strokeColor = skill.color === 'coral' ? '#FF6B6B' : '#00897B'
  const hoverBg = skill.color === 'coral' ? 'hover:bg-coral-light' : 'hover:bg-teal-light'
  
  const targetOffset = calculateSkillOffset(skill.level, GAUGE_RADIUS)
  
  useEffect(() => {
    if (isVisible && !animated) {
      const timer = setTimeout(() => setAnimated(true), delay)
      return () => clearTimeout(timer)
    }
  }, [isVisible, animated, delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: delay / 1000, ease: 'easeOut' }}
      className={`flex flex-col items-center p-3 xs:p-4 rounded-2xl transition-colors duration-300 ${hoverBg}`}
    >
      <svg
        className="skill-gauge block w-16 h-16 xs:w-20 xs:h-20"
        viewBox="0 0 80 80"
      >
        <circle
          cx="40"
          cy="40"
          r={GAUGE_RADIUS}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="5"
        />
        <circle
          cx="40"
          cy="40"
          r={GAUGE_RADIUS}
          fill="none"
          stroke={strokeColor}
          strokeWidth="5"
          strokeLinecap="round"
          transform="rotate(-90, 40, 40)"
          style={{
            strokeDasharray: GAUGE_CIRCUMFERENCE,
            strokeDashoffset: animated ? targetOffset : GAUGE_CIRCUMFERENCE,
            transition: animated ? 'stroke-dashoffset 1.2s ease-out' : 'none'
          }}
        />
        <text
          x="40"
          y="40"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="14"
          fontWeight="600"
          fill="#0F172A"
          fontFamily="'Inter Tight', system-ui, sans-serif"
        >
          {skill.level}%
        </text>
      </svg>
      <span className="font-primary text-xs font-semibold text-heading mt-2 text-center leading-tight">
        {skill.name}
      </span>
      <span className="font-secondary text-[10px] text-muted uppercase tracking-wide mt-0.5">
        {skill.category}
      </span>
    </motion.div>
  )
}

interface SkillCategoryProps {
  label: string
  skills: Skill[]
  isVisible: boolean
  baseDelay: number
}

function SkillCategory({ label, skills, isVisible, baseDelay }: SkillCategoryProps) {
  return (
    <div className="mb-10 last:mb-0">
      <h3 className="font-secondary text-xs font-semibold uppercase tracking-widest text-muted mb-5 pl-1">
        {label}
      </h3>
      <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4 xs:gap-6">
        {skills.map((skill, index) => (
          <SkillGauge
            key={skill.name}
            skill={skill}
            delay={baseDelay + index * 100}
            isVisible={isVisible}
          />
        ))}
      </div>
    </div>
  )
}

const skillsData: Skill[] = [
  { name: 'Python', level: 90, category: 'Technical', color: 'teal' },
  { name: 'SQL', level: 88, category: 'Technical', color: 'teal' },
  { name: 'Power BI', level: 92, category: 'Technical', color: 'teal' },
  { name: 'JS / TS', level: 70, category: 'Technical', color: 'teal' },
  { name: 'Data Analysis', level: 95, category: 'Technical', color: 'teal' },
  { name: 'Dashboard Dev', level: 88, category: 'Technical', color: 'teal' },
  { name: 'Algorithm Design', level: 82, category: 'Technical', color: 'teal' },
  { name: 'Data Pipelines', level: 80, category: 'Technical', color: 'teal' },
  
  { name: 'Medicines Optimisation', level: 95, category: 'Clinical', color: 'coral' },
  { name: 'Pop. Health Analytics', level: 90, category: 'Clinical', color: 'coral' },
  { name: 'NICE TA', level: 85, category: 'Clinical', color: 'coral' },
  { name: 'Health Economics', level: 80, category: 'Clinical', color: 'coral' },
  { name: 'Clinical Pathways', level: 82, category: 'Clinical', color: 'coral' },
  { name: 'CD Assurance', level: 88, category: 'Clinical', color: 'coral' },
  
  { name: 'Budget Mgmt', level: 90, category: 'Strategic', color: 'teal' },
  { name: 'Stakeholder Engagement', level: 88, category: 'Strategic', color: 'teal' },
  { name: 'Pharma Negotiation', level: 85, category: 'Strategic', color: 'teal' },
  { name: 'Team Development', level: 82, category: 'Strategic', color: 'teal' },
]

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.15, rootMargin: '0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const technicalSkills = skillsData.filter(s => s.category === 'Technical')
  const clinicalSkills = skillsData.filter(s => s.category === 'Clinical')
  const strategicSkills = skillsData.filter(s => s.category === 'Strategic')

  return (
    <section id="skills" ref={sectionRef} className="py-12 xs:py-16 md:py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="font-primary text-2xl font-bold text-heading text-center mb-8"
      >
        Skills &amp; Expertise
      </motion.h2>

      <SkillCategory
        label="Technical"
        skills={technicalSkills}
        isVisible={isVisible}
        baseDelay={200}
      />
      <SkillCategory
        label="Clinical"
        skills={clinicalSkills}
        isVisible={isVisible}
        baseDelay={200 + technicalSkills.length * 100 + 100}
      />
      <SkillCategory
        label="Strategic"
        skills={strategicSkills}
        isVisible={isVisible}
        baseDelay={200 + technicalSkills.length * 100 + clinicalSkills.length * 100 + 200}
      />
    </section>
  )
}
