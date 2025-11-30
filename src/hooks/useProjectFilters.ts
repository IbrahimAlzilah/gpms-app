/**
 * Hook for managing project filters and sorting
 */

import { useState, useMemo, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Project } from '@/pages/projects/schema'
import { filterAndSortItems, FilterState, DEFAULT_FILTER_STATE } from '@/utils/filters'
import { SortOrder, FilterOption, SortOption } from '@/types/common'

/**
 * Options for project filters hook
 */
export interface UseProjectFiltersOptions {
  projects: Project[]
}

/**
 * Return type for useProjectFilters hook
 */
export interface UseProjectFiltersReturn {
  filters: FilterState
  setStatusFilter: (value: string) => void
  setPriorityFilter: (value: string) => void
  setDepartmentFilter: (value: string) => void
  setSearchQuery: (value: string) => void
  setSortBy: (value: string) => void
  setSortOrder: (value: SortOrder) => void
  clearFilters: () => void
  filteredProjects: Project[]
  statusOptions: FilterOption[]
  priorityOptions: FilterOption[]
  departmentOptions: FilterOption[]
  sortOptions: SortOption[]
  activeFiltersCount: number
}

/**
 * Hook for managing project filters
 */
export function useProjectFilters({ projects }: UseProjectFiltersOptions): UseProjectFiltersReturn {
  const { user } = useAuth()
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE)

  // Filter setters
  const setStatusFilter = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, status: value }))
  }, [])

  const setPriorityFilter = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, priority: value }))
  }, [])

  const setDepartmentFilter = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, department: value }))
  }, [])

  const setSearchQuery = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: value }))
  }, [])

  const setSortBy = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value }))
  }, [])

  const setSortOrder = useCallback((value: SortOrder) => {
    setFilters((prev) => ({ ...prev, sortOrder: value }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER_STATE)
  }, [])

  // Status options based on role
  const statusOptions = useMemo((): FilterOption[] => {
    const base = [
      { value: 'all', label: 'جميع الحالات' },
      { value: 'draft', label: 'مسودة' },
      { value: 'submitted', label: 'مُرسل' },
      { value: 'under_review', label: 'قيد المراجعة' },
      { value: 'approved', label: 'موافق عليه' },
      { value: 'rejected', label: 'مرفوض' },
      { value: 'in_progress', label: 'قيد التنفيذ' },
      { value: 'completed', label: 'مكتمل' }
    ]

    if (user?.role === 'student') {
      return [
        { value: 'all', label: 'جميع المشاريع' },
        { value: 'approved', label: 'المشاريع المعتمدة فقط' },
        { value: 'in_progress', label: 'قيد التنفيذ' }
      ]
    }

    if (user?.role === 'supervisor') {
      return [
        { value: 'all', label: 'جميع الحالات' },
        { value: 'in_progress', label: 'قيد التنفيذ' },
        { value: 'completed', label: 'مكتمل' },
        { value: 'approved', label: 'موافق عليه' }
      ]
    }

    if (user?.role === 'discussion') {
      return [
        { value: 'all', label: 'جميع الحالات' },
        { value: 'ready_for_defense', label: 'جاهز للمناقشة' },
        { value: 'defense_scheduled', label: 'مُجدولة المناقشة' },
        { value: 'defended', label: 'تمت المناقشة' },
        { value: 'evaluated', label: 'تم التقييم' },
        { value: 'graduated', label: 'مُتخرج' }
      ]
    }

    return base
  }, [user?.role])

  // Priority options
  const priorityOptions = useMemo((): FilterOption[] => [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض' },
    { value: 'medium', label: 'متوسط' },
    { value: 'high', label: 'عالي' }
  ], [])

  // Department options
  const departmentOptions = useMemo((): FilterOption[] => {
    const departments = new Set<string>()
    projects.forEach((project) => {
      if (project.department) {
        departments.add(project.department)
      }
    })
    return [
      { value: 'all', label: 'جميع التخصصات' },
      ...Array.from(departments).map((dept) => ({ value: dept, label: dept }))
    ]
  }, [projects])

  // Sort options based on role
  const sortOptions = useMemo((): SortOption[] => {
    if (user?.role === 'discussion') {
      return [
        { value: 'defenseDate', label: 'تاريخ المناقشة' },
        { value: 'title', label: 'العنوان' },
        { value: 'status', label: 'الحالة' },
        { value: 'finalGrade', label: 'الدرجة النهائية' },
        { value: 'lastUpdate', label: 'آخر تحديث' }
      ]
    }
    return [
      { value: 'updatedAt', label: 'آخر تحديث' },
      { value: 'title', label: 'العنوان' },
      { value: 'progress', label: 'التقدم' },
      { value: 'startDate', label: 'تاريخ البداية' },
      { value: 'createdAt', label: 'تاريخ الإنشاء' }
    ]
  }, [user?.role])

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    return filterAndSortItems(
      projects,
      {
        searchQuery: filters.searchQuery,
        searchFields: ['title', 'description', 'supervisor', 'tags'],
        statusFilter: filters.status,
        statusField: 'status',
        priorityFilter: filters.priority,
        priorityField: 'priority',
        departmentFilter: filters.department,
        departmentField: 'department',
        customFilter: (project) => {
          // Role-specific filtering
          if (user?.role === 'student') {
            if (filters.status === 'all') {
              // Show only approved projects available for registration
              return project.status === 'approved' || project.status === 'in_progress'
            }
          }

          if (user?.role === 'supervisor') {
            // Filter by supervisor
            if (project.supervisor && !project.supervisor.includes(user.fullName || '')) {
              return false
            }
          }

          return true
        }
      },
      filters.sortBy as keyof Project,
      filters.sortOrder,
      'ar'
    )
  }, [projects, filters, user?.role, user?.fullName])

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.status !== 'all') count++
    if (filters.priority !== 'all') count++
    if (filters.department && filters.department !== 'all') count++
    if (filters.searchQuery.trim() !== '') count++
    if (filters.sortBy !== 'updatedAt') count++
    if (filters.sortOrder !== 'desc') count++
    return count
  }, [filters])

  return {
    filters,
    setStatusFilter,
    setPriorityFilter,
    setDepartmentFilter,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    clearFilters,
    filteredProjects,
    statusOptions,
    priorityOptions,
    departmentOptions,
    sortOptions,
    activeFiltersCount
  }
}

