"use client";

import { useQuery } from "@tanstack/react-query";
import { sessoesService } from "../actions/agenda-actions";
import { sessaoKeys } from "./agenda.keys";

export function useGetSessoes() {
  return useQuery({
    queryKey: sessaoKeys.all,
    queryFn: sessoesService.getAll,
  });
}