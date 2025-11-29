import { apiRequest } from "./api";
import {
  Announcement,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from "@/pages/announcements/schema";

export async function getAnnouncements(): Promise<Announcement[]> {
  const res = await apiRequest<Announcement[]>(
    "/announcements",
    "GET",
    undefined,
    {
      mockData: [],
    }
  );
  return res.data;
}

export async function getAnnouncementById(id: string): Promise<Announcement> {
  const res = await apiRequest<Announcement>(
    `/announcements/${id}`,
    "GET",
    undefined,
    {
      mockData: {
        id,
        title: "Sample Announcement",
        description: "Sample description",
        type: "general",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        status: "active",
      } as Announcement,
    }
  );
  return res.data;
}

export async function createAnnouncement(
  data: CreateAnnouncementInput
): Promise<Announcement> {
  const res = await apiRequest<Announcement>("/announcements", "POST", data, {
    mockData: {
      id: Math.random().toString(36).substring(7),
      ...data,
      createdAt: new Date().toISOString(),
    } as Announcement,
  });
  return res.data;
}

export async function updateAnnouncement(
  id: string,
  data: UpdateAnnouncementInput
): Promise<Announcement> {
  const res = await apiRequest<Announcement>(
    `/announcements/${id}`,
    "PUT",
    data,
    {
      mockData: {
        id,
        ...data,
      } as Announcement,
    }
  );
  return res.data;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await apiRequest<void>(`/announcements/${id}`, "DELETE", undefined, {
    mockData: undefined,
  });
}
