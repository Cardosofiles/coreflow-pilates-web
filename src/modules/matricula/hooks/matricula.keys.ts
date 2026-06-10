/**
 * Query-key factory do módulo `matricula`.
 * Fonte única de verdade para as chaves do TanStack Query deste recurso.
 *
 * `ativaByAluno` é prefixada por `byAluno`, então invalidar `byAluno(alunoId)`
 * também invalida a matrícula ativa daquele aluno.
 */
export const matriculaKeys = {
  all: ['matriculas'] as const,
  vencendo: ['matriculas', 'vencendo'] as const,
  byAluno: (alunoId: number) => [...matriculaKeys.all, 'aluno', alunoId] as const,
  ativaByAluno: (alunoId: number) => [...matriculaKeys.byAluno(alunoId), 'ativa'] as const,
} as const
