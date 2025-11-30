import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  getStudentDashboardData,
  getSupervisorDashboardData,
  getCommitteeDashboardData,
  getDiscussionDashboardData,
  getAdminDashboardData
} from '@/services/dashboard.service'
import {
  StudentDashboardData,
  SupervisorDashboardData,
  CommitteeDashboardData,
  DiscussionDashboardData,
  AdminDashboardData
} from '../types'

type DashboardData =
  | StudentDashboardData
  | SupervisorDashboardData
  | CommitteeDashboardData
  | DiscussionDashboardData
  | AdminDashboardData

export const useDashboardData = () => {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        let dashboardData: DashboardData

        switch (user.role) {
          case 'student':
            dashboardData = await getStudentDashboardData(user.id)
            break
          case 'supervisor':
            dashboardData = await getSupervisorDashboardData(user.id)
            break
          case 'committee':
            dashboardData = await getCommitteeDashboardData()
            break
          case 'discussion':
            dashboardData = await getDiscussionDashboardData()
            break
          case 'admin':
            dashboardData = await getAdminDashboardData()
            break
          default:
            throw new Error(`Unknown role: ${user.role}`)
        }

        setData(dashboardData)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  return { data, isLoading, error }
}

