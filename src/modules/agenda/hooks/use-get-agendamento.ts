'use client'

import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import type { AgendamentoResponse } from '../types'
import { agendamentoKeys } from './agenda.keys'

export function useGetAgendamento(id: number) {
  return useQuery({
    queryKey: agendamentoKeys.detail(id),
    queryFn: () => api.get<AgendamentoResponse>(`/agendamentos/${id}`).then(r => r.data),
    enabled: !!id,
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
  })
}
