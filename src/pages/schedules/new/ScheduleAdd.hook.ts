import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { CreateScheduleInput, Schedule } from '../schema'
import { createSchedule } from '@/services/schedules.service'

export function useScheduleAdd() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createScheduleData = async (data: CreateScheduleInput): Promise<Schedule> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newSchedule = await createSchedule(data)
      setIsLoading(false)
      return newSchedule
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في إنشاء الجدول')
      setIsLoading(false)
      throw err
    }
  }

  return {
    createSchedule: createScheduleData,
    isLoading,
    error
  }
}

