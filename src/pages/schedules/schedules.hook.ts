import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Schedule } from './schema'
import { getSchedules } from '@/services/schedules.service'

export function useSchedules() {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSchedules()
  }, [])

  const loadSchedules = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getSchedules()
      setSchedules(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الجداول')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    schedules,
    isLoading,
    error,
    refetch: loadSchedules
  }
}

