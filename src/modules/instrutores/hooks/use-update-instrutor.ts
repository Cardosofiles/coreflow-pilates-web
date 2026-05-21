import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { InstrutorUpdate, InstrutorResponse } from '../types/instrutor.types'

export function useUpdateInstrutor(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: InstrutorUpdate) =>
      api.put<InstrutorResponse>(`/instrutores/${id}`, data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['instrutores'] }),
  })
}
