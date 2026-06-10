import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { InstrutorResponse } from '../types/instrutor.types'
import { instrutorKeys } from './instrutor.keys'

export function useGetInstrutores() {
  return useQuery({
    queryKey: instrutorKeys.all,
    queryFn: () => api.get<InstrutorResponse[]>('/instrutores?limit=1000').then(r => r.data),
  })
}
