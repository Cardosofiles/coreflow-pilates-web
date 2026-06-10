/**
 * Query-key factory do módulo `planos`.
 * Fonte única de verdade para as chaves do TanStack Query deste recurso.
 */
export const planoKeys = {
  all: ['planos'] as const,
  detail: (id: number) => [...planoKeys.all, id] as const,
} as const
