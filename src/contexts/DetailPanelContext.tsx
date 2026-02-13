import { createContext, useContext, useState, ReactNode } from 'react'
import { DetailPanelContent } from '@/types/pmr'

interface DetailPanelContextValue {
  content: DetailPanelContent | null
  openPanel: (content: DetailPanelContent) => void
  closePanel: () => void
  isOpen: boolean
}

const DetailPanelContext = createContext<DetailPanelContextValue | undefined>(
  undefined
)

interface DetailPanelProviderProps {
  children: ReactNode
}

export function DetailPanelProvider({ children }: DetailPanelProviderProps) {
  const [content, setContent] = useState<DetailPanelContent | null>(null)

  const openPanel = (newContent: DetailPanelContent) => {
    setContent(newContent)
  }

  const closePanel = () => {
    setContent(null)
  }

  const isOpen = content !== null

  const value: DetailPanelContextValue = {
    content,
    openPanel,
    closePanel,
    isOpen,
  }

  return (
    <DetailPanelContext.Provider value={value}>
      {children}
    </DetailPanelContext.Provider>
  )
}

export function useDetailPanel(): DetailPanelContextValue {
  const context = useContext(DetailPanelContext)
  if (!context) {
    throw new Error('useDetailPanel must be used within DetailPanelProvider')
  }
  return context
}
