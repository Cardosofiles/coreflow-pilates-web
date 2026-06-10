import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { MatriculaResponse } from '../types/matricula.types'

export function useGetMatriculas() {
  return useQuery({
    queryKey: ['matriculas'],
    queryFn: () => api.get<MatriculaResponse[]>('/matriculas?limit=1000').then(r => r.data),
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
  })
}
