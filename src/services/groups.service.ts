import { apiRequest } from './api'
import { mockGroups, GroupItem } from '@/mock'
import { Group, CreateGroupInput, UpdateGroupInput, GroupMember } from '@/pages/groups/schema'

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

export async function getStudentGroup(studentId: string): Promise<Group | null> {
  const res = await apiRequest<Group | null>(`/groups/student/${studentId}`, 'GET', undefined, {
    mockData: mockGroups.find(g => g.members.some(m => m.id === studentId)) ? {
      id: '1',
      name: 'مجموعة التطوير الذكي',
      project: 'تطبيق إدارة المكتبة الذكية',
      members: [
        {
          id: studentId,
          name: 'أحمد محمد علي',
          email: 'ahmed.mohamed@university.edu',
          role: 'leader',
          joinDate: new Date().toISOString().split('T')[0]
        }
      ],
      createdAt: new Date().toISOString(),
      status: 'active',
    } as Group : null,
  })
  return res.data
}

export async function createGroup(data: CreateGroupInput): Promise<Group> {
  const res = await apiRequest<Group>('/groups', 'POST', data, {
    mockData: {
      id: `GRP-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      status: 'active',
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

export async function inviteMemberToGroup(groupId: string, studentEmail: string, message?: string): Promise<Group> {
  const res = await apiRequest<Group>(`/groups/${groupId}/invite`, 'POST', { studentEmail, message }, {
    mockData: {
      id: groupId,
      name: 'مجموعة التطوير الذكي',
      project: 'تطبيق إدارة المكتبة الذكية',
      members: [],
      createdAt: new Date().toISOString(),
      status: 'active',
    } as Group,
  })
  return res.data
}

export async function joinGroup(groupId: string, studentId: string): Promise<Group> {
  const res = await apiRequest<Group>(`/groups/${groupId}/join`, 'POST', { studentId }, {
    mockData: {
      id: groupId,
      name: 'مجموعة التطوير الذكي',
      project: 'تطبيق إدارة المكتبة الذكية',
      members: [],
      createdAt: new Date().toISOString(),
      status: 'active',
    } as Group,
  })
  return res.data
}

export async function leaveGroup(groupId: string, studentId: string): Promise<void> {
  await apiRequest<void>(`/groups/${groupId}/leave`, 'POST', { studentId }, {
    mockData: undefined,
  })
}

export async function removeMemberFromGroup(groupId: string, memberId: string): Promise<Group> {
  const res = await apiRequest<Group>(`/groups/${groupId}/members/${memberId}`, 'DELETE', undefined, {
    mockData: {
      id: groupId,
      name: 'مجموعة التطوير الذكي',
      project: 'تطبيق إدارة المكتبة الذكية',
      members: [],
      createdAt: new Date().toISOString(),
      status: 'active',
    } as Group,
  })
  return res.data
}

export async function searchAvailableStudents(query: string): Promise<Array<{ id: string; name: string; email: string; studentId: string }>> {
  const res = await apiRequest<Array<{ id: string; name: string; email: string; studentId: string }>>('/students/search', 'GET', undefined, {
    mockData: [
      { id: '3', name: 'محمد خالد أحمد', email: 'mohamed.khalid@university.edu', studentId: '2021001236' },
      { id: '4', name: 'سارة أحمد محمود', email: 'sara.ahmed@university.edu', studentId: '2021001237' },
      { id: '5', name: 'علي حسن محمد', email: 'ali.hassan@university.edu', studentId: '2021001238' },
      { id: '6', name: 'نورا سعد أحمد', email: 'nora.saad@university.edu', studentId: '2021001239' }
    ].filter(s => 
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.email.toLowerCase().includes(query.toLowerCase()) ||
      s.studentId.includes(query)
    ),
  })
  return res.data
}


