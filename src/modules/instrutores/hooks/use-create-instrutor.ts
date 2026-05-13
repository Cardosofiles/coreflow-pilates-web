import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { InstrutorCreate, InstrutorResponse } from '../types/instrutor.types'

export function useCreateInstrutor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: InstrutorCreate) =>
      api.post<InstrutorResponse>('/instrutores', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['instrutores'] }),
  })
}
