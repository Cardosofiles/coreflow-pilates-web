"use client";

import { useQuery } from "@tanstack/react-query";
import { agendamentosService } from "../actions/agenda-actions";
import { agendamentoKeys } from "./agenda.keys";

export function useGetAgendamentos() {
  return useQuery({
    queryKey: agendamentoKeys.all,
    queryFn: agendamentosService.getAll,
  });
}