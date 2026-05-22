import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AgendamentoResponse } from '@/modules/agenda/types/agenda.types'

interface AgendamentoAlunoCreate {
  sessao_id: number
  aparelho_id: number
  instrutor_id: number
  matricula_id?: number | null
  tipo_cobranca?: 'MATRICULA' | 'AVULSO'
  observacao?: string | null
}

export function useSolicitarAgendamento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AgendamentoAlunoCreate) =>
      api.post<AgendamentoResponse>('/alunos/me/agendamentos', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alunos', 'me', 'agendamentos'] }),
  })
}
