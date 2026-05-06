import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AlunoUpdate, AlunoResponse } from '../types/aluno.types'

export function useUpdateAluno(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AlunoUpdate) =>
      api.put<AlunoResponse>(`/alunos/${id}`, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alunos'] })
      queryClient.invalidateQueries({ queryKey: ['alunos', id] })
    },
  })
}
