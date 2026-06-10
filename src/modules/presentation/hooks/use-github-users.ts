'use client'

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import axios from 'axios'

import type { GithubUser, GithubUserMap } from '../types/presentation.types'
import { githubUserKeys } from './github-user.keys'

const fetchGithubUser = async (login: string): Promise<GithubUser> => {
  const { data } = await axios.get<GithubUser>(`https://api.github.com/users/${login}`)
  return data
}

/**
 * Busca em lote os perfis públicos do GitHub para os handles informados.
 * Usa `allSettled` para que um handle inexistente não derrube os demais e
 * retorna um mapa indexado por login em minúsculas.
 */
export const useGithubUsers = (logins: string[]): UseQueryResult<GithubUserMap> =>
  useQuery({
    queryKey: githubUserKeys.byLogins(logins),
    queryFn: async (): Promise<GithubUserMap> => {
      const settled = await Promise.allSettled(logins.map(fetchGithubUser))

      return settled.reduce<GithubUserMap>((acc, result, index) => {
        if (result.status === 'fulfilled') {
          acc[logins[index].toLowerCase()] = result.value
        }
        return acc
      }, {})
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: 1,
  })
