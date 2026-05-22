import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'

export function useDeleteFilaEspera() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/filas-espera/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['filas-espera'] }),
  })
}
