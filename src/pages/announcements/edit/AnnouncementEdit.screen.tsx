import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useAnnouncementEdit } from './AnnouncementEdit.hook'
import { UpdateAnnouncementInput } from '../schema'
import { Form, FormGroup, FormLabel } from '@/components/ui/Form'
import Input from '@/components/ui/Input'

const AnnouncementEditScreen: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { announcement, updateAnnouncement, isLoading, error } = useAnnouncementEdit(id || '')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: UpdateAnnouncementInput = {
      title: formData.get('title')?.toString(),
      description: formData.get('description')?.toString(),
      type: formData.get('type')?.toString() as 'proposal_submission' | 'project_review' | 'defense_schedule' | 'general',
      startDate: formData.get('startDate')?.toString(),
      endDate: formData.get('endDate')?.toString(),
      status: formData.get('status')?.toString() as 'active' | 'inactive' | 'upcoming',
    }
    try {
      await updateAnnouncement(data)
      navigate('/announcements')
    } catch (err) {
      console.error('Error updating announcement:', err)
    }
  }

  if (isLoading && !announcement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!announcement) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h1 className="text-xl font-bold text-gray-900">الإعلان غير موجود</h1>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/announcements')}>العودة إلى الإعلانات</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">تعديل الإعلان</h1>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="title" required>العنوان</FormLabel>
              <Input id="title" name="title" defaultValue={announcement.title} required />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="description" required>الوصف</FormLabel>
              <textarea
                id="description"
                name="description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={5}
                defaultValue={announcement.description}
                required
              />
            </FormGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <FormLabel htmlFor="startDate" required>تاريخ البدء</FormLabel>
                <Input id="startDate" name="startDate" type="date" defaultValue={announcement.startDate} required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="endDate" required>تاريخ الانتهاء</FormLabel>
                <Input id="endDate" name="endDate" type="date" defaultValue={announcement.endDate} required />
              </FormGroup>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/announcements')}>
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

export default AnnouncementEditScreen

