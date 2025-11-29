import { apiRequest } from './api'
import { mockProposals, ProposalSummary } from '@/mock'
import { Proposal, CreateProposalInput, UpdateProposalInput } from '@/pages/proposals/schema'

export async function getProposals(): Promise<Proposal[]> {
  const res = await apiRequest<Proposal[]>('/proposals', 'GET', undefined, {
    mockData: mockProposals.map(p => ({
      id: p.id,
      title: p.title,
      description: '',
      status: p.state === 'review' ? 'under_review' : p.state === 'submitted' ? 'submitted' : p.state,
      priority: 'medium',
      submittedDate: p.submittedAt,
      student: '',
      supervisor: ''
    } as Proposal)),
  })
  return res.data
}

export async function getProposalById(id: string): Promise<Proposal> {
  const res = await apiRequest<Proposal>(`/proposals/${id}`, 'GET', undefined, {
    mockData: {
      id,
      title: 'Sample Proposal',
      description: 'Sample description',
      status: 'draft',
      priority: 'medium',
      submittedDate: new Date().toISOString(),
      student: '',
      supervisor: ''
    } as Proposal,
  })
  return res.data
}

export async function createProposal(data: CreateProposalInput): Promise<Proposal> {
  const res = await apiRequest<Proposal>('/proposals', 'POST', data, {
    mockData: {
      id: Math.random().toString(36).substring(7),
      ...data,
      submittedDate: new Date().toISOString(),
    } as Proposal,
  })
  return res.data
}

export async function updateProposal(id: string, data: UpdateProposalInput): Promise<Proposal> {
  const res = await apiRequest<Proposal>(`/proposals/${id}`, 'PUT', data, {
    mockData: {
      id,
      ...data,
    } as Proposal,
  })
  return res.data
}

export async function deleteProposal(id: string): Promise<void> {
  await apiRequest<void>(`/proposals/${id}`, 'DELETE', undefined, {
    mockData: undefined,
  })
}

export async function approveProposal(id: string, comments?: string): Promise<Proposal> {
  return updateProposal(id, {
    status: 'approved',
    comments,
    reviewedDate: new Date().toISOString(),
  })
}

export async function rejectProposal(id: string, comments?: string): Promise<Proposal> {
  return updateProposal(id, {
    status: 'rejected',
    comments,
    reviewedDate: new Date().toISOString(),
  })
}



