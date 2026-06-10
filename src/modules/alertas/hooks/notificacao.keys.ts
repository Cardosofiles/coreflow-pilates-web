/**
 * Query-key factory do módulo `alertas` (notificações).
 * Fonte única de verdade para as chaves do TanStack Query deste recurso.
 */
export const notificacaoKeys = {
  all: ['notificacoes'] as const,
  pendentes: ['notificacoes', 'pendentes'] as const,
} as const
