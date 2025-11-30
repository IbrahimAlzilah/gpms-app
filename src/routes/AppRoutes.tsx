import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import MainLayout from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth'

// Auth
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))

// Feature-based routes
const Dashboard = lazy(() => import('@/pages/dashboards'))
const Projects = lazy(() => import('@/pages/projects'))
const ProjectAdd = lazy(() => import('@/pages/projects/new'))
const ProjectEdit = lazy(() => import('@/pages/projects/edit'))
const Proposals = lazy(() => import('@/pages/proposals'))
const MyProposals = lazy(() => import('@/pages/proposals/my-proposals'))
const GroupProposals = lazy(() => import('@/pages/proposals/group-proposals'))
const ApprovedProposals = lazy(() => import('@/pages/proposals/approved-proposals'))
const ProposalAdd = lazy(() => import('@/pages/proposals/new'))
const ProposalEdit = lazy(() => import('@/pages/proposals/edit'))
const Documents = lazy(() => import('@/pages/documents'))
const DocumentAdd = lazy(() => import('@/pages/documents/new'))
const DocumentEdit = lazy(() => import('@/pages/documents/edit'))
const Evaluations = lazy(() => import('@/pages/evaluations'))
const EvaluationAdd = lazy(() => import('@/pages/evaluations/new'))
const EvaluationEdit = lazy(() => import('@/pages/evaluations/edit'))
const Requests = lazy(() => import('@/pages/requests'))
const RequestAdd = lazy(() => import('@/pages/requests/new'))
const RequestEdit = lazy(() => import('@/pages/requests/edit'))
const Schedules = lazy(() => import('@/pages/schedules'))
const ScheduleAdd = lazy(() => import('@/pages/schedules/new'))
const ScheduleEdit = lazy(() => import('@/pages/schedules/edit'))
const Reports = lazy(() => import('@/pages/reports'))
const Users = lazy(() => import('@/pages/users'))
const UserAdd = lazy(() => import('@/pages/users/new'))
const UserEdit = lazy(() => import('@/pages/users/edit'))
const Groups = lazy(() => import('@/pages/groups'))
const Announcements = lazy(() => import('@/pages/announcements'))
const AnnouncementAdd = lazy(() => import('@/pages/announcements/new'))
const AnnouncementEdit = lazy(() => import('@/pages/announcements/edit'))
const Distribution = lazy(() => import('@/pages/distribution'))
const DistributionAdd = lazy(() => import('@/pages/distribution/new'))
const DistributionEdit = lazy(() => import('@/pages/distribution/edit'))
const SupervisorRequests = lazy(() => import('@/pages/supervisor-requests'))

// Demo Route
const ComponentsDemo = lazy(() => import('@/pages/ComponentsDemo'))

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth()

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
          {/* Dashboard - All roles */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['student', 'supervisor', 'committee', 'discussion', 'admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student', 'supervisor', 'committee', 'discussion', 'admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Projects - Student, Supervisor, Committee, Discussion */}
          <Route
            path="/projects"
            element={
              <ProtectedRoute allowedRoles={['student', 'supervisor', 'committee', 'discussion']}>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/new"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProjectAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['student', 'supervisor']}>
                <ProjectEdit />
              </ProtectedRoute>
            }
          />

          {/* Proposals - Student, Supervisor, Committee */}
          <Route
            path="/proposals"
            element={
              <ProtectedRoute allowedRoles={['student', 'supervisor', 'committee']}>
                <Proposals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proposals/new"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProposalAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proposals/my"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyProposals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proposals/group"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <GroupProposals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proposals/approved"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <ApprovedProposals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proposals/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProposalEdit />
              </ProtectedRoute>
            }
          />

          {/* Documents - Student, Supervisor, Committee */}
          <Route
            path="/documents"
            element={
              <ProtectedRoute allowedRoles={['student', 'supervisor', 'committee']}>
                <Documents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/new"
            element={
              <ProtectedRoute allowedRoles={['student', 'supervisor']}>
                <DocumentAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['student', 'supervisor']}>
                <DocumentEdit />
              </ProtectedRoute>
            }
          />

          {/* Evaluations - Student, Supervisor, Discussion */}
          <Route
            path="/evaluations"
            element={
              <ProtectedRoute allowedRoles={['student', 'supervisor', 'discussion']}>
                <Evaluations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evaluations/new"
            element={
              <ProtectedRoute allowedRoles={['supervisor', 'discussion']}>
                <EvaluationAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/evaluations/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['supervisor', 'discussion']}>
                <EvaluationEdit />
              </ProtectedRoute>
            }
          />

          {/* Requests - Student, Supervisor, Committee */}
          <Route
            path="/requests"
            element={
              <ProtectedRoute allowedRoles={['student', 'supervisor', 'committee']}>
                <Requests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/new"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <RequestAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <RequestEdit />
              </ProtectedRoute>
            }
          />

          {/* Schedules - Supervisor, Committee */}
          <Route
            path="/schedules"
            element={
              <ProtectedRoute allowedRoles={['supervisor', 'committee']}>
                <Schedules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedules/new"
            element={
              <ProtectedRoute allowedRoles={['committee']}>
                <ScheduleAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedules/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['committee']}>
                <ScheduleEdit />
              </ProtectedRoute>
            }
          />

          {/* Reports - Committee, Admin */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['committee', 'admin']}>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Users - Admin */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/new"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/permissions"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Users />
              </ProtectedRoute>
            }
          />

          {/* Groups - Student, Supervisor */}
          <Route
            path="/groups"
            element={
              <ProtectedRoute allowedRoles={['student', 'supervisor']}>
                <Groups />
              </ProtectedRoute>
            }
          />

          {/* Supervisor Requests - Supervisor */}
          <Route
            path="/supervisor-requests"
            element={
              <ProtectedRoute allowedRoles={['supervisor']}>
                <SupervisorRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/group-management"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Groups />
              </ProtectedRoute>
            }
          />

          {/* Announcements - Committee */}
          <Route
            path="/announcements"
            element={
              <ProtectedRoute allowedRoles={['committee']}>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements/new"
            element={
              <ProtectedRoute allowedRoles={['committee']}>
                <AnnouncementAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['committee']}>
                <AnnouncementEdit />
              </ProtectedRoute>
            }
          />

          {/* Distribution - Committee */}
          <Route
            path="/distribution"
            element={
              <ProtectedRoute allowedRoles={['committee']}>
                <Distribution />
              </ProtectedRoute>
            }
          />
          <Route
            path="/distribution/new"
            element={
              <ProtectedRoute allowedRoles={['committee']}>
                <DistributionAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/distribution/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['committee']}>
                <DistributionEdit />
              </ProtectedRoute>
            }
          />

          {/* Demo Route - Available for all roles */}
          <Route
            path="/components-demo"
            element={
              <ProtectedRoute allowedRoles={['student', 'supervisor', 'committee', 'discussion', 'admin']}>
                <ComponentsDemo />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </MainLayout>
  )
}

export default AppRoutes
