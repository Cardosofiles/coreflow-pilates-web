export interface AparelhoCreate {
  nome: string
  descricao?: string | null
  ativo?: boolean
}

export interface AparelhoUpdate {
  nome?: string | null
  descricao?: string | null
  ativo?: boolean | null
}

export interface AparelhoResponse {
  id: number
  nome: string
  descricao: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}
