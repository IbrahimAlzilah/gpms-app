import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { UpdateEvaluationInput, Evaluation } from '../schema'
import { getEvaluationById, updateEvaluation } from '@/services/evaluations.service'

export function useEvaluationEdit(evaluationId: string) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)

  useEffect(() => {
    if (evaluationId) {
      loadEvaluation()
    }
  }, [evaluationId])

  const loadEvaluation = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getEvaluationById(evaluationId)
      setEvaluation(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل التقييم')
    } finally {
      setIsLoading(false)
    }
  }

  const updateEvaluationData = async (data: UpdateEvaluationInput): Promise<Evaluation> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const updated = await updateEvaluation(evaluationId, data)
      setEvaluation(updated)
      setIsLoading(false)
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحديث التقييم')
      setIsLoading(false)
      throw err
    }
  }

  return {
    evaluation,
    updateEvaluation: updateEvaluationData,
    isLoading,
    error,
    refetch: loadEvaluation
  }
}

