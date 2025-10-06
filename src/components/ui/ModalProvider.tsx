import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

interface ModalStackContextValue {
  registerModal: () => number
  unregisterModal: () => void
  getZIndexFor: (localIndex: number) => number
  stackSize: number
}

const ModalStackContext = createContext<ModalStackContextValue | null>(null)

interface ModalProviderProps {
  children: React.ReactNode
  baseZIndex?: number
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children, baseZIndex = 1000 }) => {
  const [stackSize, setStackSize] = useState(0)
  const mountedRef = useRef(false)

  const registerModal = useCallback(() => {
    setStackSize(prev => prev + 1)
    return stackSize
  }, [stackSize])

  const unregisterModal = useCallback(() => {
    setStackSize(prev => Math.max(0, prev - 1))
  }, [])

  const getZIndexFor = useCallback((localIndex: number) => {
    return baseZIndex + localIndex * 2
  }, [baseZIndex])

  // Scroll lock while any modal open
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    if (stackSize > 0) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [stackSize])

  const value = useMemo(() => ({ registerModal, unregisterModal, getZIndexFor, stackSize }), [registerModal, unregisterModal, getZIndexFor, stackSize])

  return (
    <ModalStackContext.Provider value={value}>
      {children}
    </ModalStackContext.Provider>
  )
}

export function useModalStack() {
  return useContext(ModalStackContext)
}


