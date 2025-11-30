import React, { useState, useEffect } from 'react'
import { getProposals } from '@/services/proposals.service'
import { Proposal } from '../schema'
import ProposalsScreen from '../proposals.screen'

const ApprovedProposalsScreen: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadApprovedProposals = async () => {
      setIsLoading(true)
      try {
        const allProposals = await getProposals()
        // Filter only approved proposals
        const approvedProposals = allProposals.filter(p => p.status === 'approved')
        setProposals(approvedProposals)
      } catch (err) {
        console.error('Error loading approved proposals:', err)
        setProposals([])
      } finally {
        setIsLoading(false)
      }
    }
    loadApprovedProposals()
  }, [])

  return <ProposalsScreen customProposals={proposals} customLoading={isLoading} filterType="approved" />
}

export default ApprovedProposalsScreen

