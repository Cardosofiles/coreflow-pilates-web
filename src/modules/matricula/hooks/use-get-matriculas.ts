import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { MatriculaResponse } from '../types/matricula.types'
import { matriculaKeys } from './matricula.keys'

export function useGetMatriculas() {
  return useQuery({
    queryKey: matriculaKeys.all,
    queryFn: () => api.get<MatriculaResponse[]>('/matriculas?limit=1000').then(r => r.data),
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
  })
}
