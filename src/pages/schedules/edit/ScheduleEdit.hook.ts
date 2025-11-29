import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { UpdateScheduleInput, Schedule } from '../schema'
import { getScheduleById, updateSchedule } from '@/services/schedules.service'

export function useScheduleEdit(scheduleId: string) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [schedule, setSchedule] = useState<Schedule | null>(null)

  useEffect(() => {
    if (scheduleId) {
      loadSchedule()
    }
  }, [scheduleId])

  const loadSchedule = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getScheduleById(scheduleId)
      setSchedule(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الجدول')
    } finally {
      setIsLoading(false)
    }
  }

  const updateScheduleData = async (data: UpdateScheduleInput): Promise<Schedule> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const updated = await updateSchedule(scheduleId, data)
      setSchedule(updated)
      setIsLoading(false)
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحديث الجدول')
      setIsLoading(false)
      throw err
    }
  }

  return {
    schedule,
    updateSchedule: updateScheduleData,
    isLoading,
    error,
    refetch: loadSchedule
  }
}

