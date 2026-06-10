import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import { alunoKeys } from './aluno.keys'

export function useDeleteAluno() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/alunos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: alunoKeys.all }),
  })
}
