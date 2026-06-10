import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { FilaEsperaResponse } from '../types/fila-espera.types'
import { filaEsperaKeys } from './fila-espera.keys'

export function useGetFilaEspera(id: number) {
  return useQuery({
    queryKey: filaEsperaKeys.detail(id),
    queryFn: () => api.get<FilaEsperaResponse>(`/filas-espera/${id}`).then(r => r.data),
    enabled: !!id,
  })
}
