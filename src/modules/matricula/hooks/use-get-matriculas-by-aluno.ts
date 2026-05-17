import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { MatriculaResponse } from '../types/matricula.types'

export function useGetMatriculasByAluno(alunoId: number) {
  return useQuery({
    queryKey: ['matriculas', 'aluno', alunoId],
    queryFn: () =>
      api.get<MatriculaResponse[]>(`/matriculas/aluno/${alunoId}`).then(r => r.data),
    enabled: !!alunoId,
  })
}
