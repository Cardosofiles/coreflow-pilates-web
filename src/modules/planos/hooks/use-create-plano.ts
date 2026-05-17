import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { PlanoCreate, PlanoResponse } from '../types/plano.types'

export function useCreatePlano() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PlanoCreate) =>
      api.post<PlanoResponse>('/planos', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['planos'] }),
  })
}
