'use client'

import { createContext, useContext, useState, type JSX, type ReactNode } from 'react'

import type { PapelUsuario, Usuario } from '@/modules/auth'

interface UserContextValue {
  usuario: Usuario | null
  setUsuario: (u: Usuario | null) => void
}

const UserContext = createContext<UserContextValue | null>(null)

interface UserProviderProps {
  children: ReactNode
}

const UserProvider = ({ children }: UserProviderProps): JSX.Element => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = localStorage.getItem('usuario')
      return raw ? (JSON.parse(raw) as Usuario) : null
    } catch {
      return null
    }
  })

  return <UserContext.Provider value={{ usuario, setUsuario }}>{children}</UserContext.Provider>
}

const useUser = (): UserContextValue => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}

const useUserPapel = (): PapelUsuario | null => {
  const { usuario } = useUser()
  return usuario?.papel ?? null
}

export { UserProvider, useUser, useUserPapel }
