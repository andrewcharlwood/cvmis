import { motion } from 'framer-motion'

interface VitalCardProps {
  value: string
  label: string
  valueSize?: 'default' | 'small' | 'medium'
  delay?: number
}

function VitalCard({ value, label, valueSize = 'default', delay = 0 }: VitalCardProps) {
  const sizeClasses = {
    default: 'text-[28px]',
    small: 'text-base',
    medium: 'text-lg'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="bg-card-bg rounded-2xl px-6 py-5 shadow-sm border-t-[3px] border-teal min-w-[160px] text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className={`font-primary font-bold text-heading leading-tight ${sizeClasses[valueSize]}`}>
        {value}
      </div>
      <div className="font-secondary text-[11px] uppercase tracking-wide text-muted mt-1">
        {label}
      </div>
    </motion.div>
  )
}

export function Hero() {
  return (
    <section 
      id="about" 
      className="min-h-screen flex flex-col justify-center items-center text-center py-20"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="font-primary font-bold text-heading leading-tight"
        style={{ fontSize: 'clamp(36px, 5vw, 52px)' }}
      >
        Andy Charlwood
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-muted text-base mt-2"
      >
        Deputy Head of Population Health &amp; Data Analysis
      </motion.p>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="inline-block mt-1 px-4 py-1 border border-teal rounded-full text-xs text-teal font-medium"
      >
        Norwich, UK
      </motion.span>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 max-w-[560px] text-text text-[15px] leading-[1.8]"
      >
        GPhC Registered Pharmacist specialising in medicines optimisation, population health analytics, and NHS efficiency programmes. Bridging clinical pharmacy with data science to drive meaningful improvements in patient outcomes.
      </motion.p>

      <div className="flex gap-4 mt-10 justify-center flex-wrap">
        <VitalCard value="10+" label="Years Experience" delay={0.4} />
        <VitalCard value="Python/SQL/BI" label="Analytics Stack" valueSize="small" delay={0.5} />
        <VitalCard value="Pop. Health" label="Focus Area" valueSize="medium" delay={0.6} />
        <VitalCard value="NHS N&W" label="System" valueSize="medium" delay={0.7} />
      </div>
    </section>
  )
}
