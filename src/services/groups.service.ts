import { apiRequest } from './api'
import { mockGroups, GroupItem } from '@/mock'

export async function getGroups(): Promise<GroupItem[]> {
  const res = await apiRequest<GroupItem[]>('/groups', 'GET', undefined, {
    mockData: mockGroups,
  })
  return res.data
}


