'use client'

import { isAxiosError } from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

import { api } from '@/lib/api'
import type { LoginResponse, Usuario } from '../types/auth.types'
import type { SignInFormData } from '../types/auth.types'

const ROLE_REDIRECT: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  ALUNO: '/aluno/dashboard',
  INSTRUTOR: '/instrutor/dashboard',
}

const COOKIE_OPTIONS = { path: '/', sameSite: 'strict' as const }

export function useAuth() {
  const router = useRouter()

  const login = async (data: SignInFormData): Promise<string | null> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email: data.email,
        senha: data.password,
      })
      const { access_token, usuario } = response.data
      Cookies.set('access_token', access_token, COOKIE_OPTIONS)
      Cookies.set('usuario_papel', usuario.papel, COOKIE_OPTIONS)
      router.push(ROLE_REDIRECT[usuario.papel] ?? '/dashboard')
      return null
    } catch (err) {
      if (isAxiosError(err)) {
        const status = err.response?.status
        if (status === 401) return 'Credenciais inválidas.'
        if (status === 403) return 'Usuário inativo.'
        if (status === 422) return 'Dados inválidos. Verifique os campos.'
      }
      return 'Erro ao fazer login. Tente novamente.'
    }
  }

  const logout = () => {
    Cookies.remove('access_token')
    Cookies.remove('usuario_papel')
    router.push('/sign-in')
  }

  const getMe = async (): Promise<Usuario | null> => {
    try {
      const response = await api.get<Usuario>('/auth/me')
      return response.data
    } catch {
      return null
    }
  }

  return { login, logout, getMe }
}
