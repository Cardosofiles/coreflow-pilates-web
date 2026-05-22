import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { MatriculaResponse } from '@/modules/matricula/types/matricula.types'

export function useGetAlunoMeMatriculaAtiva() {
  return useQuery({
    queryKey: ['alunos', 'me', 'matricula-ativa'],
    queryFn: () =>
      api.get<MatriculaResponse>('/alunos/me/matricula-ativa').then(r => r.data),
    retry: false,
  })
}
