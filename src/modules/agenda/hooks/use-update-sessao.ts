"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Sessao, SessaoUpdatePayload } from "../types";
import { sessaoKeys } from "./agenda.keys";

export function useUpdateSessao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SessaoUpdatePayload }) =>
      api.put<Sessao>(`/sessoes/${id}`, payload).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessaoKeys.all }),
  });
}
