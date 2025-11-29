import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Document } from './schema'
import { getDocuments as getDocumentsService } from '@/services/documents.service'

export function useDocuments() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDocuments()
  }, [user?.role])

  const loadDocuments = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getDocumentsService()
      setDocuments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المستندات')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    documents,
    isLoading,
    error,
    refetch: loadDocuments
  }
}

