import React, { useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/utils'
import { useModalStack } from './ModalProvider'
import Button from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  footer?: React.ReactNode
  actions?: React.ReactNode
  disableOverlayClose?: boolean
  disableEscClose?: boolean
  onSubmit?: (e?: React.FormEvent) => void
  customButtons?: React.ReactNode[]
}

const Modal: React.FC<ModalProps> = React.memo(({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
  footer,
  actions,
  disableOverlayClose,
  disableEscClose,
  onSubmit,
  customButtons
}) => {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  const stack = useModalStack()
  const localIndexRef = useRef<number>(0)
  const zIndexOverlay = useMemo(() => {
    const idx = stack ? stack.registerModal() : 0
    localIndexRef.current = idx
    return stack ? stack.getZIndexFor(idx) : 999
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !disableEscClose) {
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (stack) stack.unregisterModal()
    }
  }, [disableEscClose, onClose, stack])

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center p-4 mt-0 overflow-y-auto" style={{ zIndex: zIndexOverlay }} role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={disableOverlayClose ? undefined : onClose}
      />
      <div
        className={cn(
          'relative bg-white rounded-xl shadow-xl w-full',
          sizes[size],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {onSubmit ? (
          <form onSubmit={onSubmit} className="p-4">
            {children}
            {/* If caller uses onSubmit but wants custom buttons, they can pass customButtons */}
          </form>
        ) : (
          <div className="p-4">
            {children}
          </div>
        )}
        {(footer || actions || onSubmit || (customButtons && customButtons.length > 0)) && (
          <div className="flex items-center justify-end gap-2 p-4 pt-0">
            {footer || actions || (
              <>
                {customButtons && customButtons.length > 0 ? (
                  <>{customButtons.map((btn, idx) => <span key={idx}>{btn}</span>)}</>
                ) : (
                  onSubmit && (
                    <>
                      <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
                      <Button type="submit">حفظ</Button>
                    </>
                  )
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )

  const portalTarget = typeof document !== 'undefined' ? document.body : null
  return portalTarget ? createPortal(modalContent, portalTarget) : modalContent
})

export default Modal
