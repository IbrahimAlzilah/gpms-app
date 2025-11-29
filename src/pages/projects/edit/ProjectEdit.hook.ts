import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { UpdateProjectInput, Project } from '../schema'
import { getProjectById, updateProject as updateProjectService } from '@/services/projects.service'

export function useProjectEdit(projectId: string) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    if (projectId) {
      loadProject()
    }
  }, [projectId])

  const loadProject = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getProjectById(projectId)
      setProject(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المشروع')
    } finally {
      setIsLoading(false)
    }
  }

  const updateProject = async (data: UpdateProjectInput): Promise<Project> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const updated = await updateProjectService(projectId, data)
      setProject(updated)
      setIsLoading(false)
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحديث المشروع')
      setIsLoading(false)
      throw err
    }
  }

  return {
    project,
    updateProject,
    isLoading,
    error,
    refetch: loadProject
  }

  return {
    updateProject,
    isLoading,
    error
  }
}

