import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'

export function useDeleteMatricula() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/matriculas/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['matriculas'] }),
  })
}
