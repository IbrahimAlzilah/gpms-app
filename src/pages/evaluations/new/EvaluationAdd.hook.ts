import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { CreateEvaluationInput, Evaluation } from '../schema'
import { createEvaluation } from '@/services/evaluations.service'

export function useEvaluationAdd() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createEvaluationData = async (data: CreateEvaluationInput): Promise<Evaluation> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newEvaluation = await createEvaluation(data)
      setIsLoading(false)
      return newEvaluation
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في إنشاء التقييم')
      setIsLoading(false)
      throw err
    }
  }

  return {
    createEvaluation: createEvaluationData,
    isLoading,
    error
  }
}

