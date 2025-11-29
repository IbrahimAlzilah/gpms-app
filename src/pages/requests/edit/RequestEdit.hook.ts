import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { UpdateRequestInput, Request } from '../schema'
import { getRequestById, updateRequest } from '@/services/requests.service'

export function useRequestEdit(requestId: string) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [request, setRequest] = useState<Request | null>(null)

  useEffect(() => {
    if (requestId) {
      loadRequest()
    }
  }, [requestId])

  const loadRequest = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getRequestById(requestId)
      setRequest(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الطلب')
    } finally {
      setIsLoading(false)
    }
  }

  const updateRequestData = async (data: UpdateRequestInput): Promise<Request> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const updated = await updateRequest(requestId, data)
      setRequest(updated)
      setIsLoading(false)
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحديث الطلب')
      setIsLoading(false)
      throw err
    }
  }

  return {
    request,
    updateRequest: updateRequestData,
    isLoading,
    error,
    refetch: loadRequest
  }
}

