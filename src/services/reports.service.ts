import { apiRequest } from './api'

export interface ReportCriteria {
  startDate?: string
  endDate?: string
  department?: string
  supervisor?: string
  status?: string
  projectType?: string
}

export interface ProjectReport {
  totalProjects: number
  byStatus: Record<string, number>
  byDepartment: Record<string, number>
  bySupervisor: Record<string, number>
  byPriority: Record<string, number>
  averageProgress: number
  completedProjects: number
  inProgressProjects: number
  pendingProjects: number
}

export interface StudentReport {
  totalStudents: number
  registeredStudents: number
  unregisteredStudents: number
  byDepartment: Record<string, number>
  registrationRate: number
}

export interface EvaluationReport {
  totalEvaluations: number
  averageScore: number
  gradeDistribution: Record<string, number>
  byEvaluator: Record<string, number>
  completedEvaluations: number
  pendingEvaluations: number
}

export interface StatisticsReport {
  totalProjects: number
  totalStudents: number
  totalSupervisors: number
  totalProposals: number
  totalRequests: number
  activeProjects: number
  completedProjects: number
  averageProjectDuration: number
  successRate: number
}

/**
 * Generate project report based on criteria
 */
export async function generateProjectReport(
  criteria?: ReportCriteria
): Promise<ProjectReport> {
  const res = await apiRequest<ProjectReport>(
    '/reports/projects',
    'POST',
    criteria || {},
    {
      mockData: {
        totalProjects: 50,
        byStatus: {
          approved: 20,
          in_progress: 15,
          completed: 10,
          pending: 5,
        },
        byDepartment: {
          'هندسة الحاسوب': 25,
          'هندسة البرمجيات': 15,
          'هندسة الشبكات': 10,
        },
        bySupervisor: {
          'د. أحمد محمد': 8,
          'د. سارة أحمد': 6,
          'د. خالد محمود': 5,
        },
        byPriority: {
          high: 15,
          medium: 20,
          low: 15,
        },
        averageProgress: 65,
        completedProjects: 10,
        inProgressProjects: 15,
        pendingProjects: 5,
      } as ProjectReport,
    }
  )
  return res.data
}

/**
 * Generate student report based on criteria
 */
export async function generateStudentReport(
  criteria?: ReportCriteria
): Promise<StudentReport> {
  const res = await apiRequest<StudentReport>(
    '/reports/students',
    'POST',
    criteria || {},
    {
      mockData: {
        totalStudents: 200,
        registeredStudents: 150,
        unregisteredStudents: 50,
        byDepartment: {
          'هندسة الحاسوب': 100,
          'هندسة البرمجيات': 60,
          'هندسة الشبكات': 40,
        },
        registrationRate: 75,
      } as StudentReport,
    }
  )
  return res.data
}

/**
 * Generate evaluation report based on criteria
 */
export async function generateEvaluationReport(
  criteria?: ReportCriteria
): Promise<EvaluationReport> {
  const res = await apiRequest<EvaluationReport>(
    '/reports/evaluations',
    'POST',
    criteria || {},
    {
      mockData: {
        totalEvaluations: 30,
        averageScore: 85,
        gradeDistribution: {
          'A+': 5,
          'A': 10,
          'B+': 8,
          'B': 5,
          'C+': 2,
        },
        byEvaluator: {
          'د. أحمد محمد': 12,
          'د. سارة أحمد': 10,
          'لجنة المناقشة 1': 8,
        },
        completedEvaluations: 25,
        pendingEvaluations: 5,
      } as EvaluationReport,
    }
  )
  return res.data
}

/**
 * Generate general statistics report
 */
export async function generateStatisticsReport(): Promise<StatisticsReport> {
  const res = await apiRequest<StatisticsReport>(
    '/reports/statistics',
    'GET',
    undefined,
    {
      mockData: {
        totalProjects: 50,
        totalStudents: 200,
        totalSupervisors: 15,
        totalProposals: 80,
        totalRequests: 45,
        activeProjects: 25,
        completedProjects: 10,
        averageProjectDuration: 180, // days
        successRate: 85,
      } as StatisticsReport,
    }
  )
  return res.data
}

/**
 * Export report as PDF
 */
export async function exportReportAsPDF(
  reportType: 'projects' | 'students' | 'evaluations' | 'statistics',
  criteria?: ReportCriteria
): Promise<Blob> {
  const res = await apiRequest<Blob>(
    `/reports/${reportType}/export/pdf`,
    'POST',
    criteria || {},
    {
      mockData: new Blob(['PDF content'], { type: 'application/pdf' }),
    }
  )
  return res.data
}

/**
 * Export report as Excel
 */
export async function exportReportAsExcel(
  reportType: 'projects' | 'students' | 'evaluations' | 'statistics',
  criteria?: ReportCriteria
): Promise<Blob> {
  const res = await apiRequest<Blob>(
    `/reports/${reportType}/export/excel`,
    'POST',
    criteria || {},
    {
      mockData: new Blob(['Excel content'], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
    }
  )
  return res.data
}

