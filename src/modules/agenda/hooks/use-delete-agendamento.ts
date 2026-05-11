"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agendamentosService } from "../actions/agenda-actions";
import { AGENDAMENTOS_QUERY_KEY } from "./use-get-agendamentos";

export function useDeleteAgendamento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => agendamentosService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENDAMENTOS_QUERY_KEY });
    },
  });
}