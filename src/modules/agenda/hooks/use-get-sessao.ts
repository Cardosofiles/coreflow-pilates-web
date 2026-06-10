"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Sessao } from "../types";
import { sessaoKeys } from "./agenda.keys";

export function useGetSessao(id: number) {
  return useQuery({
    queryKey: sessaoKeys.detail(id),
    queryFn: () => api.get<Sessao>(`/sessoes/${id}`).then(r => r.data),
    enabled: !!id,
  });
}
