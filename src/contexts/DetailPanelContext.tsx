import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react'
import { DetailPanelContent } from '@/types/pmr'

interface DetailPanelContextValue {
  content: DetailPanelContent | null
  openPanel: (content: DetailPanelContent) => void
  closePanel: () => void
  isOpen: boolean
  isClosing: boolean
}

const DetailPanelContext = createContext<DetailPanelContextValue | undefined>(
  undefined
)

interface DetailPanelProviderProps {
  children: ReactNode
}

export function DetailPanelProvider({ children }: DetailPanelProviderProps) {
  const [content, setContent] = useState<DetailPanelContent | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const closeTimerRef = useRef<number>(0)

  const openPanel = useCallback((newContent: DetailPanelContent) => {
    // If we're in the middle of closing, cancel it
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = 0
    }
    setIsClosing(false)
    setContent(newContent)
  }, [])

  const closePanel = useCallback(() => {
    setIsClosing(true)
    closeTimerRef.current = window.setTimeout(() => {
      setIsClosing(false)
      setContent(null)
      closeTimerRef.current = 0
    }, 250) // match panel-slide-out duration
  }, [])

  const isOpen = content !== null

  const value: DetailPanelContextValue = {
    content,
    openPanel,
    closePanel,
    isOpen,
    isClosing,
  }

  return (
    <DetailPanelContext.Provider value={value}>
      {children}
    </DetailPanelContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDetailPanel(): DetailPanelContextValue {
  const context = useContext(DetailPanelContext)
  if (!context) {
    throw new Error('useDetailPanel must be used within DetailPanelProvider')
  }
  return context
}
