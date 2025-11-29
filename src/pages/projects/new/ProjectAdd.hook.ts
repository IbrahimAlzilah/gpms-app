import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { CreateProjectInput, Project } from '../schema'
import { createProject as createProjectService } from '@/services/projects.service'

export function useProjectAdd() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProject = async (data: CreateProjectInput): Promise<Project> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newProject = await createProjectService({
        ...data,
        status: data.status || 'draft'
      })
      setIsLoading(false)
      return newProject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في إنشاء المشروع')
      setIsLoading(false)
      throw err
    }
  }

  return {
    createProject,
    isLoading,
    error
  }
}

