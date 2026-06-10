import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { MatriculaResponse } from '../types/matricula.types'
import { matriculaKeys } from './matricula.keys'

export function useGetMatriculasVencendo() {
  return useQuery({
    queryKey: matriculaKeys.vencendo,
    queryFn: () => api.get<MatriculaResponse[]>('/matriculas/vencendo').then(r => r.data),
  })
}
