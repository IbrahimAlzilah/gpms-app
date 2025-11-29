import { z } from "zod";

export const evaluationTypeSchema = z.enum([
  "proposal",
  "progress",
  "final",
  "presentation",
  "code_review",
  "defense",
]);

export const evaluationStatusSchema = z.enum([
  "pending",
  "in_progress",
  "completed",
  "overdue",
  "submitted",
]);

export const gradeSchema = z.enum(["A+", "A", "B+", "B", "C+", "C", "D", "F"]);

export const evaluationSchema = z.object({
  id: z.string(),
  projectTitle: z.string(),
  studentName: z.string().optional(),
  studentId: z.string().optional(),
  students: z.array(z.string()).optional(),
  supervisor: z.string().optional(),
  evaluator: z.string().optional(),
  evaluationType: evaluationTypeSchema,
  status: evaluationStatusSchema,
  dueDate: z.string(),
  submittedDate: z.string().optional(),
  defenseDate: z.string().optional(),
  score: z.number().optional(),
  maxScore: z.number(),
  presentationGrade: z.number().optional(),
  reportGrade: z.number().optional(),
  discussionGrade: z.number().optional(),
  finalGrade: z.number().optional(),
  comments: z.string().optional(),
  recommendations: z.array(z.string()).optional(),
  criteria: z
    .object({
      technical: z.number().optional(),
      methodology: z.number().optional(),
      presentation: z.number().optional(),
      documentation: z.number().optional(),
    })
    .optional(),
  grade: gradeSchema.optional(),
  priority: z.enum(["low", "medium", "high"]),
  department: z.string().optional(),
  tags: z.array(z.string()).optional(),
  component: z.string().optional(),
  percentage: z.number().optional(),
  category: z
    .enum([
      "proposal",
      "progress",
      "final_presentation",
      "final_report",
      "source_code",
      "other",
    ])
    .optional(),
  semester: z.string().optional(),
  academicYear: z.string().optional(),
});

export const createEvaluationSchema = evaluationSchema.omit({
  id: true,
  submittedDate: true,
});
export const updateEvaluationSchema = evaluationSchema.partial();

export type Evaluation = z.infer<typeof evaluationSchema>;
export type CreateEvaluationInput = z.infer<typeof createEvaluationSchema>;
export type UpdateEvaluationInput = z.infer<typeof updateEvaluationSchema>;
export type EvaluationType = z.infer<typeof evaluationTypeSchema>;
export type EvaluationStatus = z.infer<typeof evaluationStatusSchema>;
