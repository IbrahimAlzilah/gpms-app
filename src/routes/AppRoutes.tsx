import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import MainLayout from '@/components/layout/MainLayout'

// Auth
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))

// Student Routes (lazy)
const StudentDashboard = lazy(() => import('@/pages/student/StudentDashboard'))
const StudentProjects = lazy(() => import('@/pages/student/StudentProjects'))
const StudentProposals = lazy(() => import('@/pages/student/StudentProposals'))
const StudentRequests = lazy(() => import('@/pages/student/StudentRequests'))
const StudentDocuments = lazy(() => import('@/pages/student/StudentDocuments'))
const StudentGroupManagement = lazy(() => import('@/pages/student/StudentGroupManagement'))
const StudentGrades = lazy(() => import('@/pages/student/StudentGrades'))

// Supervisor Routes (lazy)
const SupervisorDashboard = lazy(() => import('@/pages/supervisor/SupervisorDashboard'))
const SupervisorRequests = lazy(() => import('@/pages/supervisor/SupervisorRequests'))
const SupervisorProjects = lazy(() => import('@/pages/supervisor/SupervisorProjects'))
const SupervisorEvaluations = lazy(() => import('@/pages/supervisor/SupervisorEvaluations'))
const SupervisorNotes = lazy(() => import('@/pages/supervisor/SupervisorNotes'))
const SupervisorSchedule = lazy(() => import('@/pages/supervisor/SupervisorSchedule'))

// Committee Routes (lazy)
const CommitteeDashboard = lazy(() => import('@/pages/committee/CommitteeDashboard'))
const CommitteeProposals = lazy(() => import('@/pages/committee/CommitteeProposals'))
const CommitteeProjects = lazy(() => import('@/pages/committee/CommitteeProjects'))
const CommitteeSchedules = lazy(() => import('@/pages/committee/CommitteeSchedules'))
const CommitteeReports = lazy(() => import('@/pages/committee/CommitteeReports'))
const CommitteeAnnouncements = lazy(() => import('@/pages/committee/CommitteeAnnouncements'))
const CommitteeDistribution = lazy(() => import('@/pages/committee/CommitteeDistribution'))

// Discussion Routes (lazy)
const DiscussionDashboard = lazy(() => import('@/pages/discussion/DiscussionDashboard'))
const DiscussionProjects = lazy(() => import('@/pages/discussion/DiscussionProjects'))
const DiscussionEvaluations = lazy(() => import('@/pages/discussion/DiscussionEvaluations'))

// Admin Routes (lazy)
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'))
const AdminReports = lazy(() => import('@/pages/admin/AdminReports'))

// Demo Routes (lazy)
const ComponentsDemo = lazy(() => import('@/pages/ComponentsDemo'))
const SupervisorProposals = lazy(() => import('@/pages/supervisor/SupervisorProposals'))

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    )
  }

  return (
    <MainLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
        {/* Student Routes */}
        {user?.role === 'student' && (
          <>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/projects" element={<StudentProjects />} />
            <Route path="/proposals" element={<StudentProposals />} />
            <Route path="/student/proposals/my" element={<StudentProposals />} />
            <Route path="/student/proposals/group" element={<StudentProposals />} />
            <Route path="/student/proposals/approved" element={<StudentProposals />} />
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
            <Route path="/supervisor/schedule" element={<SupervisorSchedule />} />
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
      </Suspense>
    </MainLayout>
  )
}

export default AppRoutes
