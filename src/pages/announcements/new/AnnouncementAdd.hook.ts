import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { CreateAnnouncementInput, Announcement } from '../schema'
import { createAnnouncement as createAnnouncementService } from '@/services/announcements.service'

export function useAnnouncementAdd() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createAnnouncement = async (data: CreateAnnouncementInput): Promise<Announcement> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newAnnouncement = await createAnnouncementService({
        ...data,
        createdBy: user?.name || user?.email || ''
      })
      setIsLoading(false)
      return newAnnouncement
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في إنشاء الإعلان')
      setIsLoading(false)
      throw err
    }
  }

  return {
    createAnnouncement,
    isLoading,
    error
  }
}

