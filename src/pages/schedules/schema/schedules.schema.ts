import { z } from 'zod'

export const scheduleTypeSchema = z.enum([
  'meeting',
  'presentation',
  'review',
  'defense',
  'workshop',
  'exam',
  'other'
])

export const scheduleStatusSchema = z.enum([
  'scheduled',
  'completed',
  'cancelled',
  'postponed'
])

export const prioritySchema = z.enum(['low', 'medium', 'high'])

export const scheduleSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'العنوان مطلوب'),
  description: z.string().optional(),
  type: scheduleTypeSchema,
  status: scheduleStatusSchema,
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string(),
  participants: z.array(z.string()),
  projectId: z.string().optional(),
  projectTitle: z.string().optional(),
  projects: z.array(z.string()).optional(),
  organizer: z.string().optional(),
  priority: prioritySchema,
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.string().optional()
})

export const createScheduleSchema = scheduleSchema.omit({ id: true, createdAt: true })
export const updateScheduleSchema = scheduleSchema.partial()

export type Schedule = z.infer<typeof scheduleSchema>
export type CreateScheduleInput = z.infer<typeof createScheduleSchema>
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>
export type ScheduleType = z.infer<typeof scheduleTypeSchema>
export type ScheduleStatus = z.infer<typeof scheduleStatusSchema>

