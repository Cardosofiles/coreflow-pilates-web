'use client'

import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import type { AgendamentoResponse } from '../types'

export function useGetAgendamento(id: number) {
  return useQuery({
    queryKey: ['agendamentos', id],
    queryFn: () => api.get<AgendamentoResponse>(`/agendamentos/${id}`).then(r => r.data),
    enabled: !!id,
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
  })
}
