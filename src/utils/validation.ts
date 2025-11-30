/**
 * Validation utility functions
 */

import { z } from 'zod'
import { FormErrors } from '@/types/common'

/**
 * Validate form data against Zod schema
 */
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: FormErrors } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const errors: FormErrors = {}
  result.error.errors.forEach((error) => {
    const path = error.path.join('.')
    errors[path] = error.message
  })
  
  return { success: false, errors }
}

/**
 * Validate single field against Zod schema
 */
export function validateField<T>(
  schema: z.ZodSchema<T>,
  fieldName: string,
  value: unknown
): string | null {
  try {
    // Create a schema for just this field
    const fieldSchema = schema.shape?.[fieldName as keyof typeof schema.shape]
    if (!fieldSchema) return null
    
    const result = (fieldSchema as z.ZodSchema).safeParse(value)
    if (result.success) return null
    
    return result.error.errors[0]?.message || null
  } catch {
    return null
  }
}

/**
 * Format Zod error message for display
 */
export function formatZodError(error: z.ZodError): FormErrors {
  const errors: FormErrors = {}
  error.errors.forEach((err) => {
    const path = err.path.join('.')
    errors[path] = err.message
  })
  return errors
}

/**
 * Common validation patterns
 */
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[0-9\s\-\(\)]{10,}$/,
  url: /^https?:\/\/.+/,
  arabicText: /^[\u0600-\u06FF\s]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/
}

/**
 * Common validation messages (Arabic)
 */
export const validationMessages = {
  required: 'هذا الحقل مطلوب',
  email: 'البريد الإلكتروني غير صحيح',
  phone: 'رقم الهاتف غير صحيح',
  minLength: (min: number) => `يجب أن يكون طول النص ${min} أحرف على الأقل`,
  maxLength: (max: number) => `يجب أن يكون طول النص ${max} أحرف كحد أقصى`,
  min: (min: number) => `القيمة يجب أن تكون ${min} على الأقل`,
  max: (max: number) => `القيمة يجب أن تكون ${max} كحد أقصى`,
  pattern: 'التنسيق غير صحيح',
  dateFuture: 'التاريخ يجب أن يكون في المستقبل',
  datePast: 'التاريخ يجب أن يكون في الماضي'
}

/**
 * Create a required string schema with custom message
 */
export function requiredString(message?: string) {
  return z.string().min(1, message || validationMessages.required)
}

/**
 * Create an optional string schema
 */
export function optionalString() {
  return z.string().optional()
}

/**
 * Create email schema
 */
export function emailSchema(message?: string) {
  return z.string().email(message || validationMessages.email)
}

/**
 * Create phone schema
 */
export function phoneSchema(message?: string) {
  return z.string().regex(validationPatterns.phone, message || validationMessages.phone)
}

/**
 * Create date schema that must be in future
 */
export function futureDateSchema(message?: string) {
  return z.string().refine(
    (date) => {
      const dateObj = new Date(date)
      return dateObj.getTime() > Date.now()
    },
    { message: message || validationMessages.dateFuture }
  )
}

/**
 * Create date schema that must be in past
 */
export function pastDateSchema(message?: string) {
  return z.string().refine(
    (date) => {
      const dateObj = new Date(date)
      return dateObj.getTime() < Date.now()
    },
    { message: message || validationMessages.datePast }
  )
}

