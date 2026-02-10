import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import type { Project as ProjectType } from '@/types'

const projectsData: ProjectType[] = [
  {
    title: 'PharMetrics',
    description:
      'Real-time medicines expenditure dashboard providing actionable analytics for NHS decision-makers.',
    link: 'https://medicines.charlwood.xyz/',
  },
  {
    title: 'Patient Pathway Analysis',
    description:
      'Data-driven analysis of patient pathways to identify optimisation opportunities and improve clinical outcomes.',
  },
  {
    title: 'Blueteq Generator',
    description:
      'Automation tool reducing high-cost drug approval processing time by 70%, saving 200+ hours annually.',
  },
  {
    title: 'NMS Video',
    description:
      'Educational video resource supporting New Medicine Service consultations, improving patient engagement.',
  },
]

const ProjectCard = ({
  project,
  delay,
  isVisible,
}: {
  project: ProjectType
  delay: number
  isVisible: boolean
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="group relative bg-white rounded-2xl p-6 shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div
        className="absolute inset-0 rounded-2xl p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, #00897B, #FF6B6B)',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      <h3 className="font-primary text-base font-semibold text-heading leading-tight">
        {project.title}
      </h3>
      <p className="text-sm text-text leading-relaxed mt-2">
        {project.description}
      </p>
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 bg-teal text-white rounded-full text-xs font-medium font-secondary transition-all hover:bg-[#00796B] hover:-translate-y-px"
        >
          Visit Project
          <ExternalLink size={12} />
        </a>
      )}
    </motion.div>
  )
}

export function Projects() {
  const [sectionRef, isVisible] = useScrollReveal<HTMLElement>({
    threshold: 0.1,
  })

  return (
    <section id="projects" ref={sectionRef} className="py-20">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5 }}
        className="font-primary text-2xl font-bold text-heading text-center mb-8"
      >
        Projects
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projectsData.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            delay={0.1 + index * 0.1}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  )
}
