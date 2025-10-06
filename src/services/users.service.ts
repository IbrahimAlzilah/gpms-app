import { apiRequest } from './api'
import { mockUsers, UserItem } from '@/mock'

export async function getUsers(): Promise<UserItem[]> {
  const res = await apiRequest<UserItem[]>('/users', 'GET', undefined, {
    mockData: mockUsers,
  })
  return res.data
}


