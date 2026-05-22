import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AparelhoResponse } from '../types/aparelho.types'

export const APARELHOS_QUERY_KEY = ['aparelhos'] as const

export function useGetAparelhos() {
  return useQuery({
    queryKey: APARELHOS_QUERY_KEY,
    queryFn: () => api.get<AparelhoResponse[]>('/aparelhos?limit=1000').then(r => r.data),
  })
}
