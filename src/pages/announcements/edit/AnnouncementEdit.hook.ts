import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { UpdateAnnouncementInput, Announcement } from '../schema'
import { getAnnouncementById, updateAnnouncement } from '@/services/announcements.service'

export function useAnnouncementEdit(announcementId: string) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)

  useEffect(() => {
    if (announcementId) {
      loadAnnouncement()
    }
  }, [announcementId])

  const loadAnnouncement = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAnnouncementById(announcementId)
      setAnnouncement(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الإعلان')
    } finally {
      setIsLoading(false)
    }
  }

  const updateAnnouncementData = async (data: UpdateAnnouncementInput): Promise<Announcement> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const updated = await updateAnnouncement(announcementId, data)
      setAnnouncement(updated)
      setIsLoading(false)
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحديث الإعلان')
      setIsLoading(false)
      throw err
    }
  }

  return {
    announcement,
    updateAnnouncement: updateAnnouncementData,
    isLoading,
    error,
    refetch: loadAnnouncement
  }
}

