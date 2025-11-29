import { apiRequest } from './api'
import { mockGroups, GroupItem } from '@/mock'
import { Group, CreateGroupInput, UpdateGroupInput } from '@/pages/groups/schema'

export async function getGroups(): Promise<Group[]> {
  const res = await apiRequest<Group[]>('/groups', 'GET', undefined, {
    mockData: mockGroups.map(g => ({
      id: g.id,
      name: g.name,
      project: g.project,
      members: g.members.map(m => ({
        id: m.id,
        name: m.name,
        email: m.email,
        role: m.role as any,
        joinDate: m.joinDate
      })),
      createdAt: g.createdAt,
      status: g.status as any
    } as Group)),
  })
  return res.data
}

export async function getGroupById(id: string): Promise<Group> {
  const res = await apiRequest<Group>(`/groups/${id}`, 'GET', undefined, {
    mockData: {
      id,
      name: 'Sample Group',
      members: [],
      createdAt: new Date().toISOString(),
      status: 'active',
    } as Group,
  })
  return res.data
}

export async function createGroup(data: CreateGroupInput): Promise<Group> {
  const res = await apiRequest<Group>('/groups', 'POST', data, {
    mockData: {
      id: Math.random().toString(36).substring(7),
      ...data,
      createdAt: new Date().toISOString(),
    } as Group,
  })
  return res.data
}

export async function updateGroup(id: string, data: UpdateGroupInput): Promise<Group> {
  const res = await apiRequest<Group>(`/groups/${id}`, 'PUT', data, {
    mockData: {
      id,
      ...data,
    } as Group,
  })
  return res.data
}

export async function deleteGroup(id: string): Promise<void> {
  await apiRequest<void>(`/groups/${id}`, 'DELETE', undefined, {
    mockData: undefined,
  })
}


