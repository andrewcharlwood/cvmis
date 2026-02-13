import { useState, useEffect, useCallback } from 'react'

interface UseScrollCondensationOptions {
  threshold?: number
  scrollContainer?: HTMLElement | null
}

export function useScrollCondensation(options: UseScrollCondensationOptions = {}) {
  const { threshold = 100, scrollContainer } = options
  const [isCondensed, setIsCondensed] = useState(false)

  const handleScroll = useCallback(() => {
    if (!scrollContainer) return
    setIsCondensed(scrollContainer.scrollTop >= threshold)
  }, [scrollContainer, threshold])

  useEffect(() => {
    if (!scrollContainer) return

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    // Check initial state
    handleScroll()

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [scrollContainer, handleScroll])

  return { isCondensed }
}
