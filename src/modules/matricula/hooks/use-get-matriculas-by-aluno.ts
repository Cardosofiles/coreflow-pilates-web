import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { MatriculaResponse } from '../types/matricula.types'
import { matriculaKeys } from './matricula.keys'

export function useGetMatriculasByAluno(alunoId: number) {
  return useQuery({
    queryKey: matriculaKeys.byAluno(alunoId),
    queryFn: () =>
      api.get<MatriculaResponse[]>(`/matriculas/aluno/${alunoId}`).then(r => r.data),
    enabled: !!alunoId,
  })
}
