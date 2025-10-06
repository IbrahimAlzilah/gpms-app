// Central export for mock data used across the app

export interface ProjectSummary {
  id: string
  title: string
  status: 'pending' | 'approved' | 'rejected' | 'in_progress'
  supervisorName: string
}

export const mockProjects: ProjectSummary[] = [
  { id: 'p1', title: 'Smart Campus Navigation', status: 'in_progress', supervisorName: 'Dr. Ahmed' },
  { id: 'p2', title: 'AI-based Plagiarism Detector', status: 'approved', supervisorName: 'Dr. Sara' },
  { id: 'p3', title: 'IoT Health Monitoring', status: 'pending', supervisorName: 'Dr. Omar' },
]

export interface ProposalSummary {
  id: string
  title: string
  submittedAt: string
  state: 'draft' | 'submitted' | 'review' | 'approved' | 'rejected'
}

export const mockProposals: ProposalSummary[] = [
  { id: 'pr1', title: 'Energy Efficient Buildings', submittedAt: '2025-09-01', state: 'review' },
  { id: 'pr2', title: 'E-Learning Engagement Analytics', submittedAt: '2025-09-12', state: 'submitted' },
]


// Detailed Student Projects mock (used by StudentProjects page)
export interface StudentProject {
  id: string
  title: string
  description: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'pending'
  priority: 'low' | 'medium' | 'high'
  supervisor: string
  startDate: string
  endDate: string
  progress: number
  teamMembers: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
  supervisorNotes?: string
  lastMeetingDate?: string
  nextMeetingDate?: string
  milestones?: {
    id: string
    title: string
    dueDate: string
    completed: boolean
    progress: number
  }[]
}

export const mockStudentProjects: StudentProject[] = [
  {
    id: '1',
    title: 'تطبيق إدارة المكتبة الذكية',
    description: 'تطبيق ويب لإدارة المكتبات باستخدام تقنيات حديثة',
    status: 'in_progress',
    priority: 'high',
    supervisor: 'د. أحمد محمد',
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    progress: 65,
    teamMembers: ['أحمد علي', 'فاطمة حسن', 'محمد خالد'],
    tags: ['تطوير ويب', 'ذكاء اصطناعي', 'قواعد البيانات'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-22',
    supervisorNotes: 'التقدم ممتاز في المرحلة الأولى. يرجى التركيز على تحسين واجهة المستخدم وإضافة المزيد من الاختبارات.',
    lastMeetingDate: '2024-01-20',
    nextMeetingDate: '2024-01-27',
    milestones: [
      { id: '1', title: 'تحليل المتطلبات', dueDate: '2024-01-15', completed: true, progress: 100 },
      { id: '2', title: 'تصميم قاعدة البيانات', dueDate: '2024-01-30', completed: true, progress: 100 },
      { id: '3', title: 'تطوير الواجهة الأمامية', dueDate: '2024-02-15', completed: false, progress: 70 },
      { id: '4', title: 'تطوير الواجهة الخلفية', dueDate: '2024-03-01', completed: false, progress: 40 }
    ]
  },
  {
    id: '2',
    title: 'نظام إدارة المستودعات',
    description: 'نظام لإدارة المخزون والمستودعات',
    status: 'completed',
    priority: 'medium',
    supervisor: 'د. سارة أحمد',
    startDate: '2023-09-01',
    endDate: '2023-12-15',
    progress: 100,
    teamMembers: ['علي محمود', 'نور الدين'],
    tags: ['إدارة المخزون', 'قواعد البيانات'],
    createdAt: '2023-09-01',
    updatedAt: '2023-12-15'
  },
  {
    id: '3',
    title: 'منصة التعليم الإلكتروني',
    description: 'منصة تفاعلية للتعليم عن بعد',
    status: 'pending',
    priority: 'low',
    supervisor: 'د. خالد محمود',
    startDate: '2024-02-01',
    endDate: '2024-07-01',
    progress: 0,
    teamMembers: ['سارة محمد', 'يوسف أحمد'],
    tags: ['تعليم إلكتروني', 'تفاعل', 'واجهة مستخدم'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '4',
    title: 'نظام إدارة المستشفى',
    description: 'نظام شامل لإدارة العمليات الطبية والمواعيد',
    status: 'approved',
    priority: 'high',
    supervisor: 'د. فاطمة علي',
    startDate: '2024-01-10',
    endDate: '2024-05-10',
    progress: 30,
    teamMembers: ['محمد أحمد', 'نورا حسن'],
    tags: ['إدارة المستشفى', 'قواعد البيانات', 'واجهة مستخدم'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-25'
  },
  {
    id: '5',
    title: 'تطبيق التجارة الإلكترونية',
    description: 'منصة تجارة إلكترونية متكاملة مع نظام دفع آمن',
    status: 'rejected',
    priority: 'medium',
    supervisor: 'د. سعد محمود',
    startDate: '2023-12-01',
    endDate: '2024-03-01',
    progress: 0,
    teamMembers: ['أحمد سعد', 'مريم علي'],
    tags: ['التجارة الإلكترونية', 'الدفع الإلكتروني', 'تطوير ويب'],
    createdAt: '2023-12-01',
    updatedAt: '2024-01-18'
  }
]


// Requests mock
export interface RequestItem {
  id: string
  type: 'supervision' | 'meeting' | 'extension' | 'change' | 'change_supervisor' | 'change_group' | 'change_project' | 'other'
  title: string
  description: string
  status: 'pending' | 'approved' | 'rejected' | 'in_progress'
  priority: 'low' | 'medium' | 'high'
  requester?: string
  requesterRole?: 'student' | 'supervisor'
  student?: string
  supervisor?: string
  submissionDate?: string
  requestedDate?: string
  createdAt: string
  updatedAt: string
  responseDate?: string
  responder?: string
  response?: string
  reason?: string
  reviewer?: string
  tags?: string[]
}

export const mockRequests: RequestItem[] = [
  {
    id: 'r1',
    type: 'supervision',
    title: 'طلب إشراف على مشروع الذكاء الاصطناعي',
    description: 'أطلب الإشراف على مشروع تطوير نموذج ذكي لتحليل البيانات الطبية',
    status: 'pending',
    priority: 'high',
    requester: 'أحمد محمد علي',
    requesterRole: 'student',
    submissionDate: '2024-01-20',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-22',
    tags: ['إشراف', 'ذكاء اصطناعي', 'تحليل البيانات']
  },
  {
    id: 'r2',
    type: 'meeting',
    title: 'طلب اجتماع لمناقشة تقدم المشروع',
    description: 'أطلب جدولة اجتماع لمناقشة التقدم المحرز في المرحلة الأولى',
    status: 'approved',
    priority: 'medium',
    requester: 'فاطمة علي محمد',
    requesterRole: 'student',
    submissionDate: '2024-01-18',
    responseDate: '2024-01-21',
    responder: 'د. خالد محمود الحسن',
    response: 'تم الموافقة على الاجتماع، سيتم جدولته خلال الأسبوع القادم',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-21',
    tags: ['اجتماع', 'مناقشة', 'تقدم']
  }
]

// Documents mock
export interface DocumentItem {
  id: string
  title: string
  description: string
  type: 'chapter1' | 'final_report' | 'code' | 'presentation' | 'other'
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'pending_review'
  priority: 'low' | 'medium' | 'high'
  author: string
  authorRole: 'student' | 'supervisor'
  uploadDate: string
  reviewDate?: string
  reviewer?: string
  comments?: string
  fileSize: string
  fileType: string
  version: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export const mockDocuments: DocumentItem[] = [
  {
    id: 'd1',
    title: 'الفصل الأول - مقدمة المشروع',
    description: 'مقدمة شاملة عن مشروع تطوير نظام إدارة المكتبة الذكية',
    type: 'chapter1',
    status: 'approved',
    priority: 'high',
    author: 'أحمد محمد علي',
    authorRole: 'student',
    uploadDate: '2024-01-15',
    reviewDate: '2024-01-20',
    reviewer: 'د. سارة أحمد حسن',
    comments: 'ممتاز، يحتاج لبعض التحسينات في المراجع',
    fileSize: '2.5 MB',
    fileType: 'PDF',
    version: '1.2',
    tags: ['فصل أول', 'مقدمة', 'نظام إدارة'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  }
]

// Users mock
export interface UserItem {
  id: string
  name: string
  email: string
  role: 'student' | 'supervisor' | 'committee' | 'admin'
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export const mockUsers: UserItem[] = [
  { id: 'u1', name: 'أحمد محمد', email: 'ahmed@example.com', role: 'student', createdAt: '2024-01-01', updatedAt: '2024-01-10' },
  { id: 'u2', name: 'د. سارة أحمد', email: 'sara@example.com', role: 'supervisor', createdAt: '2024-01-02', updatedAt: '2024-01-11' },
  { id: 'u3', name: 'لجنة المشاريع', email: 'committee@example.com', role: 'committee', createdAt: '2024-01-03', updatedAt: '2024-01-12' },
]

// Students mock
export interface StudentItem {
  id: string
  userId: string
  studentId: string
  major: string
  level: number
  gpa?: number
  createdAt: string
  updatedAt: string
}

export const mockStudents: StudentItem[] = [
  { id: 's1', userId: 'u1', studentId: '20201234', major: 'علوم الحاسب', level: 8, gpa: 3.4, createdAt: '2024-01-01', updatedAt: '2024-01-10' },
]

// Groups mock
export interface GroupItem {
  id: string
  name: string
  members: string[] // userIds
  supervisorId?: string // userId
  projectId?: string
  createdAt: string
  updatedAt: string
}

export const mockGroups: GroupItem[] = [
  { id: 'g1', name: 'فريق المكتبة الذكية', members: ['u1'], supervisorId: 'u2', projectId: '1', createdAt: '2024-01-01', updatedAt: '2024-01-15' },
]

// Grades mock
export interface GradeItem {
  id: string
  studentId: string // StudentItem.id
  projectId: string // StudentProject.id
  evaluatorId: string // userId
  criteria: string
  score: number // 0-100
  weight?: number // optional weighting
  createdAt: string
  updatedAt: string
}

export const mockGrades: GradeItem[] = [
  { id: 'gr1', studentId: 's1', projectId: '1', evaluatorId: 'u2', criteria: 'تحليل المتطلبات', score: 90, weight: 0.2, createdAt: '2024-01-21', updatedAt: '2024-01-21' },
]

// Schedules mock (meetings, defenses, reviews)
export interface ScheduleItem {
  id: string
  title: string
  type: 'meeting' | 'defense' | 'review' | 'milestone'
  groupId?: string
  projectId?: string
  supervisorId?: string
  attendees: string[] // userIds
  start: string // ISO
  end: string // ISO
  location?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export const mockSchedules: ScheduleItem[] = [
  { id: 'sc1', title: 'اجتماع متابعة أسبوعي', type: 'meeting', groupId: 'g1', projectId: '1', supervisorId: 'u2', attendees: ['u1','u2'], start: '2024-01-27T10:00:00Z', end: '2024-01-27T10:30:00Z', location: 'غرفة الاجتماعات 3', createdAt: '2024-01-20', updatedAt: '2024-01-22' },
]

