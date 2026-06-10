import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AgendamentoPorDiaResponse } from '../types/dashboard.types'
import { dashboardKeys } from './dashboard.keys'

export function useGetAgendamentosPorDia() {
  return useQuery({
    queryKey: dashboardKeys.agendamentosPorDia,
    queryFn: () =>
      api.get<AgendamentoPorDiaResponse>('/admin/agendamentos-por-dia').then(r => r.data),
  })
}
