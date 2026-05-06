'use client'

import { useEffect, useState, type JSX } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

import { api } from '@/lib/api'
import { useUser } from '@/context/user-context'
import type { Usuario } from '@/modules/auth/types/auth.types'

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard = ({ children }: AuthGuardProps): JSX.Element | null => {
  const router = useRouter()
  const { setUser } = useUser()
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const token = Cookies.get('access_token')
    if (!token) {
      router.replace('/sign-in')
      return
    }

    api
      .get<Usuario>('/auth/me')
      .then(response => {
        setUser(response.data)
        setVerified(true)
      })
      .catch(() => {
        Cookies.remove('access_token')
        Cookies.remove('usuario_papel')
        router.replace('/sign-in')
      })
  }, [router, setUser])

  if (!verified) return null
  return <>{children}</>
}

export { AuthGuard }
