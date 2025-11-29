import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { UpdateProposalInput, Proposal } from '../schema'
import { getProposalById, updateProposal } from '@/services/proposals.service'

export function useProposalEdit(proposalId: string) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [proposal, setProposal] = useState<Proposal | null>(null)

  useEffect(() => {
    if (proposalId) {
      loadProposal()
    }
  }, [proposalId])

  const loadProposal = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getProposalById(proposalId)
      setProposal(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المقترح')
    } finally {
      setIsLoading(false)
    }
  }

  const updateProposalData = async (data: UpdateProposalInput): Promise<Proposal> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const updated = await updateProposal(proposalId, data)
      setProposal(updated)
      setIsLoading(false)
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحديث المقترح')
      setIsLoading(false)
      throw err
    }
  }

  return {
    proposal,
    updateProposal: updateProposalData,
    isLoading,
    error,
    refetch: loadProposal
  }
}

