import { useMutation } from '@tanstack/react-query'

import { api } from '@/lib/api'

interface AlunoUpgradePlanoDemoCreate {
  plano_id: number
  observacao?: string | null
}

interface AlunoUpgradePlanoDemoResponse {
  id: number
  aluno_id: number
  plano_id: number
  observacao: string | null
  created_at: string
}

export function useSolicitarUpgrade() {
  return useMutation({
    mutationFn: (data: AlunoUpgradePlanoDemoCreate) =>
      api
        .post<AlunoUpgradePlanoDemoResponse>('/alunos/me/solicitacoes-upgrade', data)
        .then(r => r.data),
  })
}
