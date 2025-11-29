import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useDistributionAdd } from './DistributionAdd.hook'
import { CreateDiscussionCommitteeInput } from '../schema'
import { Form, FormGroup, FormLabel } from '@/components/ui/Form'
import Input from '@/components/ui/Input'

const DistributionAddScreen: React.FC = () => {
  const navigate = useNavigate()
  const { createCommittee, isLoading, error } = useDistributionAdd()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: CreateDiscussionCommitteeInput = {
      name: formData.get('name')?.toString() || '',
      members: [],
      projectId: formData.get('projectId')?.toString() || '',
      projectTitle: formData.get('projectTitle')?.toString() || '',
      studentName: formData.get('studentName')?.toString() || '',
      scheduledDate: formData.get('scheduledDate')?.toString() || '',
      scheduledTime: formData.get('scheduledTime')?.toString() || '',
      location: formData.get('location')?.toString() || '',
      status: 'pending',
    }
    try {
      await createCommittee(data)
      navigate('/distribution')
    } catch (err) {
      console.error('Error creating committee:', err)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">إضافة لجنة جديدة</h1>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel htmlFor="name" required>اسم اللجنة</FormLabel>
              <Input id="name" name="name" required />
            </FormGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormGroup>
                <FormLabel htmlFor="projectTitle" required>اسم المشروع</FormLabel>
                <Input id="projectTitle" name="projectTitle" required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="studentName" required>اسم الطالب</FormLabel>
                <Input id="studentName" name="studentName" required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="scheduledDate" required>التاريخ</FormLabel>
                <Input id="scheduledDate" name="scheduledDate" type="date" required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="scheduledTime" required>الوقت</FormLabel>
                <Input id="scheduledTime" name="scheduledTime" type="time" required />
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="location" required>الموقع</FormLabel>
                <Input id="location" name="location" required />
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

export default DistributionAddScreen

