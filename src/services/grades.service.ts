import { apiRequest } from "./api";
import { mockGrades, GradeItem } from "@/mock";

export interface GradeWeights {
  supervisorWeight: number; // Default: 0.4 (40%)
  discussionWeight: number; // Default: 0.6 (60%)
}

export interface FinalGradeCalculation {
  supervisorScore: number;
  discussionScore: number;
  finalScore: number;
  finalGrade: string;
  weights: GradeWeights;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

export interface GradeApproval {
  gradeId: string;
  approved: boolean;
  approvedBy: string;
  approvedAt: string;
  comments?: string;
}

export async function getGrades(): Promise<GradeItem[]> {
  const res = await apiRequest<GradeItem[]>("/grades", "GET", undefined, {
    mockData: mockGrades,
  });
  return res.data;
}

/**
 * Calculate final grade from supervisor and discussion committee scores
 */
export function calculateFinalGrade(
  supervisorScore: number,
  discussionScore: number,
  weights: GradeWeights = { supervisorWeight: 0.4, discussionWeight: 0.6 }
): FinalGradeCalculation {
  // Ensure weights sum to 1
  const totalWeight = weights.supervisorWeight + weights.discussionWeight;
  const normalizedSupervisorWeight = weights.supervisorWeight / totalWeight;
  const normalizedDiscussionWeight = weights.discussionWeight / totalWeight;

  // Calculate weighted final score
  const finalScore =
    supervisorScore * normalizedSupervisorWeight +
    discussionScore * normalizedDiscussionWeight;

  // Convert score to letter grade
  const finalGrade = scoreToGrade(finalScore);

  return {
    supervisorScore,
    discussionScore,
    finalScore: Math.round(finalScore * 100) / 100, // Round to 2 decimal places
    finalGrade,
    weights: {
      supervisorWeight: normalizedSupervisorWeight,
      discussionWeight: normalizedDiscussionWeight,
    },
    isApproved: false,
  };
}

/**
 * Convert numeric score to letter grade
 */
function scoreToGrade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "B+";
  if (score >= 80) return "B";
  if (score >= 75) return "C+";
  if (score >= 70) return "C";
  if (score >= 65) return "D+";
  if (score >= 60) return "D";
  return "F";
}

/**
 * Get final grade for a project
 */
export async function getProjectFinalGrade(
  projectId: string
): Promise<FinalGradeCalculation | null> {
  const res = await apiRequest<FinalGradeCalculation | null>(
    `/grades/projects/${projectId}/final`,
    "GET",
    undefined,
    {
      mockData: null,
    }
  );
  return res.data;
}

/**
 * Calculate and save final grade for a project
 */
export async function calculateAndSaveFinalGrade(
  projectId: string,
  supervisorScore: number,
  discussionScore: number,
  weights?: GradeWeights
): Promise<FinalGradeCalculation> {
  const finalGrade = calculateFinalGrade(
    supervisorScore,
    discussionScore,
    weights
  );

  const res = await apiRequest<FinalGradeCalculation>(
    `/grades/projects/${projectId}/final`,
    "POST",
    finalGrade,
    {
      mockData: finalGrade,
    }
  );
  return res.data;
}

/**
 * Approve final grade by committee
 * This will notify the student when the grade is approved
 */
export async function approveFinalGrade(
  projectId: string,
  approvedBy: string,
  comments?: string
): Promise<GradeApproval & { studentId?: string; projectTitle?: string }> {
  const res = await apiRequest<GradeApproval & { studentId?: string; projectTitle?: string }>(
    `/grades/projects/${projectId}/approve`,
    "POST",
    { approvedBy, comments, notifyStudent: true },
    {
      mockData: {
        gradeId: `grade-${projectId}`,
        approved: true,
        approvedBy,
        approvedAt: new Date().toISOString(),
        comments,
        studentId: 'student-1',
        projectTitle: 'مشروع التخرج'
      } as GradeApproval & { studentId?: string; projectTitle?: string },
    }
  );
  return res.data;
}

/**
 * Reject final grade (request revision)
 */
export async function rejectFinalGrade(
  projectId: string,
  rejectedBy: string,
  reason: string
): Promise<GradeApproval & { studentId?: string; projectTitle?: string }> {
  const res = await apiRequest<GradeApproval & { studentId?: string; projectTitle?: string }>(
    `/grades/projects/${projectId}/reject`,
    "POST",
    { rejectedBy, reason, notifyStudent: true },
    {
      mockData: {
        gradeId: `grade-${projectId}`,
        approved: false,
        approvedBy: rejectedBy,
        approvedAt: new Date().toISOString(),
        comments: reason,
        studentId: 'student-1',
        projectTitle: 'مشروع التخرج'
      } as GradeApproval & { studentId?: string; projectTitle?: string },
    }
  );
  return res.data;
}

/**
 * Get approved grades for a student
 */
export async function getStudentApprovedGrades(
  studentId: string
): Promise<FinalGradeCalculation[]> {
  const res = await apiRequest<FinalGradeCalculation[]>(
    `/grades/students/${studentId}/approved`,
    "GET",
    undefined,
    {
      mockData: [],
    }
  );
  return res.data;
}

/**
 * Get all pending grade approvals (for committee)
 */
export async function getPendingGradeApprovals(): Promise<
  Array<FinalGradeCalculation & { projectId: string; studentId: string }>
> {
  const res = await apiRequest<
    Array<FinalGradeCalculation & { projectId: string; studentId: string }>
  >("/grades/pending-approvals", "GET", undefined, {
    mockData: [],
  });
  return res.data;
}
