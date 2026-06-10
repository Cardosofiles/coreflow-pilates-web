import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { MatriculaResponse, MatriculaUpdate } from '../types/matricula.types'
import { matriculaKeys } from './matricula.keys'

export function useUpdateMatricula() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MatriculaUpdate }) =>
      api.put<MatriculaResponse>(`/matriculas/${id}`, data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: matriculaKeys.all }),
  })
}
