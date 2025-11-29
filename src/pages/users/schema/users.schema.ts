import { z } from 'zod'

export const userRoleSchema = z.enum([
  'student',
  'supervisor',
  'committee',
  'discussion',
  'admin'
])

export const userStatusSchema = z.enum([
  'active',
  'inactive',
  'pending',
  'suspended'
])

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'الاسم مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().optional(),
  role: userRoleSchema,
  status: userStatusSchema,
  department: z.string().optional(),
  studentId: z.string().optional(),
  joinDate: z.string(),
  lastLogin: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  avatar: z.string().optional(),
  tags: z.array(z.string()).optional()
})

export const createUserSchema = userSchema.omit({ id: true, joinDate: true, lastLogin: true })
export const updateUserSchema = userSchema.partial()

export type User = z.infer<typeof userSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UserRole = z.infer<typeof userRoleSchema>
export type UserStatus = z.infer<typeof userStatusSchema>

