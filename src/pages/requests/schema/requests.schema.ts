import { z } from 'zod'

export const requestTypeSchema = z.enum([
  'supervision',
  'meeting',
  'extension',
  'change_supervisor',
  'change_group',
  'change_project',
  'supervision_request',
  'meeting_request',
  'change',
  'other'
])

export const requestStatusSchema = z.enum(['pending', 'approved', 'rejected', 'in_progress'])

export const prioritySchema = z.enum(['low', 'medium', 'high'])

export const requestSchema = z.object({
  id: z.string(),
  type: requestTypeSchema,
  title: z.string().min(1, 'العنوان مطلوب'),
  description: z.string().min(1, 'الوصف مطلوب'),
  status: requestStatusSchema,
  priority: prioritySchema,
  student: z.string().optional(),
  studentId: z.string().optional(),
  supervisor: z.string().optional(),
  project: z.string().optional(),
  requestedDate: z.string().optional(),
  submittedDate: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  reason: z.string().optional(),
  response: z.string().optional(),
  reviewer: z.string().optional(),
  attachments: z.array(z.string()).optional()
})

export const createRequestSchema = requestSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const updateRequestSchema = requestSchema.partial()

export type Request = z.infer<typeof requestSchema>
export type CreateRequestInput = z.infer<typeof createRequestSchema>
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>
export type RequestType = z.infer<typeof requestTypeSchema>
export type RequestStatus = z.infer<typeof requestStatusSchema>

