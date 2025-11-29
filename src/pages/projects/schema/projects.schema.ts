import { z } from 'zod'

export const projectStatusSchema = z.enum([
  'draft',
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'in_progress',
  'completed',
  'pending',
  'ready_for_defense',
  'defense_scheduled',
  'defended',
  'evaluated',
  'graduated'
])

export const prioritySchema = z.enum(['low', 'medium', 'high'])

export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'العنوان مطلوب'),
  description: z.string().min(1, 'الوصف مطلوب'),
  status: projectStatusSchema,
  priority: prioritySchema,
  supervisor: z.string().optional(),
  students: z.array(z.string()).optional(),
  teamMembers: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  submittedDate: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  lastUpdate: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  department: z.string().optional(),
  score: z.number().optional(),
  grade: z.number().optional(),
  finalGrade: z.number().optional(),
  supervisorNotes: z.string().optional(),
  notes: z.string().optional(),
  lastMeetingDate: z.string().optional(),
  nextMeetingDate: z.string().optional(),
  defenseDate: z.string().optional(),
  defenseTime: z.string().optional(),
  defenseLocation: z.string().optional(),
  discussionGrade: z.number().optional(),
  presentationGrade: z.number().optional(),
  reportGrade: z.number().optional(),
  evaluators: z.array(z.string()).optional(),
  milestones: z.array(z.object({
    id: z.string(),
    title: z.string(),
    dueDate: z.string(),
    completed: z.boolean(),
    progress: z.number()
  })).optional()
})

export const createProjectSchema = projectSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const updateProjectSchema = projectSchema.partial()

export type Project = z.infer<typeof projectSchema>
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type ProjectStatus = z.infer<typeof projectStatusSchema>
export type Priority = z.infer<typeof prioritySchema>

