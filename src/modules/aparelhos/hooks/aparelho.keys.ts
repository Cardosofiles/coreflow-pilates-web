/**
 * Query-key factory do módulo `aparelhos`.
 * Fonte única de verdade para as chaves do TanStack Query deste recurso.
 */
export const aparelhoKeys = {
  all: ['aparelhos'] as const,
  detail: (id: number) => [...aparelhoKeys.all, id] as const,
} as const
