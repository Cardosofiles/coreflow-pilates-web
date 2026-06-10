"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agendamentosService } from "../actions/agenda-actions";
import { agendamentoKeys } from "./agenda.keys";

export function useDeleteAgendamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => agendamentosService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agendamentoKeys.all });
    },
  });
}