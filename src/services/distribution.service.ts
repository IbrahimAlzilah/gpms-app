import { apiRequest } from "./api";
import {
  DiscussionCommittee,
  CreateDiscussionCommitteeInput,
  UpdateDiscussionCommitteeInput,
} from "@/pages/distribution/schema";

export async function getCommittees(): Promise<DiscussionCommittee[]> {
  const res = await apiRequest<DiscussionCommittee[]>(
    "/distribution",
    "GET",
    undefined,
    {
      mockData: [],
    }
  );
  return res.data;
}

export async function getCommitteeById(
  id: string
): Promise<DiscussionCommittee> {
  const res = await apiRequest<DiscussionCommittee>(
    `/distribution/${id}`,
    "GET",
    undefined,
    {
      mockData: {
        id,
        name: "Sample Committee",
        members: [],
        projectId: "",
        projectTitle: "Sample Project",
        studentName: "Sample Student",
        scheduledDate: new Date().toISOString().split("T")[0],
        scheduledTime: "09:00",
        location: "",
        status: "pending",
      } as DiscussionCommittee,
    }
  );
  return res.data;
}

export async function createCommittee(
  data: CreateDiscussionCommitteeInput
): Promise<DiscussionCommittee> {
  const res = await apiRequest<DiscussionCommittee>(
    "/distribution",
    "POST",
    data,
    {
      mockData: {
        id: Math.random().toString(36).substring(7),
        ...data,
        createdAt: new Date().toISOString(),
      } as DiscussionCommittee,
    }
  );
  return res.data;
}

export async function updateCommittee(
  id: string,
  data: UpdateDiscussionCommitteeInput
): Promise<DiscussionCommittee> {
  const res = await apiRequest<DiscussionCommittee>(
    `/distribution/${id}`,
    "PUT",
    data,
    {
      mockData: {
        id,
        ...data,
      } as DiscussionCommittee,
    }
  );
  return res.data;
}

export async function deleteCommittee(id: string): Promise<void> {
  await apiRequest<void>(`/distribution/${id}`, "DELETE", undefined, {
    mockData: undefined,
  });
}
