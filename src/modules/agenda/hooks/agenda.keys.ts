/**
 * Query-key factories do módulo `agenda` (agendamentos + sessões).
 * Fonte única de verdade para as chaves do TanStack Query deste recurso.
 */
export const agendamentoKeys = {
  all: ["agendamentos"] as const,
  detail: (id: number) => [...agendamentoKeys.all, id] as const,
} as const;

export const sessaoKeys = {
  all: ["sessoes"] as const,
  detail: (id: number) => [...sessaoKeys.all, id] as const,
} as const;
