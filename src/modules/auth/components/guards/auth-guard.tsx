'use client'

import { useEffect, useState, type JSX } from 'react'
import { useRouter } from 'next/navigation'

import { api } from '@/lib/api'
import { useUser } from '@/context/user-context'
import type { Usuario } from '@/modules/auth/types/auth.types'

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard = ({ children }: AuthGuardProps): JSX.Element | null => {
  const router = useRouter()
  const { setUsuario } = useUser()
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.replace('/sign-in')
      return
    }

    api
      .get<Usuario>('/auth/me')
      .then(response => {
        const fresh = response.data
        setUsuario(fresh)
        localStorage.setItem('usuario', JSON.stringify(fresh))
        document.cookie = `usuario_papel=${fresh.papel}; path=/; SameSite=Strict`
        setVerified(true)
      })
      .catch(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('usuario')
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        document.cookie = 'usuario_papel=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        router.replace('/sign-in')
      })
  }, [router, setUsuario])

  if (!verified) return null
  return <>{children}</>
}

export { AuthGuard }
