import { motion } from 'framer-motion'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import type { Experience as ExperienceType } from '@/types'

const experiences: ExperienceType[] = [
  {
    role: 'Interim Head of Population Health & Data Analysis',
    org: 'NHS Norfolk & Waveney ICB',
    date: 'May 2025 — Nov 2025',
    bullets: [
      'Led team through organisational transition, maintaining delivery of £14.6M efficiency programme',
      'Directed strategic priorities for population health analytics across Norfolk & Waveney (population ~1M)',
      'Managed stakeholder relationships with system leaders, provider trusts, and primary care networks',
    ],
    isCurrent: true,
  },
  {
    role: 'Deputy Head of Population Health & Data Analysis',
    org: 'NHS Norfolk & Waveney ICB',
    date: 'Jul 2024 — Present',
    bullets: [
      'Deputised for Head of department across all operational and strategic functions',
      'Oversaw £220M medicines budget and led programme of cost improvement initiatives',
      'Developed Python-based switching algorithm processing 14,000 patients, delivering £2.6M savings',
      'Built Blueteq automation system reducing processing time by 70%, saving 200+ hours annually',
      'Created PharMetrics dashboard platform for real-time medicines expenditure tracking',
    ],
    isCurrent: true,
  },
  {
    role: 'High-Cost Drugs & Interface Pharmacist',
    org: 'NHS Norfolk & Waveney ICB',
    date: 'May 2022 — Jul 2024',
    bullets: [
      'Managed high-cost drugs budget across acute and community settings',
      'Led NICE Technology Appraisal implementation and horizon scanning',
      'Developed health economic models for biosimilar switching programmes',
      'Built data pipelines for automated reporting of medicines expenditure',
    ],
    isCurrent: false,
  },
  {
    role: 'Pharmacy Manager',
    org: 'Tesco Pharmacy',
    date: 'Nov 2017 — May 2022',
    bullets: [
      'Managed community pharmacy delivering 3,000+ items monthly',
      'Pioneered asthma screening service generating £1M+ national revenue',
      'Led team of 6 through COVID-19 pandemic service delivery',
      'Completed Mary Seacole NHS Leadership Programme (2018)',
    ],
    isCurrent: false,
  },
  {
    role: 'Duty Pharmacy Manager',
    org: 'Tesco Pharmacy',
    date: 'Aug 2016 — Nov 2017',
    bullets: [
      'Supported pharmacy manager in daily operations and clinical services',
      'Delivered Medicines Use Reviews and New Medicine Service consultations',
      'Maintained controlled drug compliance and clinical governance standards',
    ],
    isCurrent: false,
  },
]

const ECGDecoration = () => (
  <svg
    className="shrink-0 w-[120px] xs:w-[200px] h-[30px]"
    viewBox="0 0 200 30"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M 0 15 L 40 15 L 50 15 C 53 15 55 12 58 12 C 61 12 63 15 66 15 L 76 15 L 80 20 L 86 2 L 92 22 L 96 15 L 106 15 C 109 15 111 11 114 11 C 117 11 120 15 123 15 L 200 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-teal opacity-30"
    />
  </svg>
)

const TimelineEntry = ({
  experience,
  index,
  isVisible,
}: {
  experience: ExperienceType
  index: number
  isVisible: boolean
}) => {
  return (
    <motion.div
      className="relative pl-0 md:pl-[calc(20%+32px)] mb-8 last:mb-0"
      initial={{ opacity: 0, y: 24 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        className={`absolute left-[20%] top-2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-2 border-teal bg-white z-10 hidden md:block ${
          experience.isCurrent ? 'bg-teal' : ''
        }`}
      />
      <motion.div
        className="bg-white rounded-2xl p-4 xs:p-6 shadow-sm border-l-[3px] border-transparent hover:shadow-md hover:scale-[1.01] hover:border-l-teal/30 transition-all duration-300"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="font-primary text-[17px] font-semibold text-heading leading-tight">
          {experience.role}
        </h3>
        <p className="font-primary text-sm text-teal mt-0.5">{experience.org}</p>
        <span className="inline-block px-2.5 py-0.5 mt-1.5 mb-3 bg-teal/8 rounded-full font-secondary text-xs text-teal font-medium">
          {experience.date}
        </span>
        <ul className="space-y-1">
          {experience.bullets.map((bullet, i) => (
            <li
              key={i}
              className="relative pl-4 text-sm text-text leading-relaxed before:content-[''] before:absolute before:left-0 before:top-[10px] before:w-[5px] before:h-[5px] before:rounded-full before:bg-teal"
            >
              {bullet}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  )
}

export function Experience() {
  const [sectionRef, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })

  return (
    <div
      id="experience"
      ref={sectionRef}
      className="py-12 xs:py-16 md:py-20 opacity-0 translate-y-6 transition-all duration-600 ease-out data-[visible=true]:opacity-100 data-[visible=true]:translate-y-0"
      data-visible={isVisible}
    >
      <div className="flex items-center justify-center gap-4 mb-8">
        <h2 className="font-primary text-2xl font-bold text-heading">Experience</h2>
        <ECGDecoration />
      </div>

      <div className="relative">
        <div className="absolute left-[20%] top-0 bottom-0 w-0.5 bg-teal/20 hidden md:block" />

        <div className="space-y-0">
          {experiences.map((exp, i) => (
            <TimelineEntry
              key={exp.role}
              experience={exp}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
