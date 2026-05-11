"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessoesService } from "../actions/agenda-actions";
import { SESSOES_QUERY_KEY } from "./use-get-sessoes";
import type { SessaoCreatePayload } from "../types";

export function useCreateSessao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SessaoCreatePayload) =>
      sessoesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSOES_QUERY_KEY });
    },
  });
}