import React from 'react'
import { useAuth } from '@/context/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import StudentDashboard from './components/StudentDashboard'
import SupervisorDashboard from './components/SupervisorDashboard'
import CommitteeDashboard from './components/CommitteeDashboard'
import DiscussionDashboard from './components/DiscussionDashboard'
import AdminDashboard from './components/AdminDashboard'

const DashboardScreen: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    )
  }

  // Route to role-specific dashboard component
  switch (user.role) {
    case 'student':
      return <StudentDashboard />
    case 'supervisor':
      return <SupervisorDashboard />
    case 'committee':
      return <CommitteeDashboard />
    case 'discussion':
      return <DiscussionDashboard />
    case 'admin':
      return <AdminDashboard />
    default:
      return (
        <div className="text-center py-12">
          <p className="text-red-600">دور المستخدم غير معروف</p>
        </div>
      )
  }
}

export default DashboardScreen
