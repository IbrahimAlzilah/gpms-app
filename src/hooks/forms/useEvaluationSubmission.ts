import { useState, useCallback } from 'react'

export interface EvaluationCriterion {
  id: string
  name: string
  maxScore: number
  category: string
}

export interface EvaluationData {
  scores: Record<string, number>
  notes: string
  overallComment: string
  criteria: EvaluationCriterion[]
}

export interface EvaluationSubmissionResult {
  success: boolean
  message: string
  evaluationId?: string
  totalScore?: number
  grade?: string
}

export const useEvaluationSubmission = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const defaultCriteria: EvaluationCriterion[] = [
    { id: 'innovation', name: 'الابتكار والأصالة', maxScore: 20, category: 'innovation' },
    { id: 'methodology', name: 'المنهجية والتصميم', maxScore: 20, category: 'technical' },
    { id: 'implementation', name: 'التنفيذ والجودة التقنية', maxScore: 25, category: 'technical' },
    { id: 'results', name: 'النتائج والتحليل', maxScore: 20, category: 'analysis' },
    { id: 'presentation', name: 'العرض والتوثيق', maxScore: 15, category: 'presentation' }
  ]

  const finalEvaluationCriteria: EvaluationCriterion[] = [
    { id: 'project_quality', name: 'جودة المشروع', maxScore: 30, category: 'quality' },
    { id: 'presentation_skills', name: 'مهارات العرض', maxScore: 25, category: 'presentation' },
    { id: 'defense_ability', name: 'القدرة على الدفاع', maxScore: 25, category: 'defense' },
    { id: 'answers_quality', name: 'جودة الإجابات', maxScore: 20, category: 'answers' }
  ]

  const validateEvaluationData = useCallback((data: EvaluationData, criteria: EvaluationCriterion[]): string | null => {
    // Check if all criteria have scores
    for (const criterion of criteria) {
      if (data.scores[criterion.id] === undefined || data.scores[criterion.id] === null) {
        return `الدرجة مطلوبة لمعيار ${criterion.name}`
      }
      if (data.scores[criterion.id] < 0 || data.scores[criterion.id] > criterion.maxScore) {
        return `الدرجة لمعيار ${criterion.name} يجب أن تكون بين 0 و ${criterion.maxScore}`
      }
    }

    // Check if notes are provided
    if (!data.notes.trim()) {
      return 'الملاحظات التوضيحية مطلوبة'
    }

    return null
  }, [])

  const calculateTotalScore = useCallback((scores: Record<string, number>): number => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0)
  }, [])

  const calculateGrade = useCallback((totalScore: number, maxScore: number): string => {
    const percentage = (totalScore / maxScore) * 100
    
    if (percentage >= 95) return 'ممتاز'
    if (percentage >= 90) return 'جيد جداً'
    if (percentage >= 80) return 'جيد'
    if (percentage >= 70) return 'مقبول'
    if (percentage >= 60) return 'ضعيف'
    return 'راسب'
  }, [])

  const submitEvaluation = useCallback(async (
    data: EvaluationData, 
    projectId: string, 
    studentId: string,
    evaluatorId: string,
    evaluationType: 'project' | 'final' = 'project'
  ): Promise<EvaluationSubmissionResult> => {
    setIsLoading(true)
    setError(null)

    try {
      const criteria = evaluationType === 'final' ? finalEvaluationCriteria : defaultCriteria
      
      // Validate evaluation data
      const validationError = validateEvaluationData(data, criteria)
      if (validationError) {
        setError(validationError)
        return { success: false, message: validationError }
      }

      // Calculate total score and grade
      const totalScore = calculateTotalScore(data.scores)
      const maxScore = criteria.reduce((sum, criterion) => sum + criterion.maxScore, 0)
      const grade = calculateGrade(totalScore, maxScore)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      const evaluationId = `EVAL-${Date.now()}`
      const message = evaluationType === 'final' 
        ? 'تم حفظ التقييم النهائي بنجاح'
        : 'تم حفظ تقييم المشروع بنجاح'

      return {
        success: true,
        message,
        evaluationId,
        totalScore,
        grade
      }

    } catch (error) {
      const errorMessage = 'حدث خطأ أثناء حفظ التقييم'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [validateEvaluationData, calculateTotalScore, calculateGrade])

  const getScoreColor = useCallback((score: number, maxScore: number): string => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }, [])

  const getGradeColor = useCallback((grade: string): string => {
    const gradeColors = {
      'ممتاز': 'text-green-600 bg-green-100',
      'جيد جداً': 'text-blue-600 bg-blue-100',
      'جيد': 'text-yellow-600 bg-yellow-100',
      'مقبول': 'text-orange-600 bg-orange-100',
      'ضعيف': 'text-red-600 bg-red-100',
      'راسب': 'text-red-800 bg-red-200'
    }
    return gradeColors[grade as keyof typeof gradeColors] || 'text-gray-600 bg-gray-100'
  }, [])

  const getCategoryScores = useCallback((scores: Record<string, number>, criteria: EvaluationCriterion[]) => {
    const categories: Record<string, { total: number, max: number, count: number }> = {}
    
    criteria.forEach(criterion => {
      if (!categories[criterion.category]) {
        categories[criterion.category] = { total: 0, max: 0, count: 0 }
      }
      categories[criterion.category].total += scores[criterion.id] || 0
      categories[criterion.category].max += criterion.maxScore
      categories[criterion.category].count += 1
    })

    return categories
  }, [])

  return {
    isLoading,
    error,
    submitEvaluation,
    getScoreColor,
    getGradeColor,
    getCategoryScores,
    defaultCriteria,
    finalEvaluationCriteria,
    calculateTotalScore,
    calculateGrade
  }
}


