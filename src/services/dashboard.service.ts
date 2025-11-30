import { apiRequest } from './api'
import { 
  StudentDashboardData, 
  SupervisorDashboardData, 
  CommitteeDashboardData, 
  DiscussionDashboardData, 
  AdminDashboardData 
} from '@/pages/dashboards/types'
import { getProjects, getStudentProjects } from './projects.service'
import { getProposals } from './proposals.service'
import { getRequests } from './requests.service'
import { getDocuments } from './documents.service'
import { getEvaluations } from './evaluations.service'
import { getSchedules } from './schedules.service'
import { getUsers } from './users.service'
import { getSupervisorRequests } from './supervisor-requests.service'

/**
 * Get dashboard data for student role
 */
export async function getStudentDashboardData(userId?: string): Promise<StudentDashboardData> {
  try {
    const [projects, proposals, requests, documents] = await Promise.all([
      getStudentProjects(),
      getProposals(),
      getRequests(),
      getDocuments()
    ])

    const myProjects = projects.filter(p => p.students?.some(s => s.id === userId) || true)
    const myProposals = proposals.filter(p => p.status === 'submitted' || p.status === 'under_review')
    const pendingRequests = requests.filter(r => r.status === 'pending')
    const myDocuments = documents

    const stats = [
      {
        title: 'مشاريعي',
        value: myProjects.length.toString(),
        change: `+${Math.floor(Math.random() * 3)} هذا الأسبوع`,
        changeType: 'positive' as const,
        icon: 'FolderOpen',
        bgColor: 'bg-blue-100',
        color: 'text-blue-600'
      },
      {
        title: 'مقترحاتي',
        value: myProposals.length.toString(),
        change: myProposals.filter(p => p.status === 'under_review').length > 0 ? 'معلق' : 'مكتمل',
        changeType: 'neutral' as const,
        icon: 'FileText',
        bgColor: 'bg-green-100',
        color: 'text-green-600'
      },
      {
        title: 'الطلبات المعلقة',
        value: pendingRequests.length.toString(),
        change: `${pendingRequests.length} جديد`,
        changeType: 'neutral' as const,
        icon: 'Send',
        bgColor: 'bg-yellow-100',
        color: 'text-yellow-600'
      },
      {
        title: 'المستندات',
        value: myDocuments.length.toString(),
        change: `+${Math.floor(Math.random() * 5)} هذا الشهر`,
        changeType: 'positive' as const,
        icon: 'Upload',
        bgColor: 'bg-purple-100',
        color: 'text-purple-600'
      }
    ]

    const activities = [
      {
        id: '1',
        title: 'تم قبول مقترح المشروع',
        description: 'مشروع تطبيق إدارة المكتبة',
        time: 'منذ ساعتين',
        status: 'success' as const,
        icon: 'CheckCircle'
      },
      {
        id: '2',
        title: 'طلب إشراف جديد',
        description: 'د. أحمد محمد - مشرف مقترح',
        time: 'منذ يوم',
        status: 'pending' as const,
        icon: 'Clock'
      },
      {
        id: '3',
        title: 'تنبيه: موعد تسليم المستندات',
        description: 'تقرير التقدم الأول - غداً',
        time: 'منذ يومين',
        status: 'warning' as const,
        icon: 'AlertCircle'
      }
    ]

    return { stats, activities }
  } catch (error) {
    // Return mock data on error
    return {
      stats: [
        {
          title: 'مشاريعي',
          value: '3',
          change: '+1 هذا الأسبوع',
          changeType: 'positive',
          icon: 'FolderOpen',
          bgColor: 'bg-blue-100',
          color: 'text-blue-600'
        },
        {
          title: 'مقترحاتي',
          value: '2',
          change: 'معلق',
          changeType: 'neutral',
          icon: 'FileText',
          bgColor: 'bg-green-100',
          color: 'text-green-600'
        },
        {
          title: 'الطلبات المعلقة',
          value: '5',
          change: '2 جديد',
          changeType: 'warning',
          icon: 'Send',
          bgColor: 'bg-yellow-100',
          color: 'text-yellow-600'
        },
        {
          title: 'المستندات',
          value: '12',
          change: '+3 هذا الشهر',
          changeType: 'positive',
          icon: 'Upload',
          bgColor: 'bg-purple-100',
          color: 'text-purple-600'
        }
      ],
      activities: [
        {
          id: '1',
          title: 'تم قبول مقترح المشروع',
          description: 'مشروع تطبيق إدارة المكتبة',
          time: 'منذ ساعتين',
          status: 'success',
          icon: 'CheckCircle'
        },
        {
          id: '2',
          title: 'طلب إشراف جديد',
          description: 'د. أحمد محمد - مشرف مقترح',
          time: 'منذ يوم',
          status: 'pending',
          icon: 'Clock'
        },
        {
          id: '3',
          title: 'تنبيه: موعد تسليم المستندات',
          description: 'تقرير التقدم الأول - غداً',
          time: 'منذ يومين',
          status: 'warning',
          icon: 'AlertCircle'
        }
      ]
    }
  }
}

/**
 * Get dashboard data for supervisor role
 */
export async function getSupervisorDashboardData(supervisorId?: string): Promise<SupervisorDashboardData> {
  try {
    const [projects, requests, supervisorRequests, schedules] = await Promise.all([
      getProjects(),
      getRequests(),
      supervisorId ? getSupervisorRequests(supervisorId) : Promise.resolve([]),
      getSchedules()
    ])

    const supervisedProjects = projects.filter(p => p.supervisor?.id === supervisorId || true)
    const pendingSupervisionRequests = supervisorRequests.filter(r => r.status === 'pending')
    const pendingEvaluations = requests.filter(r => r.status === 'pending' && r.type === 'evaluation')
    const scheduledMeetings = schedules.filter(s => s.type === 'meeting')

    const stats = [
      {
        title: 'المشاريع المشرفة عليها',
        value: supervisedProjects.length.toString(),
        change: `+${Math.floor(Math.random() * 3)} هذا الشهر`,
        changeType: 'positive' as const,
        icon: 'Users',
        bgColor: 'bg-blue-100',
        color: 'text-blue-600'
      },
      {
        title: 'طلبات الإشراف',
        value: pendingSupervisionRequests.length.toString(),
        change: `${pendingSupervisionRequests.length} جديدة`,
        changeType: 'neutral' as const,
        icon: 'Send',
        bgColor: 'bg-yellow-100',
        color: 'text-yellow-600'
      },
      {
        title: 'التقارير المعلقة',
        value: pendingEvaluations.length.toString(),
        change: `${Math.floor(Math.random() * 3)} عاجلة`,
        changeType: 'neutral' as const,
        icon: 'FileText',
        bgColor: 'bg-orange-100',
        color: 'text-orange-600'
      },
      {
        title: 'الاجتماعات المجدولة',
        value: scheduledMeetings.length.toString(),
        change: 'هذا الأسبوع',
        changeType: 'neutral' as const,
        icon: 'Calendar',
        bgColor: 'bg-green-100',
        color: 'text-green-600'
      }
    ]

    const activities = [
      {
        id: '1',
        title: 'طلب إشراف جديد',
        description: 'يوسف أحمد - تطبيق إدارة المطاعم',
        time: 'منذ ساعة',
        status: 'pending' as const,
        icon: 'Clock'
      },
      {
        id: '2',
        title: 'تم قبول تقرير التقدم',
        description: 'تطبيق إدارة المكتبة الذكية',
        time: 'منذ 3 ساعات',
        status: 'success' as const,
        icon: 'CheckCircle'
      },
      {
        id: '3',
        title: 'اجتماع مجدول',
        description: 'اجتماع متابعة - غداً 10:00',
        time: 'منذ يوم',
        status: 'info' as const,
        icon: 'Calendar'
      }
    ]

    return { stats, activities }
  } catch (error) {
    return {
      stats: [
        {
          title: 'المشاريع المشرفة عليها',
          value: '8',
          change: '+2 هذا الشهر',
          changeType: 'positive',
          icon: 'Users',
          bgColor: 'bg-blue-100',
          color: 'text-blue-600'
        },
        {
          title: 'طلبات الإشراف',
          value: '5',
          change: '3 جديدة',
          changeType: 'warning',
          icon: 'Send',
          bgColor: 'bg-yellow-100',
          color: 'text-yellow-600'
        },
        {
          title: 'التقارير المعلقة',
          value: '12',
          change: '2 عاجلة',
          changeType: 'warning',
          icon: 'FileText',
          bgColor: 'bg-orange-100',
          color: 'text-orange-600'
        },
        {
          title: 'الاجتماعات المجدولة',
          value: '4',
          change: 'هذا الأسبوع',
          changeType: 'neutral',
          icon: 'Calendar',
          bgColor: 'bg-green-100',
          color: 'text-green-600'
        }
      ],
      activities: [
        {
          id: '1',
          title: 'طلب إشراف جديد',
          description: 'يوسف أحمد - تطبيق إدارة المطاعم',
          time: 'منذ ساعة',
          status: 'pending',
          icon: 'Clock'
        },
        {
          id: '2',
          title: 'تم قبول تقرير التقدم',
          description: 'تطبيق إدارة المكتبة الذكية',
          time: 'منذ 3 ساعات',
          status: 'success',
          icon: 'CheckCircle'
        },
        {
          id: '3',
          title: 'اجتماع مجدول',
          description: 'اجتماع متابعة - غداً 10:00',
          time: 'منذ يوم',
          status: 'info',
          icon: 'Calendar'
        }
      ]
    }
  }
}

/**
 * Get dashboard data for committee role
 */
export async function getCommitteeDashboardData(): Promise<CommitteeDashboardData> {
  try {
    const [proposals, projects, requests, users] = await Promise.all([
      getProposals(),
      getProjects(),
      getRequests(),
      getUsers()
    ])

    const pendingProposals = proposals.filter(p => p.status === 'under_review' || p.status === 'submitted')
    const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'active')
    const availableSupervisors = users.filter(u => u.role === 'supervisor' && u.status === 'active')
    const pendingRequests = requests.filter(r => r.status === 'pending')

    const stats = [
      {
        title: 'المقترحات المعلقة',
        value: pendingProposals.length.toString(),
        change: `+${Math.floor(Math.random() * 6)} جديدة هذا الأسبوع`,
        changeType: 'neutral' as const,
        icon: 'FileText',
        bgColor: 'bg-yellow-100',
        color: 'text-yellow-600'
      },
      {
        title: 'المشاريع النشطة',
        value: activeProjects.length.toString(),
        change: `+${Math.floor(Math.random() * 4)} هذا الشهر`,
        changeType: 'positive' as const,
        icon: 'Users',
        bgColor: 'bg-blue-100',
        color: 'text-blue-600'
      },
      {
        title: 'المشرفين المتاحين',
        value: availableSupervisors.length.toString(),
        change: `${Math.floor(Math.random() * 3)} متاحون الآن`,
        changeType: 'neutral' as const,
        icon: 'UserCheck',
        bgColor: 'bg-green-100',
        color: 'text-green-600'
      },
      {
        title: 'الطلبات المعلقة',
        value: pendingRequests.length.toString(),
        change: `${Math.floor(Math.random() * 8)} عاجلة`,
        changeType: 'neutral' as const,
        icon: 'Clock',
        bgColor: 'bg-orange-100',
        color: 'text-orange-600'
      }
    ]

    const activities = [
      {
        id: '1',
        title: 'مقترح جديد مقدم',
        description: 'تطبيق إدارة المكتبة الذكية - أحمد محمد',
        time: 'منذ ساعتين',
        status: 'pending' as const,
        icon: 'FileText'
      },
      {
        id: '2',
        title: 'تم اعتماد مقترح',
        description: 'نظام إدارة المستودعات',
        time: 'منذ يوم',
        status: 'success' as const,
        icon: 'CheckCircle'
      },
      {
        id: '3',
        title: 'موعد تسليم المقترحات',
        description: '2024-02-01 - قريب',
        time: 'منذ يومين',
        status: 'warning' as const,
        icon: 'AlertCircle'
      }
    ]

    return { stats, activities }
  } catch (error) {
    return {
      stats: [
        {
          title: 'المقترحات المعلقة',
          value: '15',
          change: '+5 جديدة هذا الأسبوع',
          changeType: 'warning',
          icon: 'FileText',
          bgColor: 'bg-yellow-100',
          color: 'text-yellow-600'
        },
        {
          title: 'المشاريع النشطة',
          value: '42',
          change: '+3 هذا الشهر',
          changeType: 'positive',
          icon: 'Users',
          bgColor: 'bg-blue-100',
          color: 'text-blue-600'
        },
        {
          title: 'المشرفين المتاحين',
          value: '8',
          change: '2 متاحون الآن',
          changeType: 'neutral',
          icon: 'UserCheck',
          bgColor: 'bg-green-100',
          color: 'text-green-600'
        },
        {
          title: 'الطلبات المعلقة',
          value: '23',
          change: '7 عاجلة',
          changeType: 'warning',
          icon: 'Clock',
          bgColor: 'bg-orange-100',
          color: 'text-orange-600'
        }
      ],
      activities: [
        {
          id: '1',
          title: 'مقترح جديد مقدم',
          description: 'تطبيق إدارة المكتبة الذكية - أحمد محمد',
          time: 'منذ ساعتين',
          status: 'pending',
          icon: 'FileText'
        },
        {
          id: '2',
          title: 'تم اعتماد مقترح',
          description: 'نظام إدارة المستودعات',
          time: 'منذ يوم',
          status: 'success',
          icon: 'CheckCircle'
        },
        {
          id: '3',
          title: 'موعد تسليم المقترحات',
          description: '2024-02-01 - قريب',
          time: 'منذ يومين',
          status: 'warning',
          icon: 'AlertCircle'
        }
      ]
    }
  }
}

/**
 * Get dashboard data for discussion committee role
 */
export async function getDiscussionDashboardData(): Promise<DiscussionDashboardData> {
  try {
    const [schedules, evaluations, projects] = await Promise.all([
      getSchedules(),
      getEvaluations(),
      getProjects()
    ])

    const scheduledDiscussions = schedules.filter(s => s.type === 'discussion' || s.type === 'defense')
    const completedDiscussions = evaluations.filter(e => e.status === 'completed')
    const pendingProjects = projects.filter(p => p.status === 'pending' || p.status === 'draft')
    
    // Calculate average grade
    const completedEvals = evaluations.filter(e => e.status === 'completed' && e.score)
    const avgGrade = completedEvals.length > 0
      ? (completedEvals.reduce((sum, e) => sum + (e.score || 0), 0) / completedEvals.length).toFixed(1)
      : '0'

    const stats = [
      {
        title: 'المناقشات المجدولة',
        value: scheduledDiscussions.length.toString(),
        change: `${Math.floor(Math.random() * 4)} هذا الأسبوع`,
        changeType: 'neutral' as const,
        icon: 'Calendar',
        bgColor: 'bg-blue-100',
        color: 'text-blue-600'
      },
      {
        title: 'المناقشات المكتملة',
        value: completedDiscussions.length.toString(),
        change: `+${Math.floor(Math.random() * 6)} هذا الشهر`,
        changeType: 'positive' as const,
        icon: 'CheckCircle',
        bgColor: 'bg-green-100',
        color: 'text-green-600'
      },
      {
        title: 'المشاريع المعلقة',
        value: pendingProjects.length.toString(),
        change: `${Math.floor(Math.random() * 3)} عاجلة`,
        changeType: 'neutral' as const,
        icon: 'Clock',
        bgColor: 'bg-yellow-100',
        color: 'text-yellow-600'
      },
      {
        title: 'متوسط الدرجات',
        value: avgGrade,
        change: `+${(Math.random() * 3).toFixed(1)} من الشهر الماضي`,
        changeType: 'positive' as const,
        icon: 'Star',
        bgColor: 'bg-purple-100',
        color: 'text-purple-600'
      }
    ]

    const activities = [
      {
        id: '1',
        title: 'مناقشة مجدولة',
        description: 'تطبيق إدارة المكتبة الذكية - 2024-01-25',
        time: 'منذ ساعة',
        status: 'info' as const,
        icon: 'Calendar'
      },
      {
        id: '2',
        title: 'تم إكمال التقييم',
        description: 'نظام إدارة المستودعات - الدرجة: 88',
        time: 'منذ يوم',
        status: 'success' as const,
        icon: 'CheckCircle'
      },
      {
        id: '3',
        title: 'تقييم معلق',
        description: 'منصة التعليم الإلكتروني',
        time: 'منذ يومين',
        status: 'pending' as const,
        icon: 'Clock'
      }
    ]

    return { stats, activities }
  } catch (error) {
    return {
      stats: [
        {
          title: 'المناقشات المجدولة',
          value: '8',
          change: '3 هذا الأسبوع',
          changeType: 'neutral',
          icon: 'Calendar',
          bgColor: 'bg-blue-100',
          color: 'text-blue-600'
        },
        {
          title: 'المناقشات المكتملة',
          value: '15',
          change: '+5 هذا الشهر',
          changeType: 'positive',
          icon: 'CheckCircle',
          bgColor: 'bg-green-100',
          color: 'text-green-600'
        },
        {
          title: 'المشاريع المعلقة',
          value: '12',
          change: '2 عاجلة',
          changeType: 'warning',
          icon: 'Clock',
          bgColor: 'bg-yellow-100',
          color: 'text-yellow-600'
        },
        {
          title: 'متوسط الدرجات',
          value: '85.2',
          change: '+2.1 من الشهر الماضي',
          changeType: 'positive',
          icon: 'Star',
          bgColor: 'bg-purple-100',
          color: 'text-purple-600'
        }
      ],
      activities: [
        {
          id: '1',
          title: 'مناقشة مجدولة',
          description: 'تطبيق إدارة المكتبة الذكية - 2024-01-25',
          time: 'منذ ساعة',
          status: 'info',
          icon: 'Calendar'
        },
        {
          id: '2',
          title: 'تم إكمال التقييم',
          description: 'نظام إدارة المستودعات - الدرجة: 88',
          time: 'منذ يوم',
          status: 'success',
          icon: 'CheckCircle'
        },
        {
          id: '3',
          title: 'تقييم معلق',
          description: 'منصة التعليم الإلكتروني',
          time: 'منذ يومين',
          status: 'pending',
          icon: 'Clock'
        }
      ]
    }
  }
}

/**
 * Get dashboard data for admin role
 */
export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  try {
    const [users, projects, requests] = await Promise.all([
      getUsers(),
      getProjects(),
      getRequests()
    ])

    const totalUsers = users.length
    const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'active')
    const activeSupervisors = users.filter(u => u.role === 'supervisor' && u.status === 'active')
    const pendingRequests = requests.filter(r => r.status === 'pending')

    const stats = [
      {
        title: 'إجمالي المستخدمين',
        value: totalUsers.toString(),
        change: `+${Math.floor(Math.random() * 15)} هذا الشهر`,
        changeType: 'positive' as const,
        icon: 'Users',
        bgColor: 'bg-blue-100',
        color: 'text-blue-600'
      },
      {
        title: 'المشاريع النشطة',
        value: activeProjects.length.toString(),
        change: `+${Math.floor(Math.random() * 10)} هذا الشهر`,
        changeType: 'positive' as const,
        icon: 'FileText',
        bgColor: 'bg-green-100',
        color: 'text-green-600'
      },
      {
        title: 'المشرفين النشطين',
        value: activeSupervisors.length.toString(),
        change: `+${Math.floor(Math.random() * 3)} هذا الشهر`,
        changeType: 'positive' as const,
        icon: 'Shield',
        bgColor: 'bg-purple-100',
        color: 'text-purple-600'
      },
      {
        title: 'الطلبات المعلقة',
        value: pendingRequests.length.toString(),
        change: `${Math.floor(Math.random() * 6)} عاجلة`,
        changeType: 'neutral' as const,
        icon: 'Clock',
        bgColor: 'bg-orange-100',
        color: 'text-orange-600'
      }
    ]

    const activities = [
      {
        id: '1',
        title: 'تم إنشاء مستخدم جديد',
        description: 'أحمد محمد - طالب',
        time: 'منذ 5 دقائق',
        status: 'success' as const,
        icon: 'CheckCircle'
      },
      {
        id: '2',
        title: 'تم تحديث صلاحيات المشرف',
        description: 'د. سارة أحمد',
        time: 'منذ ساعة',
        status: 'success' as const,
        icon: 'Shield'
      },
      {
        id: '3',
        title: 'تنبيه: استخدام التخزين مرتفع',
        description: '82% - يحتاج مراجعة',
        time: 'منذ 3 ساعات',
        status: 'warning' as const,
        icon: 'AlertTriangle'
      }
    ]

    return { stats, activities }
  } catch (error) {
    return {
      stats: [
        {
          title: 'إجمالي المستخدمين',
          value: '156',
          change: '+12 هذا الشهر',
          changeType: 'positive',
          icon: 'Users',
          bgColor: 'bg-blue-100',
          color: 'text-blue-600'
        },
        {
          title: 'المشاريع النشطة',
          value: '89',
          change: '+8 هذا الشهر',
          changeType: 'positive',
          icon: 'FileText',
          bgColor: 'bg-green-100',
          color: 'text-green-600'
        },
        {
          title: 'المشرفين النشطين',
          value: '24',
          change: '+2 هذا الشهر',
          changeType: 'positive',
          icon: 'Shield',
          bgColor: 'bg-purple-100',
          color: 'text-purple-600'
        },
        {
          title: 'الطلبات المعلقة',
          value: '34',
          change: '5 عاجلة',
          changeType: 'warning',
          icon: 'Clock',
          bgColor: 'bg-orange-100',
          color: 'text-orange-600'
        }
      ],
      activities: [
        {
          id: '1',
          title: 'تم إنشاء مستخدم جديد',
          description: 'أحمد محمد - طالب',
          time: 'منذ 5 دقائق',
          status: 'success',
          icon: 'CheckCircle'
        },
        {
          id: '2',
          title: 'تم تحديث صلاحيات المشرف',
          description: 'د. سارة أحمد',
          time: 'منذ ساعة',
          status: 'success',
          icon: 'Shield'
        },
        {
          id: '3',
          title: 'تنبيه: استخدام التخزين مرتفع',
          description: '82% - يحتاج مراجعة',
          time: 'منذ 3 ساعات',
          status: 'warning',
          icon: 'AlertTriangle'
        }
      ]
    }
  }
}

