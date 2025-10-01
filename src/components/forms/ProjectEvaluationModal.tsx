import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../lib/utils'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Form, FormGroup, FormLabel, FormError } from '../ui/Form'
import Badge from '../ui/Badge'
import { useEvaluationSubmission } from '../../hooks/forms/useEvaluationSubmission'
import { 
  Star, 
  CheckCircle,
  AlertCircle,
  Save,
  XCircle,
  MessageSquare,
  Target,
  BookOpen,
  Code,
  Presentation
} from 'lucide-react'

interface EvaluationCriteria {
  id: string
  name: string
  description: string
  weight: number
  score: number
  maxScore: number
  category: 'technical' | 'presentation' | 'documentation' | 'innovation'
}

interface ProjectEvaluationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  projectData?: {
    id: string
    title: string
    student: string
    studentId: string
    supervisor: string
  }
}

const ProjectEvaluationModal: React.FC<ProjectEvaluationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projectData
}) => {
  const { t } = useLanguage()
  const { isLoading, error, submitEvaluation, defaultCriteria } = useEvaluationSubmission()
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [evaluationData, setEvaluationData] = useState({
    overallScore: 0,
    technicalScore: 0,
    presentationScore: 0,
    documentationScore: 0,
    innovationScore: 0,
    qualitativeNotes: '',
    strengths: '',
    areasForImprovement: '',
    recommendations: '',
    meetingNotes: '',
    nextSteps: ''
  })

  const [criteria, setCriteria] = useState<EvaluationCriteria[]>([
    {
      id: '1',
      name: 'جودة التصميم التقني',
      description: 'كفاءة التصميم المعماري والحلول التقنية المطبقة',
      weight: 25,
      score: 0,
      maxScore: 25,
      category: 'technical'
    },
    {
      id: '2',
      name: 'جودة الكود المصدري',
      description: 'وضوح الكود، التعليقات، والهيكلة',
      weight: 20,
      score: 0,
      maxScore: 20,
      category: 'technical'
    },
    {
      id: '3',
      name: 'وظائف النظام',
      description: 'اكتمال الوظائف المطلوبة وسلامة التشغيل',
      weight: 25,
      score: 0,
      maxScore: 25,
      category: 'technical'
    },
    {
      id: '4',
      name: 'جودة العرض التقديمي',
      description: 'وضوح العرض، التنظيم، والإجابة على الأسئلة',
      weight: 15,
      score: 0,
      maxScore: 15,
      category: 'presentation'
    },
    {
      id: '5',
      name: 'جودة الوثائق',
      description: 'اكتمال ووضوح الوثائق التقنية والتقرير النهائي',
      weight: 10,
      score: 0,
      maxScore: 10,
      category: 'documentation'
    },
    {
      id: '6',
      name: 'الابتكار والإبداع',
      description: 'الابتكار في الحلول والأفكار المطبقة',
      weight: 5,
      score: 0,
      maxScore: 5,
      category: 'innovation'
    }
  ])

  const handleScoreChange = (criteriaId: string, score: number) => {
    const updatedCriteria = criteria.map(c => 
      c.id === criteriaId ? { ...c, score: Math.min(Math.max(score, 0), c.maxScore) } : c
    )
    setCriteria(updatedCriteria)
    
    // Calculate category scores
    const technicalScore = updatedCriteria
      .filter(c => c.category === 'technical')
      .reduce((sum, c) => sum + c.score, 0)
    
    const presentationScore = updatedCriteria
      .filter(c => c.category === 'presentation')
      .reduce((sum, c) => sum + c.score, 0)
    
    const documentationScore = updatedCriteria
      .filter(c => c.category === 'documentation')
      .reduce((sum, c) => sum + c.score, 0)
    
    const innovationScore = updatedCriteria
      .filter(c => c.category === 'innovation')
      .reduce((sum, c) => sum + c.score, 0)
    
    const overallScore = technicalScore + presentationScore + documentationScore + innovationScore
    
    setEvaluationData(prev => ({
      ...prev,
      overallScore,
      technicalScore,
      presentationScore,
      documentationScore,
      innovationScore
    }))
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreGrade = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 95) return 'ممتاز'
    if (percentage >= 90) return 'جيد جداً'
    if (percentage >= 80) return 'جيد'
    if (percentage >= 70) return 'مقبول'
    if (percentage >= 60) return 'ضعيف'
    return 'راسب'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      const evaluationData = {
        scores: criteria.reduce((acc, criterion) => ({
          ...acc,
          [criterion.id]: criterion.score
        }), {}),
        notes: evaluationData.qualitativeNotes,
        overallComment: evaluationData.overallComment,
        criteria: criteria
      }

      const result = await submitEvaluation(
        evaluationData,
        projectData.id,
        projectData.studentId,
        'current-evaluator-id', // Current user ID
        'project'
      )
      
      if (result.success) {
        onSubmit({
          ...evaluationData,
          criteria,
          evaluationDate: new Date().toISOString().split('T')[0],
          evaluator: 'د. أحمد محمد', // Current user
          projectId: projectData.id,
          studentId: projectData.studentId,
          totalScore: result.totalScore,
          grade: result.grade
        })
        onClose()
        alert(`${result.message}\nالدرجة الكلية: ${result.totalScore}\nالتقدير: ${result.grade}`)
      } else {
        setErrors({ general: result.message })
      }
      
    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء حفظ التقييم' })
    }
  }

  const handleCancel = () => {
    setEvaluationData({
      overallScore: 0,
      technicalScore: 0,
      presentationScore: 0,
      documentationScore: 0,
      innovationScore: 0,
      qualitativeNotes: '',
      strengths: '',
      areasForImprovement: '',
      recommendations: '',
      meetingNotes: '',
      nextSteps: ''
    })
    setCriteria(prev => prev.map(c => ({ ...c, score: 0 })))
    setErrors({})
    onClose()
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return Code
      case 'presentation': return Presentation
      case 'documentation': return BookOpen
      case 'innovation': return Target
      default: return Star
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800'
      case 'presentation': return 'bg-green-100 text-green-800'
      case 'documentation': return 'bg-purple-100 text-purple-800'
      case 'innovation': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="تقييم المشروع"
      size="xl"
    >
      <div className="max-h-[80vh] overflow-y-auto">
        <Form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Project Information */}
            {projectData && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">معلومات المشروع</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">المشروع:</span>
                    <span className="font-medium mr-2 rtl:mr-0 rtl:ml-2">{projectData.title}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">الطالب:</span>
                    <span className="font-medium mr-2 rtl:mr-0 rtl:ml-2">{projectData.student}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">الرقم الجامعي:</span>
                    <span className="font-medium mr-2 rtl:mr-0 rtl:ml-2">{projectData.studentId}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">المشرف:</span>
                    <span className="font-medium mr-2 rtl:mr-0 rtl:ml-2">{projectData.supervisor}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Overall Score Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">الدرجة الإجمالية</h3>
                  <p className="text-sm text-gray-600">من أصل 100 نقطة</p>
                </div>
                <div className="text-right">
                  <div className={cn('text-3xl font-bold', getScoreColor(evaluationData.overallScore, 100))}>
                    {evaluationData.overallScore}
                  </div>
                  <div className="text-sm text-gray-600">
                    {getScoreGrade(evaluationData.overallScore, 100)}
                  </div>
                </div>
              </div>
            </div>

            {/* Evaluation Criteria */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">معايير التقييم الكمية</h3>
              
              {criteria.map((criterion) => {
                const CategoryIcon = getCategoryIcon(criterion.category)
                
                return (
                  <div key={criterion.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                          <CategoryIcon size={16} className="text-gray-600" />
                          <h4 className="font-medium text-gray-900">{criterion.name}</h4>
                          <Badge className={getCategoryColor(criterion.category)}>
                            {criterion.weight}%
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{criterion.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <label className="text-sm text-gray-600">الدرجة:</label>
                        <Input
                          type="number"
                          min="0"
                          max={criterion.maxScore}
                          value={criterion.score}
                          onChange={(e) => handleScoreChange(criterion.id, parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                        <span className="text-sm text-gray-600">/ {criterion.maxScore}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={cn(
                              'h-2 rounded-full transition-all duration-300',
                              criterion.score >= criterion.maxScore * 0.9 ? 'bg-green-500' :
                              criterion.score >= criterion.maxScore * 0.8 ? 'bg-blue-500' :
                              criterion.score >= criterion.maxScore * 0.7 ? 'bg-yellow-500' :
                              criterion.score >= criterion.maxScore * 0.6 ? 'bg-orange-500' :
                              'bg-red-500'
                            )}
                            style={{ width: `${(criterion.score / criterion.maxScore) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Category Scores Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-600">{evaluationData.technicalScore}</div>
                <div className="text-sm text-gray-600">تقني</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-600">{evaluationData.presentationScore}</div>
                <div className="text-sm text-gray-600">عرض</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-purple-600">{evaluationData.documentationScore}</div>
                <div className="text-sm text-gray-600">وثائق</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-orange-600">{evaluationData.innovationScore}</div>
                <div className="text-sm text-gray-600">ابتكار</div>
              </div>
            </div>

            {/* Qualitative Notes */}
            <FormGroup>
              <FormLabel htmlFor="qualitativeNotes" required>الملاحظات التوضيحية</FormLabel>
              <textarea
                id="qualitativeNotes"
                value={evaluationData.qualitativeNotes}
                onChange={(e) => setEvaluationData(prev => ({ ...prev, qualitativeNotes: e.target.value }))}
                placeholder="اكتب ملاحظاتك التوضيحية حول أداء الطالب..."
                rows={4}
                className={cn(
                  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent',
                  errors.qualitativeNotes && 'border-red-500'
                )}
              />
              {errors.qualitativeNotes && <FormError>{errors.qualitativeNotes}</FormError>}
            </FormGroup>

            {/* Strengths and Areas for Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <FormLabel htmlFor="strengths">نقاط القوة</FormLabel>
                <textarea
                  id="strengths"
                  value={evaluationData.strengths}
                  onChange={(e) => setEvaluationData(prev => ({ ...prev, strengths: e.target.value }))}
                  placeholder="اذكر نقاط القوة في المشروع..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="areasForImprovement">مجالات التحسين</FormLabel>
                <textarea
                  id="areasForImprovement"
                  value={evaluationData.areasForImprovement}
                  onChange={(e) => setEvaluationData(prev => ({ ...prev, areasForImprovement: e.target.value }))}
                  placeholder="اذكر المجالات التي تحتاج تحسين..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                />
              </FormGroup>
            </div>

            {/* Recommendations and Next Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <FormLabel htmlFor="recommendations">التوصيات</FormLabel>
                <textarea
                  id="recommendations"
                  value={evaluationData.recommendations}
                  onChange={(e) => setEvaluationData(prev => ({ ...prev, recommendations: e.target.value }))}
                  placeholder="اكتب توصياتك للطالب..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="nextSteps">الخطوات التالية</FormLabel>
                <textarea
                  id="nextSteps"
                  value={evaluationData.nextSteps}
                  onChange={(e) => setEvaluationData(prev => ({ ...prev, nextSteps: e.target.value }))}
                  placeholder="حدد الخطوات التالية للمشروع..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
                />
              </FormGroup>
            </div>

            {/* Meeting Notes */}
            <FormGroup>
              <FormLabel htmlFor="meetingNotes">ملاحظات الاجتماع</FormLabel>
              <textarea
                id="meetingNotes"
                value={evaluationData.meetingNotes}
                onChange={(e) => setEvaluationData(prev => ({ ...prev, meetingNotes: e.target.value }))}
                placeholder="اكتب ملاحظات الاجتماع مع الطالب..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gpms-light focus:border-transparent"
              />
            </FormGroup>

            {/* Error Display */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4 border-t">
              <Button variant="outline" type="button" onClick={handleCancel}>
                <XCircle className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                إلغاء
              </Button>
              <Button type="submit" loading={isLoading}>
                <Save className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                حفظ التقييم
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default ProjectEvaluationModal
