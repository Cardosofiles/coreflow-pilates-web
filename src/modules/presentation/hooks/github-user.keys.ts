/**
 * Query-key factory do módulo `presentation` (perfis públicos do GitHub).
 * Fonte única de verdade para as chaves do TanStack Query deste recurso.
 */
export const githubUserKeys = {
  all: ['github-users'] as const,
  byLogins: (logins: string[]) => [...githubUserKeys.all, logins] as const,
} as const
