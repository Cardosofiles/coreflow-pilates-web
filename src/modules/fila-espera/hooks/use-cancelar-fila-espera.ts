import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import { filaEsperaKeys } from './fila-espera.keys'

export function useCancelarFilaEspera() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.patch(`/filas-espera/${id}/cancelar`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: filaEsperaKeys.all }),
  })
}
