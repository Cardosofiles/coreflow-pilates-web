'use server'

import { api } from '@/lib/api'
import type { InstrutorCreate, InstrutorUpdate, InstrutorResponse } from '../types/instrutor.types'

export async function getInstrutoresAction(): Promise<InstrutorResponse[]> {
  const { data } = await api.get<InstrutorResponse[]>('/instrutores?limit=1000')
  return data
}

export async function getInstrutorAction(id: number): Promise<InstrutorResponse> {
  const { data } = await api.get<InstrutorResponse>(`/instrutores/${id}`)
  return data
}

export async function createInstrutorAction(body: InstrutorCreate): Promise<InstrutorResponse> {
  const { data } = await api.post<InstrutorResponse>('/instrutores', body)
  return data
}

export async function updateInstrutorAction(
  id: number,
  body: InstrutorUpdate
): Promise<InstrutorResponse> {
  const { data } = await api.put<InstrutorResponse>(`/instrutores/${id}`, body)
  return data
}

export async function deleteInstrutorAction(id: number): Promise<void> {
  await api.delete(`/instrutores/${id}`)
}
