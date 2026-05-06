import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AlunoResponse } from '../types/aluno.types'

export function useGetAluno(id: number) {
  return useQuery({
    queryKey: ['alunos', id],
    queryFn: () => api.get<AlunoResponse>(`/alunos/${id}`).then(r => r.data),
    enabled: !!id,
  })
}
