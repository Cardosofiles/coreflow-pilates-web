import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import { matriculaKeys } from './matricula.keys'

export function useDeleteMatricula() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/matriculas/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: matriculaKeys.all }),
  })
}
