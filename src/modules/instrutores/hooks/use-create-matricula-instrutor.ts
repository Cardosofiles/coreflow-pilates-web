import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { MatriculaResponse } from '@/modules/matricula/types/matricula.types'
import { matriculaKeys } from '@/modules/matricula/hooks/matricula.keys'

interface MatriculaInstrutorCreate {
  aluno_id: number
  plano_id: number
}

export function useCreateMatriculaInstrutor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: MatriculaInstrutorCreate) =>
      api.post<MatriculaResponse>('/instrutores/me/matriculas', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: matriculaKeys.all }),
  })
}
