import { useState, useEffect } from 'react'

type Breakpoint = 'mobile' | 'tablet' | 'desktop'

interface BreakpointState {
  breakpoint: Breakpoint
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

export function useBreakpoint(): BreakpointState {
  const [state, setState] = useState<BreakpointState>(() => {
    if (typeof window === 'undefined') {
      return { breakpoint: 'desktop', isMobile: false, isTablet: false, isDesktop: true }
    }
    const width = window.innerWidth
    if (width < 768) {
      return { breakpoint: 'mobile', isMobile: true, isTablet: false, isDesktop: false }
    }
    if (width < 1024) {
      return { breakpoint: 'tablet', isMobile: false, isTablet: true, isDesktop: false }
    }
    return { breakpoint: 'desktop', isMobile: false, isTablet: false, isDesktop: true }
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      let breakpoint: Breakpoint
      let isMobile: boolean
      let isTablet: boolean
      let isDesktop: boolean

      if (width < 768) {
        breakpoint = 'mobile'
        isMobile = true
        isTablet = false
        isDesktop = false
      } else if (width < 1024) {
        breakpoint = 'tablet'
        isMobile = false
        isTablet = true
        isDesktop = false
      } else {
        breakpoint = 'desktop'
        isMobile = false
        isTablet = false
        isDesktop = true
      }

      setState({ breakpoint, isMobile, isTablet, isDesktop })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return state
}
