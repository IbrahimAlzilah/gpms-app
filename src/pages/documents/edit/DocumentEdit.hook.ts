import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { UpdateDocumentInput, Document } from '../schema'
import { getDocumentById, updateDocument } from '@/services/documents.service'

export function useDocumentEdit(id: string) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [document, setDocument] = useState<Document | null>(null)

  useEffect(() => {
    if (id) {
      loadDocument()
    }
  }, [id])

  const loadDocument = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getDocumentById(id)
      setDocument(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المستند')
    } finally {
      setIsLoading(false)
    }
  }

  const update = async (data: UpdateDocumentInput): Promise<Document> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const updated = await updateDocument(id, data)
      setDocument(updated)
      setIsLoading(false)
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحديث المستند')
      setIsLoading(false)
      throw err
    }
  }

  return {
    document,
    update,
    isLoading,
    error,
    refetch: loadDocument
  }
}

