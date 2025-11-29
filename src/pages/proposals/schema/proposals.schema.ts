import { z } from 'zod'

export const proposalStatusSchema = z.enum([
  'draft',
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'pending',
  'needs_revision'
])

export const prioritySchema = z.enum(['low', 'medium', 'high'])

export const proposalSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'العنوان مطلوب'),
  description: z.string().min(1, 'الوصف مطلوب'),
  status: proposalStatusSchema,
  priority: prioritySchema,
  student: z.string().optional(),
  studentId: z.string().optional(),
  supervisor: z.string().optional(),
  submittedDate: z.string(),
  reviewedDate: z.string().optional(),
  reviewer: z.string().optional(),
  comments: z.string().optional(),
  score: z.number().optional(),
  tags: z.array(z.string()).optional(),
  department: z.string().optional(),
  submittedBy: z.string().optional()
})

export const createProposalSchema = proposalSchema.omit({ id: true, submittedDate: true })
export const updateProposalSchema = proposalSchema.partial()

export type Proposal = z.infer<typeof proposalSchema>
export type CreateProposalInput = z.infer<typeof createProposalSchema>
export type UpdateProposalInput = z.infer<typeof updateProposalSchema>
export type ProposalStatus = z.infer<typeof proposalStatusSchema>

