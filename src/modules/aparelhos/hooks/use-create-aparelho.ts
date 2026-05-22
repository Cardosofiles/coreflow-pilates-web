import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { AparelhoCreate, AparelhoResponse } from '../types/aparelho.types'
import { APARELHOS_QUERY_KEY } from './use-get-aparelhos'

export function useCreateAparelho() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AparelhoCreate) =>
      api.post<AparelhoResponse>('/aparelhos', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APARELHOS_QUERY_KEY }),
  })
}
