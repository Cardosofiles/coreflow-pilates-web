import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { PlanoResponse } from '../types/plano.types'
import { planoKeys } from './plano.keys'

export function useGetPlanos() {
  return useQuery({
    queryKey: planoKeys.all,
    queryFn: () => api.get<PlanoResponse[]>('/planos?limit=100').then(r => r.data),
  })
}
