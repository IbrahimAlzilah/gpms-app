import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useEvaluationEdit } from './EvaluationEdit.hook'
import { UpdateEvaluationInput } from '../schema'
import { Form, FormGroup, FormLabel } from '@/components/ui/Form'
import Input from '@/components/ui/Input'

const EvaluationEditScreen: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { evaluation, updateEvaluation, isLoading, error } = useEvaluationEdit(id || '')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: UpdateEvaluationInput = {
      score: formData.get('score') ? Number(formData.get('score')) : undefined,
      comments: formData.get('comments')?.toString(),
      status: formData.get('status')?.toString() as 'pending' | 'in_progress' | 'completed' | 'overdue' | 'submitted',
    }
    try {
      await updateEvaluation(data)
      navigate('/evaluations')
    } catch (err) {
      console.error('Error updating evaluation:', err)
    }
  }

  if (isLoading && !evaluation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!evaluation) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h1 className="text-xl font-bold text-gray-900">التقييم غير موجود</h1>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/evaluations')}>العودة إلى التقييمات</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">تعديل التقييم</h1>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="score">الدرجة</FormLabel>
              <Input
                id="score"
                name="score"
                type="number"
                defaultValue={evaluation.score}
                min={0}
                max={evaluation.maxScore}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="comments">التعليقات</FormLabel>
              <textarea
                id="comments"
                name="comments"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={5}
                defaultValue={evaluation.comments}
              />
            </FormGroup>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/evaluations')}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
            </div>
          </Form>
          {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
        </CardContent>
      </Card>
    </div>
  )
}

export default EvaluationEditScreen

