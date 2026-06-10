import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { MatriculaResponse } from '../types/matricula.types'
import { matriculaKeys } from './matricula.keys'

export function useGetMatriculaAtiva(alunoId: number) {
  return useQuery({
    queryKey: matriculaKeys.ativaByAluno(alunoId),
    queryFn: () =>
      api.get<MatriculaResponse>(`/matriculas/aluno/${alunoId}/ativa`).then(r => r.data),
    enabled: !!alunoId,
    retry: false,
  })
}
