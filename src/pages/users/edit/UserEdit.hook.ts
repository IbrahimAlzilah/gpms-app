import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { UpdateUserInput, User } from '../schema'
import { getUserById, updateUser as updateUserService } from '@/services/users.service'

export function useUserEdit(userId: string) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    if (userId) {
      loadUser()
    }
  }, [userId])

  const loadUser = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getUserById(userId)
      setUserData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المستخدم')
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (data: UpdateUserInput): Promise<User> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const updated = await updateUserService(userId, data)
      setUserData(updated)
      setIsLoading(false)
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحديث المستخدم')
      setIsLoading(false)
      throw err
    }
  }

  return {
    user: userData,
    updateUser,
    isLoading,
    error,
    refetch: loadUser
  }

  return {
    updateUser,
    isLoading,
    error
  }
}

