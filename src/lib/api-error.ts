import { isAxiosError } from 'axios'

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const detail = (err.response?.data as { detail?: string })?.detail
    return detail ?? fallback
  }
  return fallback
}
