import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { DiscussionCommittee } from './schema'
import { getCommittees } from '@/services/distribution.service'

export function useDistribution() {
  const { user } = useAuth()
  const [committees, setCommittees] = useState<DiscussionCommittee[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCommittees()
  }, [])

  const loadCommittees = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCommittees()
      setCommittees(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل اللجان')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    committees,
    isLoading,
    error,
    refetch: loadCommittees
  }
}

