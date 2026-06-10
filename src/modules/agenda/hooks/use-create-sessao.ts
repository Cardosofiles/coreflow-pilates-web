"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessoesService } from "../actions/agenda-actions";
import { sessaoKeys } from "./agenda.keys";
import type { SessaoCreatePayload } from "../types";

export function useCreateSessao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SessaoCreatePayload) =>
      sessoesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessaoKeys.all });
    },
  });
}