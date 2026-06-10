import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { InstrutorResponse } from '../types/instrutor.types'
import { instrutorKeys } from './instrutor.keys'

export function useGetInstrutor(id: number) {
  return useQuery({
    queryKey: instrutorKeys.detail(id),
    queryFn: () => api.get<InstrutorResponse>(`/instrutores/${id}`).then(r => r.data),
    enabled: !!id,
  })
}
