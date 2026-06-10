'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import Cookies from 'js-cookie'

/**
 * Encerra a sessão local: remove os cookies de auth e volta para `/sign-in`.
 *
 * É só efeito client-side (sem chamada de rede), então um callback estável
 * basta — não há motivo para um `useMutation` aqui. Memoizado com `useCallback`
 * para manter referência estável entre renders.
 */
export function useLogout() {
  const router = useRouter()

  return useCallback(() => {
    Cookies.remove('access_token')
    Cookies.remove('usuario_papel')
    router.push('/sign-in')
  }, [router])
}
