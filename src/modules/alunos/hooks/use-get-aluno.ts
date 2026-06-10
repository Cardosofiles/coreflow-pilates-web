import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AlunoResponse } from '../types/aluno.types'
import { alunoKeys } from './aluno.keys'

export function useGetAluno(id: number) {
  return useQuery({
    queryKey: alunoKeys.detail(id),
    queryFn: () => api.get<AlunoResponse>(`/alunos/${id}`).then(r => r.data),
    enabled: !!id,
  })
}
