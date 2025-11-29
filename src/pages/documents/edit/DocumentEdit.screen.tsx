import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import DocumentFormModal from '@/components/forms/DocumentFormModal'
import { useDocumentEdit } from './DocumentEdit.hook'
import { UpdateDocumentInput } from '../schema'

const DocumentEditScreen: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { document, update, isLoading, error } = useDocumentEdit(id || '')

  const handleSubmit = async (data: UpdateDocumentInput) => {
    try {
      await update(data)
      navigate('/documents')
    } catch (err) {
      console.error('Error updating document:', err)
    }
  }

  if (isLoading && !document) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!document) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h1 className="text-xl font-bold text-gray-900">المستند غير موجود</h1>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/documents')}>العودة إلى المستندات</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-gray-900">تعديل المستند</h1>
        </CardHeader>
        <CardContent>
          <DocumentFormModal
            isOpen={true}
            onClose={() => navigate('/documents')}
            onSubmit={handleSubmit}
            editData={document}
          />
          {error && (
            <div className="mt-4 text-red-600 text-sm">{error}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DocumentEditScreen

