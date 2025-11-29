import { apiRequest } from "./api";
import {
  mockProjects,
  ProjectSummary,
  mockStudentProjects,
  StudentProject,
} from "@/mock";
import {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from "@/pages/projects/schema";

export async function getProjects(): Promise<Project[]> {
  const res = await apiRequest<Project[]>("/projects", "GET", undefined, {
    mockData: mockStudentProjects.map(
      (p) =>
        ({
          id: p.id,
          title: p.title,
          description: p.description,
          status: p.status,
          priority: p.priority,
          supervisor: p.supervisor,
          students: p.teamMembers,
          teamMembers: p.teamMembers,
          startDate: p.startDate,
          endDate: p.endDate,
          progress: p.progress,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          tags: p.tags,
          supervisorNotes: p.supervisorNotes,
          lastMeetingDate: p.lastMeetingDate,
          nextMeetingDate: p.nextMeetingDate,
          milestones: p.milestones,
        } as Project)
    ),
  });
  return res.data;
}

export async function getStudentProjects(): Promise<Project[]> {
  const res = await apiRequest<Project[]>(
    "/student/projects",
    "GET",
    undefined,
    {
      mockData: mockStudentProjects.map(
        (p) =>
          ({
            id: p.id,
            title: p.title,
            description: p.description,
            status: p.status,
            priority: p.priority,
            supervisor: p.supervisor,
            students: p.teamMembers,
            teamMembers: p.teamMembers,
            startDate: p.startDate,
            endDate: p.endDate,
            progress: p.progress,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            tags: p.tags,
            supervisorNotes: p.supervisorNotes,
            lastMeetingDate: p.lastMeetingDate,
            nextMeetingDate: p.nextMeetingDate,
            milestones: p.milestones,
          } as Project)
      ),
    }
  );
  return res.data;
}

export async function getProjectById(id: string): Promise<Project> {
  const res = await apiRequest<Project>(`/projects/${id}`, "GET", undefined, {
    mockData: {
      id,
      title: "Sample Project",
      description: "Sample description",
      status: "draft",
      priority: "medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Project,
  });
  return res.data;
}

export async function createProject(
  data: CreateProjectInput
): Promise<Project> {
  const res = await apiRequest<Project>("/projects", "POST", data, {
    mockData: {
      id: Math.random().toString(36).substring(7),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Project,
  });
  return res.data;
}

export async function updateProject(
  id: string,
  data: UpdateProjectInput
): Promise<Project> {
  const res = await apiRequest<Project>(`/projects/${id}`, "PUT", data, {
    mockData: {
      id,
      ...data,
      updatedAt: new Date().toISOString(),
    } as Project,
  });
  return res.data;
}

export async function deleteProject(id: string): Promise<void> {
  await apiRequest<void>(`/projects/${id}`, "DELETE", undefined, {
    mockData: undefined,
  });
}

export async function approveProject(id: string): Promise<Project> {
  return updateProject(id, {
    status: "approved",
    updatedAt: new Date().toISOString(),
  });
}

export async function rejectProject(
  id: string,
  reason?: string
): Promise<Project> {
  return updateProject(id, {
    status: "rejected",
    notes: reason,
    updatedAt: new Date().toISOString(),
  });
}
