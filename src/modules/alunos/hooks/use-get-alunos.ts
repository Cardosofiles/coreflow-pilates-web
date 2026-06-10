import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AlunoResponse } from '../types/aluno.types'
import { alunoKeys } from './aluno.keys'

export function useGetAlunos() {
  return useQuery({
    queryKey: alunoKeys.all,
    queryFn: () => api.get<AlunoResponse[]>('/alunos?limit=1000').then(r => r.data),
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
  })
}
