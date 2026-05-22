import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AgendamentoResponse } from '@/modules/agenda/types/agenda.types'

export function useGetInstrutorMeAgendamentos() {
  return useQuery({
    queryKey: ['instrutores', 'me', 'agendamentos'],
    queryFn: () =>
      api.get<AgendamentoResponse[]>('/instrutores/me/agendamentos?limit=1000').then(r => r.data),
  })
}
