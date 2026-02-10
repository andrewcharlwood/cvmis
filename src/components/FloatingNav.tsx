import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { useActiveSection } from '@/hooks/useActiveSection'

interface NavLink {
  id: string
  label: string
}

const navLinks: NavLink[] = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export function FloatingNav() {
  const activeSection = useActiveSection()

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <motion.nav
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-[600px] w-auto bg-white rounded-full py-2 px-6 shadow-md flex items-center gap-1 border border-border overflow-x-auto scrollbar-hide"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {navLinks.map((link) => {
        const isActive = activeSection === link.id
        
        return (
          <button
            key={link.id}
            onClick={() => scrollToSection(link.id)}
            className={`
              relative font-secondary text-[13px] font-medium py-1.5 px-3.5 rounded-full
              transition-colors duration-300 ease-out whitespace-nowrap
              ${isActive 
                ? 'text-teal font-semibold' 
                : 'text-muted hover:text-teal hover:bg-teal-light'
              }
            `}
          >
            {link.label}
            {isActive && (
              <motion.span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal"
                layoutId="navIndicator"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              />
            )}
          </button>
        )
      })}
    </motion.nav>
  )
}
