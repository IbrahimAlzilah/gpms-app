import { useState, useEffect } from 'react'
import { SupervisionRequest } from './schema'
import { getSupervisorRequests } from '@/services/supervisor-requests.service'
import { useAuth } from '@/context/AuthContext'

export function useSupervisorRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<SupervisionRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id && user?.role === 'supervisor') {
      loadRequests()
    }
  }, [user])

  const loadRequests = async () => {
    if (!user?.id) return
    
    setIsLoading(true)
    setError(null)
    try {
      const data = await getSupervisorRequests(user.id)
      setRequests(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل الطلبات')
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = () => {
    loadRequests()
  }

  return {
    requests,
    isLoading,
    error,
    refetch
  }
}

