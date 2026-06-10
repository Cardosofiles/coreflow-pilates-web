import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AlunosPorMesResponse } from '../types/dashboard.types'
import { dashboardKeys } from './dashboard.keys'

export function useGetAlunosPorMes() {
  return useQuery({
    queryKey: dashboardKeys.alunosPorMes,
    queryFn: () => api.get<AlunosPorMesResponse>('/admin/alunos-por-mes').then(r => r.data),
  })
}
