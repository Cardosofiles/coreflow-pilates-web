"use client";

import { useQuery } from "@tanstack/react-query";
import { agendamentosService } from "../actions/agenda-actions";

export const AGENDAMENTOS_QUERY_KEY = ["agendamentos"] as const;

export function useGetAgendamentos() {
  return useQuery({
    queryKey: AGENDAMENTOS_QUERY_KEY,
    queryFn: agendamentosService.getAll,
  });
}