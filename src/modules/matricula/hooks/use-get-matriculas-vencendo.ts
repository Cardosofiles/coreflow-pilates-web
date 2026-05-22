import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { MatriculaResponse } from '../types/matricula.types'

export function useGetMatriculasVencendo() {
  return useQuery({
    queryKey: ['matriculas', 'vencendo'],
    queryFn: () => api.get<MatriculaResponse[]>('/matriculas/vencendo').then(r => r.data),
  })
}
