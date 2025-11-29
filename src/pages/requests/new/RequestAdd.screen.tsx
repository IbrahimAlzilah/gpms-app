import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import RequestFormModal from '@/components/forms/RequestFormModal'
import { useRequestAdd } from './RequestAdd.hook'
import { CreateRequestInput } from '../schema'

const RequestAddScreen: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { createRequest, isLoading, error } = useRequestAdd()

  const handleSubmit = async (data: CreateRequestInput) => {
    try {
      await createRequest(data)
      navigate('/requests')
    } catch (err) {
      console.error('Error creating request:', err)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">إضافة طلب جديد</h1>
        </CardHeader>
        <CardContent>
          <RequestFormModal
            isOpen={true}
            onClose={() => navigate('/requests')}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default RequestAddScreen

