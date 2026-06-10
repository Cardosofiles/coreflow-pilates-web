"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { sessaoKeys } from "./agenda.keys";

export function useDeleteSessao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/sessoes/${id}`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessaoKeys.all }),
  });
}
