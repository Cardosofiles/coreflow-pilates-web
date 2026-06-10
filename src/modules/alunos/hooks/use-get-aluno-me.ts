import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AlunoResponse } from '../types/aluno.types'
import { alunoKeys } from './aluno.keys'

export function useGetAlunoMe() {
  return useQuery({
    queryKey: alunoKeys.me,
    queryFn: () => api.get<AlunoResponse>('/alunos/me').then(r => r.data),
  })
}
