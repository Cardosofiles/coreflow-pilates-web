'use client'

import { QueryClient, QueryClientProvider, type QueryClientConfig } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

const queryclient: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
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
