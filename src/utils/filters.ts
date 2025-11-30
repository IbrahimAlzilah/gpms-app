/**
 * Filter and sort utility functions
 */

import { SortOrder } from '@/types/common'

/**
 * Filter options for common filters
 */
export interface FilterState {
  status: string
  priority: string
  department?: string
  searchQuery: string
  sortBy: string
  sortOrder: SortOrder
}

/**
 * Default filter state
 */
export const DEFAULT_FILTER_STATE: FilterState = {
  status: 'all',
  priority: 'all',
  department: 'all',
  searchQuery: '',
  sortBy: 'updatedAt',
  sortOrder: 'desc'
}

/**
 * Reset filter state to defaults
 */
export function resetFilters(): FilterState {
  return { ...DEFAULT_FILTER_STATE }
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    (filters.department !== undefined && filters.department !== 'all') ||
    filters.searchQuery.trim() !== '' ||
    filters.sortBy !== 'updatedAt' ||
    filters.sortOrder !== 'desc'
  )
}

/**
 * Count active filters
 */
export function countActiveFilters(filters: FilterState): number {
  let count = 0
  if (filters.status !== 'all') count++
  if (filters.priority !== 'all') count++
  if (filters.department && filters.department !== 'all') count++
  if (filters.searchQuery.trim() !== '') count++
  if (filters.sortBy !== 'updatedAt') count++
  if (filters.sortOrder !== 'desc') count++
  return count
}

/**
 * Generic filter function for arrays
 */
export function filterItems<T>(
  items: T[],
  filters: {
    searchQuery?: string
    searchFields?: (keyof T)[]
    statusFilter?: string
    statusField?: keyof T
    priorityFilter?: string
    priorityField?: keyof T
    departmentFilter?: string
    departmentField?: keyof T
    customFilter?: (item: T) => boolean
  }
): T[] {
  return items.filter((item) => {
    // Search filter
    if (filters.searchQuery && filters.searchFields) {
      const matchesSearch = filters.searchFields.some((field) => {
        const value = item[field]
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filters.searchQuery!.toLowerCase())
        }
        if (Array.isArray(value)) {
          return value.some((v) =>
            String(v).toLowerCase().includes(filters.searchQuery!.toLowerCase())
          )
        }
        return false
      })
      if (!matchesSearch) return false
    }

    // Status filter
    if (filters.statusFilter && filters.statusFilter !== 'all' && filters.statusField) {
      if (item[filters.statusField] !== filters.statusFilter) return false
    }

    // Priority filter
    if (filters.priorityFilter && filters.priorityFilter !== 'all' && filters.priorityField) {
      if (item[filters.priorityField] !== filters.priorityFilter) return false
    }

    // Department filter
    if (filters.departmentFilter && filters.departmentFilter !== 'all' && filters.departmentField) {
      if (item[filters.departmentField] !== filters.departmentFilter) return false
    }

    // Custom filter
    if (filters.customFilter && !filters.customFilter(item)) return false

    return true
  })
}

/**
 * Generic sort function for arrays
 */
export function sortItems<T>(
  items: T[],
  sortBy: keyof T,
  sortOrder: SortOrder = 'asc',
  locale: string = 'ar'
): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]

    let comparison = 0

    if (aVal === undefined && bVal === undefined) return 0
    if (aVal === undefined) return 1
    if (bVal === undefined) return -1

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      comparison = aVal.localeCompare(bVal, locale)
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal
    } else if (aVal instanceof Date && bVal instanceof Date) {
      comparison = aVal.getTime() - bVal.getTime()
    } else if (typeof aVal === 'string' && typeof bVal === 'string') {
      // Date strings
      const aDate = new Date(aVal)
      const bDate = new Date(bVal)
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        comparison = aDate.getTime() - bDate.getTime()
      } else {
        comparison = aVal.localeCompare(bVal, locale)
      }
    } else {
      comparison = String(aVal).localeCompare(String(bVal), locale)
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })
}

/**
 * Filter and sort items in one operation
 */
export function filterAndSortItems<T>(
  items: T[],
  filters: {
    searchQuery?: string
    searchFields?: (keyof T)[]
    statusFilter?: string
    statusField?: keyof T
    priorityFilter?: string
    priorityField?: keyof T
    departmentFilter?: string
    departmentField?: keyof T
    customFilter?: (item: T) => boolean
  },
  sortBy: keyof T,
  sortOrder: SortOrder = 'asc',
  locale: string = 'ar'
): T[] {
  const filtered = filterItems(items, filters)
  return sortItems(filtered, sortBy, sortOrder, locale)
}

