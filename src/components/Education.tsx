import { motion } from 'framer-motion'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import type { Education as EducationType } from '@/types'

const educationData: EducationType[] = [
  {
    degree: 'MPharm (Hons) Pharmacy',
    institution: 'University of East Anglia',
    period: '2011 — 2015',
    detail: 'Upper Second-Class Honours (2:1)',
  },
  {
    degree: 'Mary Seacole Leadership Programme',
    institution: 'NHS Leadership Academy',
    period: '2018',
    detail: 'National healthcare leadership development programme.',
  },
]

const EducationCard = ({
  education,
  delay,
  isVisible,
}: {
  education: EducationType
  delay: number
  isVisible: boolean
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="relative bg-white rounded-2xl p-6 shadow-sm overflow-hidden transition-shadow hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal to-coral" />
      <h3 className="font-primary text-[17px] font-semibold text-heading leading-tight">
        {education.degree}
      </h3>
      <p className="text-sm text-teal mt-0.5">{education.institution}</p>
      <p className="text-[13px] text-muted mt-0.5">{education.period}</p>
      <p className="text-sm text-text mt-1.5 leading-relaxed">
        {education.detail}
      </p>
    </motion.div>
  )
}

export function Education() {
  const [sectionRef, isVisible] = useScrollReveal<HTMLElement>({
    threshold: 0.1,
  })

  return (
    <section id="education" ref={sectionRef} className="py-12 xs:py-16 md:py-20">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5 }}
        className="font-primary text-2xl font-bold text-heading text-center mb-8"
      >
        Education
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {educationData.map((education, index) => (
          <EducationCard
            key={education.degree}
            education={education}
            delay={0.1 + index * 0.1}
            isVisible={isVisible}
          />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-[13px] text-muted text-center mt-5"
      >
        A-Levels: Mathematics (A*), Chemistry (B), Politics (C)
      </motion.p>
    </section>
  )
}
