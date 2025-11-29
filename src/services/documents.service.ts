import { apiRequest } from "./api";
import { mockDocuments, DocumentItem } from "@/mock";
import {
  Document,
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/pages/documents/schema";

export async function getDocuments(): Promise<Document[]> {
  const res = await apiRequest<Document[]>("/documents", "GET", undefined, {
    mockData: mockDocuments.map(
      (d) =>
        ({
          id: d.id,
          title: d.title,
          description: d.description,
          type: d.type as any,
          fileName: d.fileName,
          fileSize: d.fileSize,
          uploadedDate: d.uploadedDate,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
          status: d.status as any,
          uploadedBy: d.uploadedBy,
          tags: d.tags,
        } as Document)
    ),
  });
  return res.data;
}

export async function getDocumentById(id: string): Promise<Document> {
  const res = await apiRequest<Document>(`/documents/${id}`, "GET", undefined, {
    mockData: {
      id,
      title: "Sample Document",
      description: "",
      type: "other",
      uploadedDate: new Date().toISOString().split("T")[0],
    } as Document,
  });
  return res.data;
}

export async function createDocument(
  data: CreateDocumentInput
): Promise<Document> {
  const res = await apiRequest<Document>("/documents", "POST", data, {
    mockData: {
      id: Math.random().toString(36).substring(7),
      ...data,
      uploadedDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    } as Document,
  });
  return res.data;
}

export async function updateDocument(
  id: string,
  data: UpdateDocumentInput
): Promise<Document> {
  const res = await apiRequest<Document>(`/documents/${id}`, "PUT", data, {
    mockData: {
      id,
      ...data,
      updatedAt: new Date().toISOString().split("T")[0],
    } as Document,
  });
  return res.data;
}

export async function deleteDocument(id: string): Promise<void> {
  await apiRequest<void>(`/documents/${id}`, "DELETE", undefined, {
    mockData: undefined,
  });
}
