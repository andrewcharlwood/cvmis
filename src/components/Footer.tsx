import { motion } from 'framer-motion'

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center pt-8 xs:pt-12 pb-6 xs:pb-8 border-t border-slate-200"
    >
      <svg
        className="block mx-auto mb-3"
        width="120"
        height="20"
        viewBox="0 0 120 20"
        fill="none"
      >
        <path
          d="M 0 10 L 35 10 L 40 10 C 42 10 43 7 45 7 C 47 7 48 10 50 10 L 54 10 L 56 13 L 60 2 L 64 15 L 66 10 L 70 10 C 72 10 73 7 75 7 C 77 7 78 10 80 10 L 120 10"
          stroke="#00897B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
          fill="none"
        />
      </svg>
      <p className="font-secondary text-xs text-muted">
        Andy Charlwood &mdash; MPharm, GPhC Registered Pharmacist
      </p>
    </motion.footer>
  )
}

export { Footer }
