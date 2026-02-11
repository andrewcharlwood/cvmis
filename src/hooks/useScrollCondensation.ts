import { useState, useEffect, useRef } from 'react'

interface UseScrollCondensationOptions {
  threshold?: number
}

export function useScrollCondensation(options: UseScrollCondensationOptions = {}) {
  const { threshold = 100 } = options
  const [isCondensed, setIsCondensed] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsCondensed(!entry.isIntersecting)
      },
      {
        rootMargin: `-${threshold}px 0px 0px 0px`,
        threshold: 0,
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [threshold])

  return { isCondensed, sentinelRef }
}
