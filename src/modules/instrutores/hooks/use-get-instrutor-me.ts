import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { InstrutorResponse } from '../types/instrutor.types'

export function useGetInstrutorMe() {
  return useQuery({
    queryKey: ['instrutores', 'me'],
    queryFn: () => api.get<InstrutorResponse>('/instrutores/me').then(r => r.data),
  })
}
