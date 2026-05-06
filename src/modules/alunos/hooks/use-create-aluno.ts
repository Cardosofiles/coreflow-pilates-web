import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AlunoCreate, AlunoResponse } from '../types/aluno.types'

export function useCreateAluno() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AlunoCreate) =>
      api.post<AlunoResponse>('/alunos', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alunos'] }),
  })
}
