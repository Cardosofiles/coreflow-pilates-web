export interface AlunoCreate {
  nome: string
  email: string
  senha: string
  telefone?: string | null
  data_nascimento?: string | null
  ativo: boolean
}

export interface AlunoUpdate {
  nome?: string
  email?: string
  senha?: string
  telefone?: string | null
  data_nascimento?: string | null
  ativo?: boolean
}

export interface AlunoResponse {
  id: number
  nome: string
  email: string
  telefone: string | null
  data_nascimento: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}
