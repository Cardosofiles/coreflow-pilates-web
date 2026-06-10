import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { MatriculaResponse } from '@/modules/matricula/types/matricula.types'
import { alunoKeys } from './aluno.keys'

export function usePagarMatricula() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (matriculaId: number) =>
      api.patch<MatriculaResponse>(`/alunos/me/matriculas/${matriculaId}/pagar`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alunoKeys.meMatriculas })
      queryClient.invalidateQueries({ queryKey: alunoKeys.meMatriculaAtiva })
    },
  })
}
