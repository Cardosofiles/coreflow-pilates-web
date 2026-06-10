import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { FilaEsperaResponse } from '../types/fila-espera.types'
import { filaEsperaKeys } from './fila-espera.keys'

interface FilaEsperaConverterPayload {
  aparelho_id?: number | null
  instrutor_id?: number | null
}

export function useConverterFilaEspera() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: FilaEsperaConverterPayload }) =>
      api.post<FilaEsperaResponse>(`/filas-espera/${id}/converter`, data ?? {}).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: filaEsperaKeys.all }),
  })
}
