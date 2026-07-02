import axios from 'axios'

const ACCESS_TOKEN_KEY = 'interviewed_access_token'
const REFRESH_TOKEN_KEY = 'interviewed_refresh_token'

let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/'

const api = axios.create({
  baseURL: API_BASE_URL,
})

export function setAuthTokens(tokens: { accessToken: string; refreshToken: string }) {
  accessToken = tokens.accessToken
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
}

export function clearAuthTokens() {
  accessToken = null
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (error.response?.status === 401 && refreshToken && !original?._retry) {
      original._retry = true
      try {
        const res = await axios.post('/api/auth/refresh', { refreshToken }, { baseURL: API_BASE_URL })
        setAuthTokens(res.data.data)
        original.headers.Authorization = `Bearer ${res.data.data.accessToken}`
        return api(original)
      } catch {
        clearAuthTokens()
      }
    }
    if (error.response?.status === 401) {
      const event = new CustomEvent('auth:unauthorized')
      window.dispatchEvent(event)
    }
    return Promise.reject(error)
  }
)

export default api
