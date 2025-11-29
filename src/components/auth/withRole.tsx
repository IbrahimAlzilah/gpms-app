import React, { ComponentType } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Role, canAccessRoute } from '@/utils/permissions'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface WithRoleOptions {
    allowedRoles: Role[]
    redirectTo?: string
    fallback?: React.ReactElement
}

/**
 * Higher-Order Component for role-based access control
 * Wraps a component and only renders it if the user has one of the allowed roles
 */
export function withRole<P extends object>(
    allowedRoles: Role[],
    options?: Omit<WithRoleOptions, 'allowedRoles'>
) {
    return (Component: ComponentType<P>) => {
        const WrappedComponent: React.FC<P> = (props) => {
            const { user, isLoading } = useAuth()

            if (isLoading) {
                return options?.fallback || <LoadingSpinner />
            }

            if (!canAccessRoute(user, allowedRoles)) {
                return options?.redirectTo ? (
                    <Navigate to={options.redirectTo} replace />
                ) : (
                    options?.fallback || (
                        <div className="flex items-center justify-center min-h-screen">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">غير مصرح</h2>
                                <p className="text-gray-600">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
                            </div>
                        </div>
                    )
                )
            }

            return <Component {...props} />
        }

        WrappedComponent.displayName = `withRole(${Component.displayName || Component.name})`
        return WrappedComponent
    }
}

export default withRole

