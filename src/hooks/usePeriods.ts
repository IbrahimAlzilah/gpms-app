import { useState, useEffect } from 'react'
import { Period, PeriodType, checkPeriodStatus } from '@/services/periods.service'

export function usePeriods() {
  const [periods, setPeriods] = useState<Period[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPeriods()
  }, [])

  const loadPeriods = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { getPeriods } = await import('@/services/periods.service')
      const data = await getPeriods()
      setPeriods(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل الفترات')
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = () => {
    loadPeriods()
  }

  return {
    periods,
    isLoading,
    error,
    refetch
  }
}

export function usePeriodStatus(type: PeriodType) {
  const [isOpen, setIsOpen] = useState(false)
  const [period, setPeriod] = useState<Period | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStatus()
  }, [type])

  const loadStatus = async () => {
    setIsLoading(true)
    try {
      const status = await checkPeriodStatus(type)
      setIsOpen(status.isOpen)
      setPeriod(status.period)
    } catch (error) {
      console.error('Error checking period status:', error)
      setIsOpen(false)
      setPeriod(null)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isOpen,
    period,
    isLoading,
    refetch: loadStatus
  }
}

