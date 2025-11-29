import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import RequestFormModal from '@/components/forms/RequestFormModal'
import { useRequestEdit } from './RequestEdit.hook'
import { UpdateRequestInput } from '../schema'

const RequestEditScreen: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { request, updateRequest, isLoading, error } = useRequestEdit(id || '')

  const handleSubmit = async (data: UpdateRequestInput) => {
    try {
      await updateRequest(data)
      navigate('/requests')
    } catch (err) {
      console.error('Error updating request:', err)
    }
  }

  if (isLoading && !request) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!request) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h1 className="text-xl font-bold text-gray-900">الطلب غير موجود</h1>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/requests')}>العودة إلى الطلبات</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">تعديل الطلب</h1>
        </CardHeader>
        <CardContent>
          <RequestFormModal
            isOpen={true}
            onClose={() => navigate('/requests')}
            onSubmit={handleSubmit}
            editData={request}
          />
          {error && (
            <div className="mt-4 text-red-600 text-sm">{error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default RequestEditScreen

