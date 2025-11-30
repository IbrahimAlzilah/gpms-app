import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getProposals } from '@/services/proposals.service'
import { Proposal } from '../schema'
import ProposalsScreen from '../proposals.screen'

const MyProposalsScreen: React.FC = () => {
  const { user } = useAuth()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMyProposals = async () => {
      setIsLoading(true)
      try {
        const allProposals = await getProposals()
        // Filter proposals by current user
        const myProposals = allProposals.filter(p => 
          p.studentId === user?.id || p.submittedBy === user?.id
        )
        setProposals(myProposals)
      } catch (err) {
        console.error('Error loading my proposals:', err)
        setProposals([])
      } finally {
        setIsLoading(false)
      }
    }
    if (user) {
      loadMyProposals()
    }
  }, [user])

  return <ProposalsScreen customProposals={proposals} customLoading={isLoading} filterType="my" />
}

export default MyProposalsScreen
