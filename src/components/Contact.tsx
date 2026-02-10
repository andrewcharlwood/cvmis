import { motion } from 'framer-motion'
import { Phone, Mail, Linkedin, MapPin } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import type { ContactItem } from '@/types'

const contactData: ContactItem[] = [
  {
    icon: 'phone',
    value: '07795553088',
    label: 'Phone',
  },
  {
    icon: 'mail',
    value: 'andy@charlwood.xyz',
    label: 'Email',
    href: 'mailto:andy@charlwood.xyz',
  },
  {
    icon: 'linkedin',
    value: 'linkedin.com/in/andrewcharlwood',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/andrewcharlwood',
  },
  {
    icon: 'mapPin',
    value: 'Norwich, UK',
    label: 'Location',
  },
]

const iconMap = {
  phone: Phone,
  mail: Mail,
  linkedin: Linkedin,
  mapPin: MapPin,
}

const ContactItemCard = ({
  item,
  delay,
  isVisible,
}: {
  item: ContactItem
  delay: number
  isVisible: boolean
}) => {
  const Icon = iconMap[item.icon]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="text-center"
    >
      <div className="w-10 h-10 rounded-full bg-[rgba(0,137,123,0.08)] flex items-center justify-center mx-auto mb-2 text-teal">
        <Icon size={18} />
      </div>
      <div className="font-secondary text-[13px] text-heading break-words">
        {item.href ? (
          <a
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-teal hover:text-[#00796B] transition-colors"
          >
            {item.value}
          </a>
        ) : (
          item.value
        )}
      </div>
      <div className="font-secondary text-[10px] uppercase tracking-wider text-muted mt-0.5">
        {item.label}
      </div>
    </motion.div>
  )
}

export function Contact() {
  const [sectionRef, isVisible] = useScrollReveal<HTMLElement>({
    threshold: 0.1,
  })

  return (
    <section id="contact" ref={sectionRef} className="py-12 xs:py-16 md:py-20">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5 }}
        className="font-primary text-2xl font-bold text-heading text-center mb-8"
      >
        Contact
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {contactData.map((item, index) => (
          <ContactItemCard
            key={item.label}
            item={item}
            delay={0.1 + index * 0.1}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  )
}
