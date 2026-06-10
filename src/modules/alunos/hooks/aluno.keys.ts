/**
 * Query-key factory do módulo `alunos`.
 *
 * Fonte única de verdade para as chaves do TanStack Query deste recurso. Use
 * sempre estas funções em `useQuery({ queryKey })` e
 * `queryClient.invalidateQueries({ queryKey })` — nunca arrays literais soltos.
 *
 * As chaves são hierárquicas: invalidar `alunoKeys.all` (`['alunos']`) também
 * invalida `detail(id)` e todas as `me*`, pois o TanStack faz match por prefixo.
 *
 * Sem `'use client'`: é um módulo de dados puro, importável no server (RSC) para
 * futuro prefetch/dehydrate.
 */
export const alunoKeys = {
  all: ['alunos'] as const,
  detail: (id: number) => [...alunoKeys.all, id] as const,
  me: ['alunos', 'me'] as const,
  meAgenda: ['alunos', 'me', 'agenda'] as const,
  meAgendamentos: ['alunos', 'me', 'agendamentos'] as const,
  meMatriculas: ['alunos', 'me', 'matriculas'] as const,
  meMatriculaAtiva: ['alunos', 'me', 'matricula-ativa'] as const,
} as const
