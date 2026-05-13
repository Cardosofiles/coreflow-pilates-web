export interface InstrutorCreate {
  nome: string
  email: string
  senha: string
  telefone?: string | null
  especialidade?: string | null
  ativo: boolean
}

export interface InstrutorUpdate {
  nome?: string
  email?: string
  senha?: string
  telefone?: string | null
  especialidade?: string | null
  ativo?: boolean
}

export interface InstrutorResponse {
  id: number
  nome: string
  email: string
  telefone: string | null
  especialidade: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}
