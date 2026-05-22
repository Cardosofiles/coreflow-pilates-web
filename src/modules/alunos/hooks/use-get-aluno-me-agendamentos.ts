import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AgendamentoResponse } from '@/modules/agenda/types/agenda.types'

export function useGetAlunoMeAgendamentos() {
  return useQuery({
    queryKey: ['alunos', 'me', 'agendamentos'],
    queryFn: () =>
      api.get<AgendamentoResponse[]>('/alunos/me/agendamentos?limit=100').then(r => r.data),
  })
}
