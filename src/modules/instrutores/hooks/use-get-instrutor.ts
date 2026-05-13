import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { InstrutorResponse } from '../types/instrutor.types'

export function useGetInstrutor(id: number) {
  return useQuery({
    queryKey: ['instrutores', id],
    queryFn: () => api.get<InstrutorResponse>(`/instrutores/${id}`).then(r => r.data),
    enabled: !!id,
  })
}
