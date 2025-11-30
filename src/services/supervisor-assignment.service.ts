import { apiRequest } from "./api";
import { Project } from "@/pages/projects/schema";

export interface Supervisor {
  id: string;
  name: string;
  email: string;
  department: string;
  currentProjectsCount: number;
  maxProjects: number;
  specialization?: string;
}

export interface SupervisorAssignment {
  id: string;
  projectId: string;
  project: Project;
  supervisorId: string;
  supervisor: Supervisor;
  assignedAt: string;
  assignedBy: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export async function getSupervisors(): Promise<Supervisor[]> {
  const res = await apiRequest<Supervisor[]>("/supervisors", "GET", undefined, {
    mockData: [
      {
        id: '1',
        name: 'د. أحمد محمد',
        email: 'ahmed.mohamed@university.edu',
        department: 'هندسة الحاسوب',
        currentProjectsCount: 2,
        maxProjects: 5,
        specialization: 'ذكاء اصطناعي'
      },
      {
        id: '2',
        name: 'د. سارة أحمد',
        email: 'sara.ahmed@university.edu',
        department: 'هندسة البرمجيات',
        currentProjectsCount: 3,
        maxProjects: 5,
        specialization: 'قواعد البيانات'
      },
      {
        id: '3',
        name: 'د. خالد محمود',
        email: 'khalid.mahmoud@university.edu',
        department: 'هندسة الحاسوب',
        currentProjectsCount: 1,
        maxProjects: 5,
        specialization: 'شبكات الحاسوب'
      },
      {
        id: '4',
        name: 'د. فاطمة علي',
        email: 'fatima.ali@university.edu',
        department: 'هندسة البرمجيات',
        currentProjectsCount: 4,
        maxProjects: 5,
        specialization: 'تطوير الويب'
      },
      {
        id: '5',
        name: 'د. سعد محمود',
        email: 'saad.mahmoud@university.edu',
        department: 'هندسة الحاسوب',
        currentProjectsCount: 0,
        maxProjects: 5,
        specialization: 'الأمن السيبراني'
      }
    ] as Supervisor[],
  });
  return res.data;
}

export async function getProjectsNeedingSupervisor(): Promise<Project[]> {
  const res = await apiRequest<Project[]>("/projects/needing-supervisor", "GET", undefined, {
    mockData: [
      {
        id: '3',
        title: 'منصة التعليم الإلكتروني',
        description: 'منصة تفاعلية للتعليم عن بعد',
        status: 'approved',
        priority: 'low',
        supervisor: undefined,
        startDate: '2024-02-01',
        endDate: '2024-07-01',
        progress: 0,
        teamMembers: [],
        tags: ['تعليم إلكتروني', 'تفاعل', 'واجهة مستخدم'],
        department: 'هندسة الحاسوب',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20'
      },
      {
        id: '5',
        title: 'تطبيق التجارة الإلكترونية',
        description: 'منصة تجارة إلكترونية متكاملة مع نظام دفع آمن',
        status: 'approved',
        priority: 'medium',
        supervisor: undefined,
        startDate: '2023-12-01',
        endDate: '2024-03-01',
        progress: 0,
        teamMembers: [],
        tags: ['التجارة الإلكترونية', 'الدفع الإلكتروني', 'تطوير ويب'],
        department: 'هندسة الحاسوب',
        createdAt: '2023-12-01',
        updatedAt: '2024-01-18'
      }
    ] as Project[],
  });
  return res.data;
}

export async function assignSupervisor(
  projectId: string,
  supervisorId: string
): Promise<SupervisorAssignment> {
  const res = await apiRequest<SupervisorAssignment>(
    "/projects/assign-supervisor",
    "POST",
    { projectId, supervisorId },
    {
      mockData: {
        id: `ASSIGN-${Date.now()}`,
        projectId,
        project: {} as Project,
        supervisorId,
        supervisor: {} as Supervisor,
        assignedAt: new Date().toISOString(),
        assignedBy: 'committee',
        status: 'pending',
      } as SupervisorAssignment,
    }
  );
  return res.data;
}

export async function getSupervisorAssignments(): Promise<SupervisorAssignment[]> {
  const res = await apiRequest<SupervisorAssignment[]>(
    "/supervisor-assignments",
    "GET",
    undefined,
    {
      mockData: [],
    }
  );
  return res.data;
}

