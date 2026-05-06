import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AlunoResponse } from '../types/aluno.types'

export function useGetAlunos() {
  return useQuery({
    queryKey: ['alunos'],
    queryFn: () => api.get<AlunoResponse[]>('/alunos?limit=1000').then(r => r.data),
  })
}
