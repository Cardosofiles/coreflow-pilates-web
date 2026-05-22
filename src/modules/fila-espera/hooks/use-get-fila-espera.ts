import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { FilaEsperaResponse } from '../types/fila-espera.types'

export function useGetFilaEspera(id: number) {
  return useQuery({
    queryKey: ['filas-espera', id],
    queryFn: () => api.get<FilaEsperaResponse>(`/filas-espera/${id}`).then(r => r.data),
    enabled: !!id,
  })
}
