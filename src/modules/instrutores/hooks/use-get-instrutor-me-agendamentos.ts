import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AgendamentoResponse } from '@/modules/agenda/types/agenda.types'
import { instrutorKeys } from './instrutor.keys'

export function useGetInstrutorMeAgendamentos() {
  return useQuery({
    queryKey: instrutorKeys.meAgendamentos,
    queryFn: () =>
      api.get<AgendamentoResponse[]>('/instrutores/me/agendamentos?limit=1000').then(r => r.data),
  })
}
