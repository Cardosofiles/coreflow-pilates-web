import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { NotificacaoResponse } from '../types/notificacao.types'
import { notificacaoKeys } from './notificacao.keys'

export function usePrepararLembretes() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () =>
      api.post<NotificacaoResponse[]>('/notificacoes/lembretes-aula/preparar').then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificacaoKeys.all }),
  })
}
