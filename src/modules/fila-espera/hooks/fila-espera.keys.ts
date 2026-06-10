/**
 * Query-key factory do módulo `fila-espera`.
 * Fonte única de verdade para as chaves do TanStack Query deste recurso.
 */
export const filaEsperaKeys = {
  all: ['filas-espera'] as const,
  detail: (id: number) => [...filaEsperaKeys.all, id] as const,
} as const
