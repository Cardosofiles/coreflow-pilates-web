"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AgendamentoResponse } from "../types";
import { agendamentoKeys } from "./agenda.keys";

export function useCancelarAgendamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.patch<AgendamentoResponse>(`/agendamentos/${id}/cancelar`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: agendamentoKeys.all }),
  });
}
