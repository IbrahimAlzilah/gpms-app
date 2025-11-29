import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useEvaluationAdd } from './EvaluationAdd.hook'
import { CreateEvaluationInput } from '../schema'
import { Form, FormGroup, FormLabel } from '@/components/ui/Form'
import Input from '@/components/ui/Input'

const EvaluationAddScreen: React.FC = () => {
  const navigate = useNavigate()
  const { createEvaluation, isLoading, error } = useEvaluationAdd()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: CreateEvaluationInput = {
      projectTitle: formData.get('projectTitle')?.toString() || '',
      evaluationType: formData.get('evaluationType')?.toString() as 'proposal' | 'progress' | 'final' | 'presentation' | 'defense',
      status: 'pending',
      dueDate: formData.get('dueDate')?.toString() || '',
      maxScore: Number(formData.get('maxScore')) || 100,
      priority: (formData.get('priority')?.toString() as 'low' | 'medium' | 'high') || 'medium',
    }
    try {
      await createEvaluation(data)
      navigate('/evaluations')
    } catch (err) {
      console.error('Error creating evaluation:', err)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">إضافة تقييم جديد</h1>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="projectTitle" required>اسم المشروع</FormLabel>
              <Input id="projectTitle" name="projectTitle" required />
            </FormGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <FormLabel htmlFor="evaluationType" required>نوع التقييم</FormLabel>
                <select
                  id="evaluationType"
                  name="evaluationType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="proposal">مقترح</option>
                  <option value="progress">تقدم</option>
                  <option value="final">نهائي</option>
                  <option value="presentation">عرض</option>
                  <option value="defense">مناقشة</option>
                </select>
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="dueDate" required>تاريخ الاستحقاق</FormLabel>
                <Input id="dueDate" name="dueDate" type="date" required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="maxScore" required>الدرجة الكاملة</FormLabel>
                <Input id="maxScore" name="maxScore" type="number" defaultValue={100} required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="priority" required>الأولوية</FormLabel>
                <select
                  id="priority"
                  name="priority"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="low">منخفض</option>
                  <option value="medium">متوسط</option>
                  <option value="high">عالي</option>
                </select>
              </FormGroup>
            </div>
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

export default EvaluationAddScreen

