import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'

export function useCancelarFilaEspera() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.patch(`/filas-espera/${id}/cancelar`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['filas-espera'] }),
  })
}
