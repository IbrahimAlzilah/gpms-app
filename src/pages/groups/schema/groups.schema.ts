import { z } from 'zod'

export const groupMemberRoleSchema = z.enum(['leader', 'member'])

export const groupStatusSchema = z.enum([
  'active',
  'pending',
  'inactive'
])

export const groupMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: groupMemberRoleSchema,
  joinDate: z.string()
})

export const groupSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'اسم المجموعة مطلوب'),
  project: z.string().optional(),
  members: z.array(groupMemberSchema),
  createdAt: z.string(),
  status: groupStatusSchema
})

export const createGroupSchema = groupSchema.omit({ id: true, createdAt: true })
export const updateGroupSchema = groupSchema.partial()

export type GroupMember = z.infer<typeof groupMemberSchema>
export type Group = z.infer<typeof groupSchema>
export type CreateGroupInput = z.infer<typeof createGroupSchema>
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>
export type GroupMemberRole = z.infer<typeof groupMemberRoleSchema>
export type GroupStatus = z.infer<typeof groupStatusSchema>

