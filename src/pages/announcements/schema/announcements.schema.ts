import { z } from 'zod'

export const announcementTypeSchema = z.enum([
  'proposal_submission',
  'project_review',
  'defense_schedule',
  'general'
])

export const announcementStatusSchema = z.enum([
  'active',
  'inactive',
  'upcoming'
])

export const announcementSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'العنوان مطلوب'),
  description: z.string().min(1, 'الوصف مطلوب'),
  type: announcementTypeSchema,
  startDate: z.string(),
  endDate: z.string(),
  status: announcementStatusSchema,
  createdAt: z.string().optional(),
  createdBy: z.string().optional()
})

export const createAnnouncementSchema = announcementSchema.omit({ id: true, createdAt: true })
export const updateAnnouncementSchema = announcementSchema.partial()

export type Announcement = z.infer<typeof announcementSchema>
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>
export type AnnouncementType = z.infer<typeof announcementTypeSchema>
export type AnnouncementStatus = z.infer<typeof announcementStatusSchema>

