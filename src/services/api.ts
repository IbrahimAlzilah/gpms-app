/**
 * Simple mockable API layer to isolate future backend integration
 * Switch implementations later to real HTTP client
 */

import { ApiResponse } from '@/types/common'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Options for API request
 */
export interface ApiRequestOptions<T> {
  /** Mock data to return */
  mockData: T
  /** Simulated delay in milliseconds */
  simulateMs?: number
}

/**
 * API error response
 */
export interface ApiError {
  message: string
  code?: string
  status?: number
}

/**
 * In-memory mock delay
 */
const delay = (ms: number): Promise<void> => 
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Make an API request
 * @param _url - API endpoint URL
 * @param _method - HTTP method
 * @param _payload - Request payload
 * @param options - Request options including mock data
 * @returns Promise resolving to API response
 */
export async function apiRequest<T>(
  _url: string,
  _method: HttpMethod,
  _payload?: unknown,
  options?: ApiRequestOptions<T>
): Promise<ApiResponse<T>> {
  const simulateMs = options?.simulateMs ?? 300
  const mockData = options?.mockData as T
  const useMock = (import.meta as any).env?.VITE_USE_MOCK === 'true'
  
  if (useMock) {
    await delay(simulateMs)
    return { data: mockData }
  }
  
  // Placeholder for real fetch when backend is ready
  await delay(simulateMs)
  return { data: mockData }
}


