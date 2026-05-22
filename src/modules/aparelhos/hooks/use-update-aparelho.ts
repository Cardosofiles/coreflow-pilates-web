import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AparelhoResponse, AparelhoUpdate } from '../types/aparelho.types'
import { APARELHOS_QUERY_KEY } from './use-get-aparelhos'

export function useUpdateAparelho() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AparelhoUpdate }) =>
      api.put<AparelhoResponse>(`/aparelhos/${id}`, data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APARELHOS_QUERY_KEY }),
  })
}
