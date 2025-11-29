import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { CreateDocumentInput, Document } from '../schema'
import { createDocument } from '@/services/documents.service'

export function useDocumentAdd() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (data: CreateDocumentInput): Promise<Document> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newDocument = await createDocument({
        ...data,
        uploadedBy: user?.name || user?.email || ''
      })
      setIsLoading(false)
      return newDocument
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في رفع المستند')
      setIsLoading(false)
      throw err
    }
  }

  return {
    submit,
    isLoading,
    error
  }
}

