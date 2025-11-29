import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { UpdateDiscussionCommitteeInput, DiscussionCommittee } from '../schema'
import { getCommitteeById, updateCommittee } from '@/services/distribution.service'

export function useDistributionEdit(committeeId: string) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [committee, setCommittee] = useState<DiscussionCommittee | null>(null)

  useEffect(() => {
    if (committeeId) {
      loadCommittee()
    }
  }, [committeeId])

  const loadCommittee = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getCommitteeById(committeeId)
      setCommittee(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل اللجنة')
    } finally {
      setIsLoading(false)
    }
  }

  const updateCommitteeData = async (data: UpdateDiscussionCommitteeInput): Promise<DiscussionCommittee> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const updated = await updateCommittee(committeeId, data)
      setCommittee(updated)
      setIsLoading(false)
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحديث اللجنة')
      setIsLoading(false)
      throw err
    }
  }

  return {
    committee,
    updateCommittee: updateCommitteeData,
    isLoading,
    error,
    refetch: loadCommittee
  }
}

