'use client'

import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

import { api } from '@/lib/api'
import type { LoginResponse, SignInFormData } from '../types/auth.types'

const ROLE_REDIRECT: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  ALUNO: '/aluno/dashboard',
  INSTRUTOR: '/instrutor/dashboard',
}

const COOKIE_OPTIONS = { path: '/', sameSite: 'strict' as const }

/**
 * Traduz a falha do login para uma mensagem amigável em PT-BR.
 * Função pura (sem hooks) para ser reutilizável e testável fora do React.
 * Mapeia apenas os status conhecidos do `/auth/login`; o resto cai no fallback.
 */
export function getLoginErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    switch (error.response?.status) {
      case 401:
        return 'Credenciais inválidas.'
      case 403:
        return 'Usuário inativo.'
      case 422:
        return 'Dados inválidos. Verifique os campos.'
    }
  }
  return 'Erro ao fazer login. Tente novamente.'
}

/**
 * Autentica o usuário via `POST /auth/login`.
 *
 * Mutation (não retentada — herda `retry: 0` do QueryClient: reenviar
 * credenciais não corrige um 401/403). O efeito colateral de persistir os
 * cookies e redirecionar para o dashboard da role vive em `onSuccess`, mantendo
 * a `mutationFn` como a chamada de rede pura.
 *
 * O componente consome `isPending`, `isError` e `error` em vez de gerenciar
 * estado de loading/erro manualmente. Para a mensagem amigável use
 * `getLoginErrorMessage(mutation.error)`.
 */
export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: SignInFormData) => {
      const { data: payload } = await api.post<LoginResponse>('/auth/login', {
        email: data.email,
        senha: data.password,
      })
      return payload
    },
    onSuccess: ({ access_token, usuario }) => {
      Cookies.set('access_token', access_token, COOKIE_OPTIONS)
      Cookies.set('usuario_papel', usuario.papel, COOKIE_OPTIONS)
      router.push(ROLE_REDIRECT[usuario.papel] ?? '/dashboard')
    },
  })
}
