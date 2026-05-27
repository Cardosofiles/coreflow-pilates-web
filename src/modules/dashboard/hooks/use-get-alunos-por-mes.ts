import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AlunosPorMesResponse } from '../types/dashboard.types'

export function useGetAlunosPorMes() {
  return useQuery({
    queryKey: ['dashboard', 'alunos-por-mes'],
    queryFn: () => api.get<AlunosPorMesResponse>('/admin/alunos-por-mes').then(r => r.data),
  })
}
