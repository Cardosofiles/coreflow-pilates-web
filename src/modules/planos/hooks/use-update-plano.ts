import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { PlanoResponse, PlanoUpdate } from '../types/plano.types'

export function useUpdatePlano() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PlanoUpdate }) =>
      api.put<PlanoResponse>(`/planos/${id}`, data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['planos'] }),
  })
}
