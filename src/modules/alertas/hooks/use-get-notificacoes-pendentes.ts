import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { NotificacaoResponse } from '../types/notificacao.types'

export function useGetNotificacoesPendentes() {
  return useQuery({
    queryKey: ['notificacoes', 'pendentes'],
    queryFn: () =>
      api.get<NotificacaoResponse[]>('/notificacoes/email/pendentes').then(r => r.data),
  })
}
