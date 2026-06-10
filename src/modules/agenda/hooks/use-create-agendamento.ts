"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agendamentosService } from "../actions/agenda-actions";
import { agendamentoKeys } from "./agenda.keys";
import type { AgendamentoCreatePayload } from "../types";

export function useCreateAgendamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AgendamentoCreatePayload) =>
      agendamentosService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agendamentoKeys.all });
    },
  });
}