import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginPage from '../pages/auth/LoginPage'
import DashboardLayout from '../components/layout/MainLayout'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// Student Routes
import StudentDashboard from '../pages/student/StudentDashboard'
import StudentProjects from '../pages/student/StudentProjects'
import StudentProposals from '../pages/student/StudentProposals'
import StudentRequests from '../pages/student/StudentRequests'
import StudentDocuments from '../pages/student/StudentDocuments'
import StudentGroupManagement from '../pages/student/StudentGroupManagement'
import StudentGrades from '../pages/student/StudentGrades'

// Supervisor Routes
import SupervisorDashboard from '../pages/supervisor/SupervisorDashboard'
import SupervisorRequests from '../pages/supervisor/SupervisorRequests'
import SupervisorProjects from '../pages/supervisor/SupervisorProjects'
import SupervisorEvaluations from '../pages/supervisor/SupervisorEvaluations'
import SupervisorNotes from '../pages/supervisor/SupervisorNotes'
// import SupervisorSchedule from '../pages/supervisor/SupervisorSchedule'

// Committee Routes
import CommitteeDashboard from '../pages/committee/CommitteeDashboard'
import CommitteeProposals from '../pages/committee/CommitteeProposals'
import CommitteeProjects from '../pages/committee/CommitteeProjects'
import CommitteeSchedules from '../pages/committee/CommitteeSchedules'
import CommitteeReports from '../pages/committee/CommitteeReports'
import CommitteeAnnouncements from '../pages/committee/CommitteeAnnouncements'
import CommitteeDistribution from '../pages/committee/CommitteeDistribution'

// Discussion Routes
import DiscussionDashboard from '../pages/discussion/DiscussionDashboard'
import DiscussionProjects from '../pages/discussion/DiscussionProjects'
import DiscussionEvaluations from '../pages/discussion/DiscussionEvaluations'

// Admin Routes
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from '../pages/admin/AdminUsers'
import AdminReports from '../pages/admin/AdminReports'

// Demo Routes
import ComponentsDemo from '../pages/ComponentsDemo'
import SupervisorProposals from '@/pages/supervisor/SupervisorProposals'

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <DashboardLayout>
      <Routes>
        {/* Student Routes */}
        {user?.role === 'student' && (
          <>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/projects" element={<StudentProjects />} />
            <Route path="/proposals" element={<StudentProposals />} />
            <Route path="/requests" element={<StudentRequests />} />
            <Route path="/documents" element={<StudentDocuments />} />
            <Route path="/group-management" element={<StudentGroupManagement />} />
            <Route path="/grades" element={<StudentGrades />} />
          </>
        )}

        {/* Supervisor Routes */}
        {user?.role === 'supervisor' && (
          <>
            <Route path="/" element={<SupervisorDashboard />} />
            <Route path="/dashboard" element={<SupervisorDashboard />} />
            <Route path="/requests" element={<SupervisorRequests />} />
            <Route path="/projects" element={<SupervisorProjects />} />
            <Route path="/proposals" element={<SupervisorProposals />} />
            <Route path="/supervisor/documents" element={<SupervisorDashboard />} />
            <Route path="/supervisor/grades" element={<SupervisorDashboard />} />
            <Route path="/supervisor/evaluations" element={<SupervisorEvaluations />} />
            <Route path="/supervisor/notes" element={<SupervisorNotes />} />
            {/* <Route path="/supervisor/schedule" element={<SupervisorSchedule />} /> */}
          </>
        )}

        {/* Committee Routes */}
        {user?.role === 'committee' && (
          <>
            <Route path="/" element={<CommitteeDashboard />} />
            <Route path="/dashboard" element={<CommitteeDashboard />} />
            <Route path="/proposals" element={<CommitteeProposals />} />
            <Route path="/projects" element={<CommitteeProjects />} />
            <Route path="/schedules" element={<CommitteeSchedules />} />
            <Route path="/committee-reports" element={<CommitteeReports />} />
            <Route path="/announcements" element={<CommitteeAnnouncements />} />
            <Route path="/distribution" element={<CommitteeDistribution />} />
          </>
        )}

        {/* Discussion Routes */}
        {user?.role === 'discussion' && (
          <>
            <Route path="/" element={<DiscussionDashboard />} />
            <Route path="/dashboard" element={<DiscussionDashboard />} />
            <Route path="/projects" element={<DiscussionProjects />} />
            <Route path="/evaluations" element={<DiscussionEvaluations />} />
          </>
        )}

        {/* Admin Routes */}
        {user?.role === 'admin' && (
          <>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="/permissions" element={<AdminUsers />} />
            <Route path="/components-demo" element={<ComponentsDemo />} />
          </>
        )}

        {/* Demo Route - Available for all roles */}
        <Route path="/components-demo" element={<ComponentsDemo />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  )
}

export default AppRoutes
