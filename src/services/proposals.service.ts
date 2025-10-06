import { apiRequest } from './api'
import { mockProposals, ProposalSummary } from '@/mock'

export async function getProposals(): Promise<ProposalSummary[]> {
  const res = await apiRequest<ProposalSummary[]>('/proposals', 'GET', undefined, {
    mockData: mockProposals,
  })
  return res.data
}



