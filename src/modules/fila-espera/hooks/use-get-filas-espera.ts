import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { FilaEsperaResponse } from '@/modules/fila-espera/types/fila-espera.types'
import { filaEsperaKeys } from './fila-espera.keys'

export function useGetFilasEspera() {
  return useQuery({
    queryKey: filaEsperaKeys.all,
    queryFn: () => api.get<FilaEsperaResponse[]>('/filas-espera?limit=1000').then(r => r.data),
  })
}
