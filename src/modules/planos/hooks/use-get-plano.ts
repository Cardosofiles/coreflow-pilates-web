import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { PlanoResponse } from '../types/plano.types'
import { planoKeys } from './plano.keys'

export function useGetPlano(id: number) {
  return useQuery({
    queryKey: planoKeys.detail(id),
    queryFn: () => api.get<PlanoResponse>(`/planos/${id}`).then(r => r.data),
    enabled: !!id,
  })
}
