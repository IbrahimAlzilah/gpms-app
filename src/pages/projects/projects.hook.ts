import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getStudentProjects, getProjects } from '@/services/projects.service'
import { Project, ProjectStatus, Priority } from './schema'

export interface UseProjectsOptions {
  role?: 'student' | 'supervisor' | 'committee' | 'discussion'
}

export function useProjects(options?: UseProjectsOptions) {
  const { user } = useAuth()
  const role = options?.role || user?.role || 'student'
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setError(null)

    const fetchProjects = async () => {
      try {
        let data: Project[] = []
        
        if (role === 'student') {
          data = await getStudentProjects()
        } else {
          data = await getProjects()
        }

        if (!isMounted) return
        setProjects(data as Project[])
        setIsLoading(false)
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المشاريع')
        setIsLoading(false)
      }
    }

    fetchProjects()
    return () => { isMounted = false }
  }, [role])

  const filteredProjects = useMemo(() => {
    return projects
  }, [projects])

  const canCreate = role === 'student'
  const canEdit = role === 'student' || role === 'supervisor' || role === 'committee'
  const canDelete = role === 'student'
  const canApprove = role === 'committee'
  const canEvaluate = role === 'supervisor' || role === 'discussion'

  return {
    projects: filteredProjects,
    isLoading,
    error,
    canCreate,
    canEdit,
    canDelete,
    canApprove,
    canEvaluate,
    refetch: () => {
      // Trigger refetch by updating dependency
      setProjects([...projects])
    }
  }
}

