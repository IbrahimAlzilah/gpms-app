import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getActiveFiltersCount(
  statusFilter: string = 'all',
  secondaryFilter: string = 'all',
  searchQuery: string = '',
  sortBy: string = '',
  sortOrder: string = ''
): number {
  let count = 0
  if (statusFilter !== 'all') count++
  if (secondaryFilter !== 'all') count++
  if (searchQuery && searchQuery.trim() !== '') count++
  if (sortBy && sortBy !== '') count++
  if (sortOrder && sortOrder !== '') count++
  return count
}
