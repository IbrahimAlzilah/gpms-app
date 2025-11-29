import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useScheduleEdit } from './ScheduleEdit.hook'
import { UpdateScheduleInput } from '../schema'
import { Form, FormGroup, FormLabel } from '@/components/ui/Form'
import Input from '@/components/ui/Input'

const ScheduleEditScreen: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { schedule, updateSchedule, isLoading, error } = useScheduleEdit(id || '')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: UpdateScheduleInput = {
      title: formData.get('title')?.toString(),
      description: formData.get('description')?.toString(),
      date: formData.get('date')?.toString(),
      startTime: formData.get('startTime')?.toString(),
      endTime: formData.get('endTime')?.toString(),
      location: formData.get('location')?.toString(),
      type: formData.get('type')?.toString() as 'meeting' | 'presentation' | 'review' | 'defense' | 'workshop' | 'exam' | 'other',
      status: formData.get('status')?.toString() as 'scheduled' | 'completed' | 'cancelled' | 'postponed',
    }
    try {
      await updateSchedule(data)
      navigate('/schedules')
    } catch (err) {
      console.error('Error updating schedule:', err)
    }
  }

  if (isLoading && !schedule) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!schedule) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h1 className="text-xl font-bold text-gray-900">الجدول غير موجود</h1>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/schedules')}>العودة إلى الجداول</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">تعديل الجدول</h1>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="title" required>العنوان</FormLabel>
              <Input id="title" name="title" defaultValue={schedule.title} required />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="description">الوصف</FormLabel>
              <textarea
                id="description"
                name="description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                defaultValue={schedule.description}
              />
            </FormGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <FormLabel htmlFor="date" required>التاريخ</FormLabel>
                <Input id="date" name="date" type="date" defaultValue={schedule.date} required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="location" required>الموقع</FormLabel>
                <Input id="location" name="location" defaultValue={schedule.location} required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="startTime" required>وقت البدء</FormLabel>
                <Input id="startTime" name="startTime" type="time" defaultValue={schedule.startTime} required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="endTime" required>وقت الانتهاء</FormLabel>
                <Input id="endTime" name="endTime" type="time" defaultValue={schedule.endTime} required />
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

export default ScheduleEditScreen

