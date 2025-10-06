import React from 'react'
import Modal from './Modal'
import Button from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  title?: string
  description?: React.ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'destructive' | 'secondary'
  onConfirm: () => void
  onCancel: () => void
  disableOverlayClose?: boolean
  disableEscClose?: boolean
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = 'تأكيد العملية',
  description,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  variant = 'primary',
  onConfirm,
  onCancel,
  disableOverlayClose,
  disableEscClose
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="sm"
      disableOverlayClose={disableOverlayClose}
      disableEscClose={disableEscClose}
      actions={(
        <>
          <Button variant="outline" onClick={onCancel}>{cancelText}</Button>
          <Button variant={variant === 'destructive' ? 'destructive' : 'primary'} onClick={onConfirm}>
            {confirmText}
          </Button>
        </>
      )}
    >
      {typeof description === 'string' ? (
        <p className="text-gray-700">{description}</p>
      ) : (
        description
      )}
    </Modal>
  )
}

export default ConfirmDialog


