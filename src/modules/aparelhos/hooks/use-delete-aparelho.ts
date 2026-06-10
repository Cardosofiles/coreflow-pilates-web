import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import { aparelhoKeys } from './aparelho.keys'

export function useDeleteAparelho() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/aparelhos/${id}`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: aparelhoKeys.all }),
  })
}
