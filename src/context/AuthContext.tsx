import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  username: string
  email: string
  fullName: string
  role: 'student' | 'supervisor' | 'committee' | 'discussion' | 'admin'
  department?: string
  studentId?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('gpms_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem('gpms_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Mock authentication - replace with actual API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      // Mock user data based on username
      const mockUsers: Record<string, User> = {
        'student': {
          id: '1',
          username: 'student',
          email: 'student@university.edu',
          fullName: 'أحمد محمد علي',
          role: 'student',
          department: 'هندسة الحاسوب',
          studentId: '2021001234',
          avatar: '/avatars/student.jpg'
        },
        'supervisor': {
          id: '2',
          username: 'supervisor',
          email: 'supervisor@university.edu',
          fullName: 'د. سارة أحمد',
          role: 'supervisor',
          department: 'هندسة الحاسوب',
          avatar: '/avatars/supervisor.jpg'
        },
        'committee': {
          id: '3',
          username: 'committee',
          email: 'committee@university.edu',
          fullName: 'د. محمد حسن',
          role: 'committee',
          department: 'هندسة الحاسوب',
          avatar: '/avatars/committee.jpg'
        },
        'discussion': {
          id: '4',
          username: 'discussion',
          email: 'discussion@university.edu',
          fullName: 'د. فاطمة علي',
          role: 'discussion',
          department: 'هندسة الحاسوب',
          avatar: '/avatars/discussion.jpg'
        },
        'admin': {
          id: '5',
          username: 'admin',
          email: 'admin@university.edu',
          fullName: 'د. خالد محمود',
          role: 'admin',
          department: 'هندسة الحاسوب',
          avatar: '/avatars/admin.jpg'
        }
      }

      const user = mockUsers[username.toLowerCase()]
      if (user && password === 'password') {
        setUser(user)
        localStorage.setItem('gpms_user', JSON.stringify(user))
        setIsLoading(false)
        return true
      } else {
        setIsLoading(false)
        return false
      }
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('gpms_user')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('gpms_user', JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
