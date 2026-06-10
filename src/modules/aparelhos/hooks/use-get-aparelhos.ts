import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AparelhoResponse } from '../types/aparelho.types'
import { aparelhoKeys } from './aparelho.keys'

export function useGetAparelhos() {
  return useQuery({
    queryKey: aparelhoKeys.all,
    queryFn: () => api.get<AparelhoResponse[]>('/aparelhos?limit=1000').then(r => r.data),
  })
}
