import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AparelhoResponse } from '../types/aparelho.types'
import { aparelhoKeys } from './aparelho.keys'

export function useGetAparelho(id: number) {
  return useQuery({
    queryKey: aparelhoKeys.detail(id),
    queryFn: () => api.get<AparelhoResponse>(`/aparelhos/${id}`).then(r => r.data),
    enabled: !!id,
  })
}
