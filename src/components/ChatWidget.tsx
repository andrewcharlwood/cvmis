import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const buttonVariants = {
  hidden: prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.3, ease: 'easeOut', delay: 1 },
  },
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Chat panel placeholder — wired in US-008 */}
      <AnimatePresence>
        {isOpen && null}
      </AnimatePresence>

      {/* Floating chat button */}
      <motion.button
        initial="hidden"
        animate="visible"
        variants={buttonVariants}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="fixed z-[90] cursor-pointer bottom-4 right-4 h-10 w-10 sm:bottom-6 sm:right-6 sm:h-12 sm:w-12"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: 'none',
          background: 'var(--accent)',
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-md)',
          transition: 'box-shadow 150ms ease-out, transform 150ms ease-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {isOpen ? <X size={20} strokeWidth={2} /> : <MessageCircle size={20} strokeWidth={2} />}
      </motion.button>
    </>
  )
}
