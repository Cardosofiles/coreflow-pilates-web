"use client";

import { useQuery } from "@tanstack/react-query";
import { sessoesService } from "../actions/agenda-actions";

export const SESSOES_QUERY_KEY = ["sessoes"] as const;

export function useGetSessoes() {
  return useQuery({
    queryKey: SESSOES_QUERY_KEY,
    queryFn: sessoesService.getAll,
  });
}