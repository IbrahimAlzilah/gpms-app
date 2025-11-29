import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useScheduleAdd } from './ScheduleAdd.hook'
import { CreateScheduleInput } from '../schema'
import { Form, FormGroup, FormLabel } from '@/components/ui/Form'
import Input from '@/components/ui/Input'

const ScheduleAddScreen: React.FC = () => {
  const navigate = useNavigate()
  const { createSchedule, isLoading, error } = useScheduleAdd()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: CreateScheduleInput = {
      title: formData.get('title')?.toString() || '',
      description: formData.get('description')?.toString(),
      type: formData.get('type')?.toString() as 'meeting' | 'presentation' | 'review' | 'defense' | 'workshop' | 'exam' | 'other',
      status: 'scheduled',
      date: formData.get('date')?.toString() || '',
      startTime: formData.get('startTime')?.toString() || '',
      endTime: formData.get('endTime')?.toString() || '',
      location: formData.get('location')?.toString() || '',
      participants: [],
      priority: (formData.get('priority')?.toString() as 'low' | 'medium' | 'high') || 'medium',
    }
    try {
      await createSchedule(data)
      navigate('/schedules')
    } catch (err) {
      console.error('Error creating schedule:', err)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">إضافة جدول جديد</h1>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="title" required>العنوان</FormLabel>
              <Input id="title" name="title" required />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="description">الوصف</FormLabel>
              <textarea
                id="description"
                name="description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
            </FormGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <FormLabel htmlFor="type" required>النوع</FormLabel>
                <select
                  id="type"
                  name="type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="meeting">اجتماع</option>
                  <option value="presentation">عرض</option>
                  <option value="review">مراجعة</option>
                  <option value="defense">مناقشة</option>
                  <option value="workshop">ورشة عمل</option>
                  <option value="exam">امتحان</option>
                  <option value="other">أخرى</option>
                </select>
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="date" required>التاريخ</FormLabel>
                <Input id="date" name="date" type="date" required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="startTime" required>وقت البدء</FormLabel>
                <Input id="startTime" name="startTime" type="time" required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="endTime" required>وقت الانتهاء</FormLabel>
                <Input id="endTime" name="endTime" type="time" required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="location" required>الموقع</FormLabel>
                <Input id="location" name="location" required />
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
              <Button type="button" variant="outline" onClick={() => navigate('/schedules')}>
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

export default ScheduleAddScreen

