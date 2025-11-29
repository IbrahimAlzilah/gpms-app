import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useDistributionEdit } from './DistributionEdit.hook'
import { UpdateDiscussionCommitteeInput } from '../schema'
import { Form, FormGroup, FormLabel } from '@/components/ui/Form'
import Input from '@/components/ui/Input'

const DistributionEditScreen: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { committee, updateCommittee, isLoading, error } = useDistributionEdit(id || '')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: UpdateDiscussionCommitteeInput = {
      name: formData.get('name')?.toString(),
      scheduledDate: formData.get('scheduledDate')?.toString(),
      scheduledTime: formData.get('scheduledTime')?.toString(),
      location: formData.get('location')?.toString(),
      status: formData.get('status')?.toString() as 'assigned' | 'pending' | 'completed',
    }
    try {
      await updateCommittee(data)
      navigate('/distribution')
    } catch (err) {
      console.error('Error updating committee:', err)
    }
  }

  if (isLoading && !committee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!committee) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h1 className="text-xl font-bold text-gray-900">اللجنة غير موجودة</h1>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/distribution')}>العودة إلى التوزيع</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">تعديل اللجنة</h1>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="name" required>اسم اللجنة</FormLabel>
              <Input id="name" name="name" defaultValue={committee.name} required />
            </FormGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <FormLabel htmlFor="scheduledDate" required>التاريخ</FormLabel>
                <Input id="scheduledDate" name="scheduledDate" type="date" defaultValue={committee.scheduledDate} required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="scheduledTime" required>الوقت</FormLabel>
                <Input id="scheduledTime" name="scheduledTime" type="time" defaultValue={committee.scheduledTime} required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="location" required>الموقع</FormLabel>
                <Input id="location" name="location" defaultValue={committee.location} required />
              </FormGroup>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/distribution')}>
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

export default DistributionEditScreen

