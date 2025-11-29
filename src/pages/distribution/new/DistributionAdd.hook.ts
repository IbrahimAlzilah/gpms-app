import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { CreateDiscussionCommitteeInput, DiscussionCommittee } from '../schema'
import { createCommittee } from '@/services/distribution.service'

export function useDistributionAdd() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCommitteeData = async (data: CreateDiscussionCommitteeInput): Promise<DiscussionCommittee> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newCommittee = await createCommittee(data)
      setIsLoading(false)
      return newCommittee
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في إنشاء اللجنة')
      setIsLoading(false)
      throw err
    }
  }

  return {
    createCommittee: createCommitteeData,
    isLoading,
    error
  }
}

