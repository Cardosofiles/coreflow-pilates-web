import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { Sessao } from '@/modules/agenda/types/agenda.types'

export function useGetAlunoMeAgenda() {
  return useQuery({
    queryKey: ['alunos', 'me', 'agenda'],
    queryFn: () => api.get<Sessao[]>('/alunos/me/agenda?limit=100').then(r => r.data),
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
  })
}
