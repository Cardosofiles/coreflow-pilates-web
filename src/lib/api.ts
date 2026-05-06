import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    const hasToken =
      typeof window !== 'undefined' && !!localStorage.getItem('access_token')

    if (error.response?.status === 401 && hasToken) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('usuario')
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'usuario_papel=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      window.location.href = '/sign-in'
    }

    return Promise.reject(error)
  },
)
