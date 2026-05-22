import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import { APARELHOS_QUERY_KEY } from './use-get-aparelhos'

export function useDeleteAparelho() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/aparelhos/${id}`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APARELHOS_QUERY_KEY }),
  })
}
