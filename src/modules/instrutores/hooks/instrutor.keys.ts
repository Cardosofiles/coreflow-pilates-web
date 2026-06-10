/**
 * Query-key factory do módulo `instrutores`.
 * Fonte única de verdade para as chaves do TanStack Query deste recurso.
 */
export const instrutorKeys = {
  all: ['instrutores'] as const,
  detail: (id: number) => [...instrutorKeys.all, id] as const,
  me: ['instrutores', 'me'] as const,
  meAgendamentos: ['instrutores', 'me', 'agendamentos'] as const,
} as const
