import { useState, useEffect } from 'react'

const MOBILE_NAV_QUERY = '(max-width: 599px)'

export function useIsMobileNav(): boolean {
  const [isMobileNav, setIsMobileNav] = useState(
    () => window.matchMedia(MOBILE_NAV_QUERY).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_NAV_QUERY)
    const handler = (e: MediaQueryListEvent) => setIsMobileNav(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isMobileNav
}
