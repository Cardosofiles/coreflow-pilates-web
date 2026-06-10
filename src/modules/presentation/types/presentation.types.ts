/** Subset of the GitHub Users API response we render in the developer cards. */
export interface GithubUser {
  login: string
  id: number
  name: string | null
  avatar_url: string
  html_url: string
  bio: string | null
  company: string | null
  location: string | null
  blog: string | null
  public_repos: number
  followers: number
  following: number
}

/** Map of `login (lowercase)` → fetched GitHub profile. */
export type GithubUserMap = Record<string, GithubUser>

/** A project member, tied to a GitHub handle and an area of the project. */
export interface Collaborator {
  login: string
  fallbackName: string
  role: string
}

/**
 * A technology/tool logo.
 * - `src`: single, theme-agnostic asset.
 * - `srcLight` / `srcDark`: paired assets — the *light* file holds the dark-coloured
 *   logo (shown on light backgrounds) and the *dark* file holds the light-coloured logo.
 * - `invertOnLight`: invert a light-only logo so it stays visible on light backgrounds.
 */
export interface TechItem {
  name: string
  src?: string
  srcLight?: string
  srcDark?: string
  invertOnLight?: boolean
}
