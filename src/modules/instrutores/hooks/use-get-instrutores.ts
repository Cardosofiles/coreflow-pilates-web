import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { InstrutorResponse } from '../types/instrutor.types'

export function useGetInstrutores() {
  return useQuery({
    queryKey: ['instrutores'],
    queryFn: () => api.get<InstrutorResponse[]>('/instrutores?limit=1000').then(r => r.data),
  })
}
