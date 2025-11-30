import { apiRequest } from "./api";
import { Project } from "@/pages/projects/schema";

export interface ProjectRegistrationRequest {
  projectId: string;
  studentId: string;
  reason?: string;
}

export interface ProjectRegistration {
  id: string;
  projectId: string;
  project: Project;
  studentId: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewer?: string;
  reason?: string;
  rejectionReason?: string;
}

export async function getAvailableProjects(): Promise<Project[]> {
  const res = await apiRequest<Project[]>(
    "/projects/available",
    "GET",
    undefined,
    {
      mockData: [
        {
          id: "3",
          title: "منصة التعليم الإلكتروني",
          description: "منصة تفاعلية للتعليم عن بعد",
          status: "approved",
          priority: "low",
          supervisor: "د. خالد محمود",
          startDate: "2024-02-01",
          endDate: "2024-07-01",
          progress: 0,
          teamMembers: ["سارة محمد"],
          tags: ["تعليم إلكتروني", "تفاعل", "واجهة مستخدم"],
          department: "هندسة الحاسوب",
          createdAt: "2024-01-15",
          updatedAt: "2024-01-20",
        },
        {
          id: "4",
          title: "نظام إدارة المستشفى",
          description: "نظام شامل لإدارة العمليات الطبية والمواعيد",
          status: "approved",
          priority: "high",
          supervisor: "د. فاطمة علي",
          startDate: "2024-01-10",
          endDate: "2024-05-10",
          progress: 30,
          teamMembers: ["محمد أحمد", "نورا حسن"],
          tags: ["إدارة المستشفى", "قواعد البيانات", "واجهة مستخدم"],
          department: "هندسة البرمجيات",
          createdAt: "2024-01-10",
          updatedAt: "2024-01-25",
        },
        {
          id: "5",
          title: "تطبيق التجارة الإلكترونية",
          description: "منصة تجارة إلكترونية متكاملة مع نظام دفع آمن",
          status: "approved",
          priority: "medium",
          supervisor: "د. سعد محمود",
          startDate: "2023-12-01",
          endDate: "2024-03-01",
          progress: 0,
          teamMembers: [],
          tags: ["التجارة الإلكترونية", "الدفع الإلكتروني", "تطوير ويب"],
          department: "هندسة الحاسوب",
          createdAt: "2023-12-01",
          updatedAt: "2024-01-18",
        },
      ] as Project[],
    }
  );
  return res.data;
}

export async function registerForProject(
  data: ProjectRegistrationRequest
): Promise<ProjectRegistration> {
  const res = await apiRequest<ProjectRegistration>(
    "/projects/register",
    "POST",
    data,
    {
      mockData: {
        id: `REG-${Date.now()}`,
        projectId: data.projectId,
        project: {} as Project,
        studentId: data.studentId,
        status: "pending",
        submittedAt: new Date().toISOString(),
        reason: data.reason,
      } as ProjectRegistration,
    }
  );
  return res.data;
}

export async function checkStudentEligibility(studentId: string): Promise<{ eligible: boolean; reason?: string }> {
  const res = await apiRequest<{ eligible: boolean; reason?: string }>(
    `/students/${studentId}/eligibility`,
    'GET',
    undefined,
    {
      mockData: {
        eligible: true,
        reason: undefined
      },
    }
  )
  return res.data
}

export async function getStudentRegistrations(
  studentId: string
): Promise<ProjectRegistration[]> {
  const res = await apiRequest<ProjectRegistration[]>(
    `/students/${studentId}/registrations`,
    "GET",
    undefined,
    {
      mockData: [],
    }
  );
  return res.data;
}

export async function cancelRegistration(
  registrationId: string
): Promise<void> {
  await apiRequest<void>(
    `/projects/registrations/${registrationId}`,
    "DELETE",
    undefined,
    {
      mockData: undefined,
    }
  );
}
