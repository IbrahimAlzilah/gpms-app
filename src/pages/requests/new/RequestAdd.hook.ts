import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { CreateRequestInput, Request } from '../schema'
import { createRequest as createRequestService } from '@/services/requests.service'

export function useRequestAdd() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createRequest = async (data: CreateRequestInput): Promise<Request> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newRequest = await createRequestService({
        ...data,
        status: 'pending',
        student: user?.name || user?.email || '',
        studentId: user?.id || ''
      })
      setIsLoading(false)
      return newRequest
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في إنشاء الطلب')
      setIsLoading(false)
      throw err
    }
  }

  return {
    createRequest,
    isLoading,
    error
  }
}

