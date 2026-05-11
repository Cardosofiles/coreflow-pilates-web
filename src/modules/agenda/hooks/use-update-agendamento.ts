"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agendamentosService } from "../actions/agenda-actions";
import { AGENDAMENTOS_QUERY_KEY } from "./use-get-agendamentos";
import type { AgendamentoUpdatePayload } from "../types";

export function useUpdateAgendamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AgendamentoUpdatePayload }) =>
      agendamentosService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENDAMENTOS_QUERY_KEY });
    },
  });
}