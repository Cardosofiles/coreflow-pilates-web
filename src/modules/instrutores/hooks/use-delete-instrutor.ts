import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import { instrutorKeys } from './instrutor.keys'

export function useDeleteInstrutor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/instrutores/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: instrutorKeys.all }),
  })
}
