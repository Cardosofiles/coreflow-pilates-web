"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AgendamentoResponse } from "../types";
import { AGENDAMENTOS_QUERY_KEY } from "./use-get-agendamentos";

export function useRegistrarFalta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.patch<AgendamentoResponse>(`/agendamentos/${id}/falta`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AGENDAMENTOS_QUERY_KEY }),
  });
}
