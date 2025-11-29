import { z } from 'zod'

export const reportCategorySchema = z.enum([
  'statistics',
  'performance',
  'compliance',
  'summary'
])

export const reportStatusSchema = z.enum([
  'available',
  'generating',
  'error'
])

export const reportSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: reportCategorySchema,
  lastGenerated: z.string().optional(),
  status: reportStatusSchema,
  dateRange: z.object({
    startDate: z.string(),
    endDate: z.string()
  }).optional()
})

export type Report = z.infer<typeof reportSchema>
export type ReportCategory = z.infer<typeof reportCategorySchema>
export type ReportStatus = z.infer<typeof reportStatusSchema>

