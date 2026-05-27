import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AgendamentoPorDiaResponse } from '../types/dashboard.types'

export function useGetAgendamentosPorDia() {
  return useQuery({
    queryKey: ['dashboard', 'agendamentos-por-dia'],
    queryFn: () =>
      api.get<AgendamentoPorDiaResponse>('/admin/agendamentos-por-dia').then(r => r.data),
  })
}
