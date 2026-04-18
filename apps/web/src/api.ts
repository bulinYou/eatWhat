import { DietRecord, UserGoals, ApiResponse, DailySummary } from '@diet-tracker/types'

const API_BASE = '/api'

async function request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  return response.json()
}

export async function fetchRecords(date?: string) {
  const params = date ? `?date=${date}` : ''
  return request<{ records: DietRecord[]; summary: DailySummary }>(`/records${params}`)
}

export async function fetchRecordsByDateRange(startDate: string, endDate: string) {
  return request<{ records: DietRecord[] }>(`/records?startDate=${startDate}&endDate=${endDate}`)
}

export async function createRecord(data: Omit<DietRecord, 'id' | 'createdAt' | 'updatedAt'>) {
  return request<DietRecord>('/records', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateRecord(id: string, data: Partial<DietRecord>) {
  return request<DietRecord>(`/records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteRecord(id: string) {
  return request<void>(`/records/${id}`, {
    method: 'DELETE',
  })
}

export async function fetchGoals() {
  return request<UserGoals>('/goals')
}

export async function updateGoals(goals: Partial<UserGoals>) {
  return request<UserGoals>('/goals', {
    method: 'PUT',
    body: JSON.stringify(goals),
  })
}
