import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AlunoResponse } from '../types/aluno.types'

const GET_ALUNOS_QUERY_KEY = ['alunos'] as const

export function useGetAlunos() {
  return useQuery({
    queryKey: GET_ALUNOS_QUERY_KEY,
    queryFn: () => api.get<AlunoResponse[]>('/alunos?limit=1000').then(r => r.data),
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
  })
}
