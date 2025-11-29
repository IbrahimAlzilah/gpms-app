import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Evaluation } from './schema'
import { getEvaluations } from '@/services/evaluations.service'

export function useEvaluations() {
  const { user } = useAuth()
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEvaluations()
  }, [])

  const loadEvaluations = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getEvaluations()
      setEvaluations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل التقييمات')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    evaluations,
    isLoading,
    error,
    refetch: loadEvaluations
  }
}

