import { useState, useCallback } from 'react'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export interface FormErrors {
  [key: string]: string
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<FormErrors>({})

  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = rules[name]
    if (!rule) return null

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return 'هذا الحقل مطلوب'
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      return null
    }

    // Min length validation
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return `يجب أن يكون طول النص ${rule.minLength} أحرف على الأقل`
    }

    // Max length validation
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return `يجب أن يكون طول النص ${rule.maxLength} أحرف كحد أقصى`
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return 'تنسيق غير صحيح'
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value)
    }

    return null
  }, [rules])

  const validateForm = useCallback((data: Record<string, any>): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    Object.keys(rules).forEach(field => {
      const error = validateField(field, data[field])
      if (error) {
        newErrors[field] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [validateField])

  const validateFieldOnChange = useCallback((name: string, value: any) => {
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }))
  }, [validateField])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }, [])

  const clearFieldError = useCallback((name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }, [])

  return {
    errors,
    validateForm,
    validateField,
    validateFieldOnChange,
    clearErrors,
    setFieldError,
    clearFieldError
  }
}

// Common validation rules
export const commonValidationRules = {
  title: {
    required: true,
    minLength: 5,
    maxLength: 200
  },
  description: {
    required: true,
    minLength: 20,
    maxLength: 1000
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    pattern: /^[\+]?[0-9\s\-\(\)]{10,}$/
  },
  date: {
    required: true,
    custom: (value: string) => {
      if (!value) return null
      const date = new Date(value)
      const now = new Date()
      if (date < now) {
        return 'التاريخ يجب أن يكون في المستقبل'
      }
      return null
    }
  },
  score: {
    required: true,
    custom: (value: number) => {
      if (value < 0 || value > 100) {
        return 'الدرجة يجب أن تكون بين 0 و 100'
      }
      return null
    }
  }
}


