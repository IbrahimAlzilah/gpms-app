// Simple mockable API layer to isolate future backend integration
// Switch implementations later to real HTTP client

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiResponse<T> {
  data: T
}

// In-memory mock delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function apiRequest<T>(
  _url: string,
  _method: HttpMethod,
  _payload?: unknown,
  options?: { mockData: T; simulateMs?: number }
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


