import React from 'react'
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Send,
  Upload,
  Users,
  Calendar,
  BarChart3,
  Award,
  Shield,
  FileCheck,
  UserPlus,
  FileBarChart,
  Megaphone,
  UserCheck
} from 'lucide-react'

import {
  FolderOpen as MyProposalsIcon,
  Users as GroupProposalsIcon,
  CheckCircle2 as ApprovedProposalsIcon
} from 'lucide-react'

export type RoleKey = 'student' | 'supervisor' | 'committee' | 'discussion' | 'admin'

export interface SubMenuConfigItem {
  key: string
  labelKey?: string
  label?: string
  icon: React.ReactElement
  route: string
}

export interface NavigationConfigItem {
  key?: string
  nameKey?: string
  name?: string
  href: string
  icon: React.ComponentType<any>
  hasSubMenu?: boolean
  subMenuItems?: SubMenuConfigItem[]
}

export const baseNavigation: NavigationConfigItem[] = [
  { nameKey: 'common.dashboard', href: '/dashboard', icon: LayoutDashboard }
]

export const roleNavigation: Record<RoleKey, NavigationConfigItem[]> = {
  student: [
    { nameKey: 'navigation.projects', href: '/projects', icon: FolderOpen },
    {
      key: 'proposals',
      nameKey: 'navigation.proposals',
      href: '/proposals',
      icon: FileText,
      hasSubMenu: true,
      subMenuItems: [
        { key: 'my', label: 'مقترحاتي', icon: <MyProposalsIcon className="w-4 h-4" />, route: '/student/proposals/my' },
        { key: 'group', label: 'مقترحات مجموعتي', icon: <GroupProposalsIcon className="w-4 h-4" />, route: '/student/proposals/group' },
        { key: 'approved', label: 'المقترحات المعتمدة', icon: <ApprovedProposalsIcon className="w-4 h-4" />, route: '/student/proposals/approved' }
      ]
    },
    { nameKey: 'navigation.requests', href: '/requests', icon: Send },
    { nameKey: 'navigation.documents', href: '/documents', icon: Upload },
    { name: 'إدارة المجموعة', href: '/group-management', icon: UserPlus },
    { nameKey: 'navigation.grades', href: '/grades', icon: Award }
  ],
  supervisor: [
    { name: 'قائمة المشاريع', href: '/projects', icon: FolderOpen },
    { nameKey: 'navigation.proposals', href: '/proposals', icon: FileText },
    { nameKey: 'navigation.requests', href: '/requests', icon: Send },
    { nameKey: 'navigation.documents', href: '/supervisor/documents', icon: FileCheck },
    { nameKey: 'navigation.grades', href: '/supervisor/grades', icon: Award }
  ],
  committee: [
    { nameKey: 'navigation.proposals', href: '/proposals', icon: FileText },
    { nameKey: 'navigation.projects', href: '/projects', icon: FolderOpen },
    { nameKey: 'navigation.schedules', href: '/schedules', icon: Calendar },
    { name: 'إعلان الفترات', href: '/announcements', icon: Megaphone },
    { name: 'توزيع اللجان', href: '/distribution', icon: UserCheck },
    { name: 'إصدار التقارير', href: '/committee-reports', icon: FileBarChart }
  ],
  discussion: [
    { nameKey: 'navigation.projects', href: '/projects', icon: FolderOpen },
    { nameKey: 'navigation.evaluations', href: '/evaluations', icon: Award }
  ],
  admin: [
    { nameKey: 'navigation.users', href: '/users', icon: Users },
    { nameKey: 'navigation.reports', href: '/reports', icon: BarChart3 },
    { nameKey: 'navigation.permissions', href: '/permissions', icon: Shield }
  ]
}


