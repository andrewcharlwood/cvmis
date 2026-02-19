import { useState, useEffect } from 'react'

const TABLET_QUERY = '(max-width: 767px)'

export function useIsTabletOrBelow(): boolean {
  const [isTablet, setIsTablet] = useState(
    () => window.matchMedia(TABLET_QUERY).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(TABLET_QUERY)
    const handler = (e: MediaQueryListEvent) => setIsTablet(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isTablet
}
