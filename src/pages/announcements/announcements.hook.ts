import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Announcement } from './schema'
import { getAnnouncements } from '@/services/announcements.service'

export function useAnnouncements() {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const loadAnnouncements = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAnnouncements()
      setAnnouncements(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الإعلانات')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    announcements,
    isLoading,
    error,
    refetch: loadAnnouncements
  }
}

