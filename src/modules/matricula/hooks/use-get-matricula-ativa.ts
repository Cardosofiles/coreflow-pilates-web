import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { MatriculaResponse } from '../types/matricula.types'

export function useGetMatriculaAtiva(alunoId: number) {
  return useQuery({
    queryKey: ['matriculas', 'aluno', alunoId, 'ativa'],
    queryFn: () =>
      api.get<MatriculaResponse>(`/matriculas/aluno/${alunoId}/ativa`).then(r => r.data),
    enabled: !!alunoId,
    retry: false,
  })
}
