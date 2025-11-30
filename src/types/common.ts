/**
 * Common type definitions used across the application
 */

/**
 * Base entity with ID
 */
export type WithId<T = {}> = T & {
  id: string;
};

/**
 * Entity with timestamps
 */
export type WithTimestamps<T = {}> = T & {
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Entity with ID and timestamps
 */
export type BaseEntity<T = {}> = WithId<WithTimestamps<T>>;

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: PaginationMeta;
}

/**
 * Common status types
 */
export type Status =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "in_progress"
  | "completed"
  | "pending"
  | "ready_for_defense"
  | "defense_scheduled"
  | "defended"
  | "evaluated"
  | "graduated";

/**
 * Priority levels
 */
export type Priority = "low" | "medium" | "high";

/**
 * User roles
 */
export type UserRole =
  | "student"
  | "supervisor"
  | "committee"
  | "discussion"
  | "admin";

/**
 * Notification types
 */
export type NotificationType = "info" | "success" | "warning" | "error";

/**
 * View modes
 */
export type ViewMode = "table" | "grid";

/**
 * Sort order
 */
export type SortOrder = "asc" | "desc";

/**
 * Filter option
 */
export interface FilterOption {
  value: string;
  label: string;
}

/**
 * Sort option
 */
export interface SortOption {
  value: string;
  label: string;
}

/**
 * Common form field error
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Form errors
 */
export type FormErrors = Record<string, string>;

/**
 * Loading state
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Async operation result
 */
export type AsyncResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};
