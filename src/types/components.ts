/**
 * Component prop type definitions
 */

import { ReactNode } from 'react'
import { UserRole, Status, Priority, ViewMode, SortOrder, FilterOption, SortOption } from './common'

/**
 * Base component props with children
 */
export interface BaseComponentProps {
  children?: ReactNode
  className?: string
}

/**
 * Modal component props
 */
export interface ModalComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  disableOverlayClose?: boolean
  disableEscClose?: boolean
}

/**
 * Form component props
 */
export interface FormComponentProps {
  onSubmit: (data: unknown) => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  initialValues?: Record<string, unknown>
  errors?: Record<string, string>
}

/**
 * Button component props
 */
export interface ButtonComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  children: ReactNode
  className?: string
}

/**
 * Input component props
 */
export interface InputComponentProps {
  label?: string
  error?: string
  helperText?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  required?: boolean
  disabled?: boolean
  className?: string
}

/**
 * Table column definition
 */
export interface TableColumn<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => ReactNode
  width?: string | number
}

/**
 * Data table props
 */
export interface DataTableComponentProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  emptyMessage?: string
  className?: string
  onSort?: (key: string, direction: SortOrder) => void
  sortBy?: string
  sortOrder?: SortOrder
}

/**
 * Filter component props
 */
export interface FilterComponentProps {
  statusOptions: FilterOption[]
  priorityOptions: FilterOption[]
  typeOptions?: FilterOption[]
  sortOptions: SortOption[]
  statusFilter: string
  priorityFilter: string
  typeFilter?: string
  sortBy: string
  sortOrder: SortOrder
  onStatusChange: (value: string) => void
  onPriorityChange: (value: string) => void
  onTypeChange?: (value: string) => void
  onSortChange: (value: string) => void
  onSortOrderChange: (value: SortOrder) => void
  onApply: () => void
  onClear: () => void
  className?: string
}

/**
 * View toggle props
 */
export interface ViewModeToggleComponentProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

/**
 * Badge component props
 */
export interface BadgeComponentProps {
  status?: Status
  priority?: Priority
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  children?: ReactNode
  className?: string
}

/**
 * Card component props
 */
export interface CardComponentProps extends BaseComponentProps {
  title?: string
  header?: ReactNode
  footer?: ReactNode
  hover?: boolean
}

/**
 * Layout component props
 */
export interface LayoutComponentProps extends BaseComponentProps {
  userRole?: UserRole
}

/**
 * Protected route props
 */
export interface ProtectedRouteComponentProps {
  allowedRoles?: UserRole[]
  children: ReactNode
}

/**
 * Event handler types
 */
export type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void
export type ChangeHandler<T = string> = (value: T) => void
export type SubmitHandler<T = unknown> = (data: T) => void | Promise<void>

