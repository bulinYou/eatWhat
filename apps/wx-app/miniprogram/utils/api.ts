// api.ts
const API_BASE_URL = 'http://localhost:3000'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export function request<T = any>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as ApiResponse<T>)
        } else {
          reject({
            success: false,
            error: `Request failed with status ${res.statusCode}`,
          })
        }
      },
      fail: (err) => {
        reject({
          success: false,
          error: err.errMsg || 'Network error',
        })
      },
    })
  })
}

export function getTodayLog() {
  return request('/api/today-log', 'GET')
}

export function addTodayLog(data: { foodName: string }) {
  return request('/api/today-log', 'POST', data)
}
