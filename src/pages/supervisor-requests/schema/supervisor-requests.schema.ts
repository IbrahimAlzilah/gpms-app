import { z } from 'zod'

export const supervisionRequestStatusSchema = z.enum([
  'pending',
  'accepted',
  'rejected',
  'approved_by_committee',
  'rejected_by_committee'
])

export const supervisionRequestSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  projectTitle: z.string(),
  studentId: z.string(),
  studentName: z.string(),
  studentEmail: z.string(),
  groupId: z.string().optional(),
  groupName: z.string().optional(),
  status: supervisionRequestStatusSchema,
  requestedAt: z.string(),
  respondedAt: z.string().optional(),
  supervisorId: z.string(),
  reason: z.string().optional(),
  response: z.string().optional()
})

export type SupervisionRequest = z.infer<typeof supervisionRequestSchema>
export type SupervisionRequestStatus = z.infer<typeof supervisionRequestStatusSchema>

