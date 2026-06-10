import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import { filaEsperaKeys } from './fila-espera.keys'

export function useDeleteFilaEspera() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/filas-espera/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: filaEsperaKeys.all }),
  })
}
