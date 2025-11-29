import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import DocumentFormModal from '@/components/forms/DocumentFormModal'
import { useDocumentAdd } from './DocumentAdd.hook'
import { CreateDocumentInput } from '../schema'

const DocumentAddScreen: React.FC = () => {
  const navigate = useNavigate()
  const { submit, isLoading, error } = useDocumentAdd()

  const handleSubmit = async (data: CreateDocumentInput) => {
    try {
      await submit(data)
      navigate('/documents')
    } catch (err) {
      console.error('Error creating document:', err)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">إضافة مستند جديد</h1>
        </CardHeader>
        <CardContent>
          <DocumentFormModal
            isOpen={true}
            onClose={() => navigate('/documents')}
            onSubmit={handleSubmit}
          />
          {error && (
            <div className="mt-4 text-red-600 text-sm">{error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DocumentAddScreen

