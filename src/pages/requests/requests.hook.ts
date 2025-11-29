import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Request } from './schema'
import { getRequests } from '@/services/requests.service'

export function useRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getRequests()
      setRequests(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الطلبات')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    requests,
    isLoading,
    error,
    refetch: loadRequests
  }
}

