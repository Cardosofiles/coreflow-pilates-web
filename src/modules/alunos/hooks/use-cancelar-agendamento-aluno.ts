import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AgendamentoResponse } from '@/modules/agenda/types/agenda.types'

export function useCancelarAgendamentoAluno() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (agendamentoId: number) =>
      api
        .patch<AgendamentoResponse>(`/alunos/me/agendamentos/${agendamentoId}/cancelar`)
        .then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alunos', 'me', 'agendamentos'] }),
  })
}
