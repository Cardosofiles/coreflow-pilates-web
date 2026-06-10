/**
 * Query-key factory do módulo `dashboard`.
 * Fonte única de verdade para as chaves do TanStack Query deste recurso.
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  agendamentosPorDia: ['dashboard', 'agendamentos-por-dia'] as const,
  alunosPorMes: ['dashboard', 'alunos-por-mes'] as const,
} as const
