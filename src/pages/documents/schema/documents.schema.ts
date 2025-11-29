import { z } from "zod";

export const documentTypeSchema = z.enum([
  "proposal",
  "progress_report",
  "source_code",
  "presentation",
  "design",
  "final_report_chapters",
  "presentation_codes",
  "note",
  "other",
]);

export const documentStatusSchema = z.enum(["approved", "pending", "rejected"]);

export const documentSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "العنوان مطلوب"),
  description: z.string().optional(),
  content: z.string().optional(), // For notes
  type: documentTypeSchema,
  fileName: z.string().optional(), // Optional for notes
  fileSize: z.string().optional(),
  uploadedDate: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  status: documentStatusSchema.optional(),
  version: z.string().optional(),
  uploadedBy: z.string().optional(),
  project: z.string().optional(), // For notes
  students: z.array(z.string()).optional(), // For notes
  priority: z.enum(["low", "medium", "high"]).optional(), // For notes
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
});

export const createDocumentSchema = documentSchema.omit({
  id: true,
  uploadedDate: true,
  createdAt: true,
  updatedAt: true,
});
export const updateDocumentSchema = documentSchema.partial();

export type Document = z.infer<typeof documentSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
