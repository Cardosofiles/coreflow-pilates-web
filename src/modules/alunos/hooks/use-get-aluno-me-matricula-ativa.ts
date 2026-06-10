import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { MatriculaResponse } from '@/modules/matricula/types/matricula.types'
import { alunoKeys } from './aluno.keys'

export function useGetAlunoMeMatriculaAtiva() {
  return useQuery({
    queryKey: alunoKeys.meMatriculaAtiva,
    queryFn: () =>
      api.get<MatriculaResponse>('/alunos/me/matricula-ativa').then(r => r.data),
    retry: false,
  })
}
