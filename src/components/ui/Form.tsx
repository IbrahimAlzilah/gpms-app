import React from 'react'
import { cn } from '../../lib/utils'

interface FormProps {
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
  className?: string
}

interface FormGroupProps {
  children: React.ReactNode
  className?: string
}

interface FormLabelProps {
  children: React.ReactNode
  htmlFor?: string
  required?: boolean
  className?: string
}

interface FormErrorProps {
  children: React.ReactNode
  className?: string
}

interface FormHelperTextProps {
  children: React.ReactNode
  className?: string
}

const Form: React.FC<FormProps> = ({ children, onSubmit, className }) => {
  return (
    <form onSubmit={onSubmit} className={cn('space-y-6', className)}>
      {children}
    </form>
  )
}

const FormGroup: React.FC<FormGroupProps> = ({ children, className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  )
}

const FormLabel: React.FC<FormLabelProps> = ({ 
  children, 
  htmlFor, 
  required = false, 
  className 
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'block text-sm font-medium text-gray-700',
        className
      )}
    >
      {children}
      {required && <span className="text-red-500 mr-1 rtl:mr-0 rtl:ml-1">*</span>}
    </label>
  )
}

const FormError: React.FC<FormErrorProps> = ({ children, className }) => {
  return (
    <p className={cn('text-sm text-red-600', className)}>
      {children}
    </p>
  )
}

const FormHelperText: React.FC<FormHelperTextProps> = ({ children, className }) => {
  return (
    <p className={cn('text-sm text-gray-500', className)}>
      {children}
    </p>
  )
}

export { Form, FormGroup, FormLabel, FormError, FormHelperText }
