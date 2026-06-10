import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { InstrutorResponse } from '../types/instrutor.types'
import { instrutorKeys } from './instrutor.keys'

export function useGetInstrutorMe() {
  return useQuery({
    queryKey: instrutorKeys.me,
    queryFn: () => api.get<InstrutorResponse>('/instrutores/me').then(r => r.data),
  })
}
