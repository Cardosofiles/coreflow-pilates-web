"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agendamentosService } from "../actions/agenda-actions";
import { AGENDAMENTOS_QUERY_KEY } from "./use-get-agendamentos";
import type { AgendamentoCreatePayload } from "../types";

export function useCreateAgendamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AgendamentoCreatePayload) =>
      agendamentosService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENDAMENTOS_QUERY_KEY });
    },
  });
}