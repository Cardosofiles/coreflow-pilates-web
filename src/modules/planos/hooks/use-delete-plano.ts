import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'

export function useDeletePlano() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/planos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['planos'] }),
  })
}
