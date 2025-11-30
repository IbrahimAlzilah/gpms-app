import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getProposals } from '@/services/proposals.service'
import { Proposal } from '../schema'
import ProposalsScreen from '../proposals.screen'

const GroupProposalsScreen: React.FC = () => {
  const { user } = useAuth()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadGroupProposals = async () => {
      setIsLoading(true)
      try {
        const allProposals = await getProposals()
        // Filter group proposals (proposals with team members or group submissions)
        // For now, we'll filter by user's proposals that might be group proposals
        const groupProposals = allProposals.filter(p => 
          p.studentId === user?.id || p.submittedBy === user?.id
        )
        setProposals(groupProposals)
      } catch (err) {
        console.error('Error loading group proposals:', err)
        setProposals([])
      } finally {
        setIsLoading(false)
      }
    }
    if (user) {
      loadGroupProposals()
    }
  }, [user])

  return <ProposalsScreen customProposals={proposals} customLoading={isLoading} filterType="group" />
}

export default GroupProposalsScreen

