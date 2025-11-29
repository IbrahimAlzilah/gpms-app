import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { CreateProposalInput, Proposal } from '../schema'
import { createProposal as createProposalService } from '@/services/proposals.service'

export function useProposalAdd() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProposal = async (data: CreateProposalInput): Promise<Proposal> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newProposal = await createProposalService({
        ...data,
        status: data.status || 'draft',
        submittedBy: user?.name || user?.email || ''
      })
      setIsLoading(false)
      return newProposal
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في إنشاء المقترح')
      setIsLoading(false)
      throw err
    }
  }

  return {
    createProposal,
    isLoading,
    error
  }
}

