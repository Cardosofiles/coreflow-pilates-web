'use client'

import { QueryClient, QueryClientProvider, type QueryClientConfig } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { ReactNode, useState } from 'react'

const MAX_QUERY_RETRIES = 3

/**
 * Estratégia de retry para *queries*: mantém o orçamento de 3 tentativas para
 * falhas transitórias (rede / 5xx), mas aborta imediatamente em erros de
 * cliente (4xx). Um 401/403/404/422 não muda ao repetir a requisição — retentar
 * só atrasa o feedback de erro ao usuário e gera carga inútil no backend.
 */
function retryQuery(failureCount: number, error: unknown): boolean {
  if (isAxiosError(error)) {
    const status = error.response?.status
    if (status !== undefined && status >= 400 && status < 500) return false
  }
  return failureCount < MAX_QUERY_RETRIES
}

const queryclient: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: 'always',
      retry: retryQuery,
    },
    mutations: {
      retry: 0,
    },
  },
}

interface TanstackQueryProviderProps {
  children: ReactNode
}

export const TanstackQueryProvider = ({ children }: TanstackQueryProviderProps) => {
  const [client] = useState(() => new QueryClient(queryclient))

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
