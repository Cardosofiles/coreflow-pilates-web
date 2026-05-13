import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'

export function useDeleteInstrutor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/instrutores/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['instrutores'] }),
  })
}
