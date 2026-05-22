'use server'

import { api } from '@/lib/api'
import type { FilaEsperaCreate, FilaEsperaResponse } from '../types/fila-espera.types'

export async function getFilasEsperaAction(): Promise<FilaEsperaResponse[]> {
  const { data } = await api.get<FilaEsperaResponse[]>('/filas-espera?limit=1000')
  return data
}

export async function getFilaEsperaAction(id: number): Promise<FilaEsperaResponse> {
  const { data } = await api.get<FilaEsperaResponse>(`/filas-espera/${id}`)
  return data
}

export async function createFilaEsperaAction(body: FilaEsperaCreate): Promise<FilaEsperaResponse> {
  const { data } = await api.post<FilaEsperaResponse>('/filas-espera', body)
  return data
}

export async function deleteFilaEsperaAction(id: number): Promise<void> {
  await api.delete(`/filas-espera/${id}`)
}

export async function cancelarFilaEsperaAction(id: number): Promise<void> {
  await api.patch(`/filas-espera/${id}/cancelar`)
}
