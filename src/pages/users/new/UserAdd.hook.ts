import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { CreateUserInput, User } from '../schema'
import { createUser as createUserService } from '@/services/users.service'

export function useUserAdd() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createUser = async (data: CreateUserInput): Promise<User> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newUser = await createUserService({
        ...data,
        status: data.status || 'active',
        permissions: data.permissions || []
      })
      setIsLoading(false)
      return newUser
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في إنشاء المستخدم')
      setIsLoading(false)
      throw err
    }
  }

  return {
    createUser,
    isLoading,
    error
  }
}

