import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { MatriculaCreate, MatriculaResponse } from '../types/matricula.types'
import { matriculaKeys } from './matricula.keys'

export function useCreateMatricula() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: MatriculaCreate) =>
      api.post<MatriculaResponse>('/matriculas', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: matriculaKeys.all }),
  })
}
