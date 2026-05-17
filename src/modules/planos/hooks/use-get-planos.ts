import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { PlanoResponse } from '../types/plano.types'

export function useGetPlanos() {
  return useQuery({
    queryKey: ['planos'],
    queryFn: () => api.get<PlanoResponse[]>('/planos?limit=100').then(r => r.data),
  })
}
