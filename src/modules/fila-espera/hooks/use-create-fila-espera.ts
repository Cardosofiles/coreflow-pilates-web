import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { FilaEsperaCreate, FilaEsperaResponse } from '../types/fila-espera.types'
import { filaEsperaKeys } from './fila-espera.keys'

export function useCreateFilaEspera() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FilaEsperaCreate) =>
      api.post<FilaEsperaResponse>('/filas-espera', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: filaEsperaKeys.all }),
  })
}
