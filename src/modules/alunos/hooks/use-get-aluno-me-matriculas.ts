import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { MatriculaResponse } from '@/modules/matricula/types/matricula.types'
import { alunoKeys } from './aluno.keys'

export function useGetAlunoMeMatriculas() {
  return useQuery({
    queryKey: alunoKeys.meMatriculas,
    queryFn: () =>
      api.get<MatriculaResponse[]>('/alunos/me/matriculas?limit=100').then(r => r.data),
  })
}
