import { apiRequest } from './api'
import { mockUsers, UserItem } from '@/mock'
import { User, CreateUserInput, UpdateUserInput } from '@/pages/users/schema'

export async function getUsers(): Promise<User[]> {
  const res = await apiRequest<User[]>('/users', 'GET', undefined, {
    mockData: mockUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role as any,
      status: u.status as any,
      department: u.department,
      studentId: u.studentId,
      joinDate: u.joinDate,
      lastLogin: u.lastLogin,
      permissions: u.permissions,
      avatar: u.avatar,
      tags: u.tags
    } as User)),
  })
  return res.data
}

export async function getUserById(id: string): Promise<User> {
  const res = await apiRequest<User>(`/users/${id}`, 'GET', undefined, {
    mockData: {
      id,
      name: 'Sample User',
      email: 'user@example.com',
      role: 'student',
      status: 'active',
      joinDate: new Date().toISOString(),
    } as User,
  })
  return res.data
}

export async function createUser(data: CreateUserInput): Promise<User> {
  const res = await apiRequest<User>('/users', 'POST', data, {
    mockData: {
      id: Math.random().toString(36).substring(7),
      ...data,
      joinDate: new Date().toISOString(),
    } as User,
  })
  return res.data
}

export async function updateUser(id: string, data: UpdateUserInput): Promise<User> {
  const res = await apiRequest<User>(`/users/${id}`, 'PUT', data, {
    mockData: {
      id,
      ...data,
    } as User,
  })
  return res.data
}

export async function deleteUser(id: string): Promise<void> {
  await apiRequest<void>(`/users/${id}`, 'DELETE', undefined, {
    mockData: undefined,
  })
}

export async function toggleUserStatus(id: string, status: 'active' | 'inactive' | 'pending' | 'suspended'): Promise<User> {
  const res = await apiRequest<User>(`/users/${id}/status`, 'PATCH', { status }, {
    mockData: {
      id,
      status,
    } as User,
  })
  return res.data
}

export async function updateUserPermissions(id: string, permissions: string[]): Promise<User> {
  const res = await apiRequest<User>(`/users/${id}/permissions`, 'PUT', { permissions }, {
    mockData: {
      id,
      permissions,
    } as User,
  })
  return res.data
}

export async function updateUserRole(id: string, role: 'student' | 'supervisor' | 'committee' | 'discussion' | 'admin'): Promise<User> {
  const res = await apiRequest<User>(`/users/${id}/role`, 'PATCH', { role }, {
    mockData: {
      id,
      role,
    } as User,
  })
  return res.data
}

