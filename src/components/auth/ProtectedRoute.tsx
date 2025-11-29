import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Role, canAccessRoute } from '@/utils/permissions'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface ProtectedRouteProps {
    children: React.ReactElement
    allowedRoles: Role[]
    redirectTo?: string
    fallback?: React.ReactElement
}

/**
 * Protected Route Component
 * Only renders children if user has one of the allowed roles
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    redirectTo = '/dashboard',
    fallback
}) => {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return fallback || <LoadingSpinner />
    }

    if (!canAccessRoute(user, allowedRoles)) {
        return (
            <Navigate
                to={redirectTo}
                replace
                state={{ from: window.location.pathname }}
            />
        )
    }

    return children
}

export default ProtectedRoute

