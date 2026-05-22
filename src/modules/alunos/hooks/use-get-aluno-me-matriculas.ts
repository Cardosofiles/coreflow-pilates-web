import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { MatriculaResponse } from '@/modules/matricula/types/matricula.types'

export function useGetAlunoMeMatriculas() {
  return useQuery({
    queryKey: ['alunos', 'me', 'matriculas'],
    queryFn: () =>
      api.get<MatriculaResponse[]>('/alunos/me/matriculas?limit=100').then(r => r.data),
  })
}
