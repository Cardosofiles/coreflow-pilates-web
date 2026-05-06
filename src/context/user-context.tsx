'use client'

import { createContext, useContext, useState, type JSX, type ReactNode } from 'react'

import type { PapelUsuario, Usuario } from '@/modules/auth'

interface UserContextValue {
  user: Usuario | null
  setUser: (u: Usuario | null) => void
}

const UserContext = createContext<UserContextValue | null>(null)

interface UserProviderProps {
  children: ReactNode
}

const UserProvider = ({ children }: UserProviderProps): JSX.Element => {
  const [user, setUser] = useState<Usuario | null>(null)

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

const useUser = (): UserContextValue => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}

const useUserPapel = (): PapelUsuario | null => {
  const { user } = useUser()
  return user?.papel ?? null
}

export { UserProvider, useUser, useUserPapel }
