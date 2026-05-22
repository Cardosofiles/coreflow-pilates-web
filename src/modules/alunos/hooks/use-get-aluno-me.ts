import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AlunoResponse } from '../types/aluno.types'

export function useGetAlunoMe() {
  return useQuery({
    queryKey: ['alunos', 'me'],
    queryFn: () => api.get<AlunoResponse>('/alunos/me').then(r => r.data),
  })
}
