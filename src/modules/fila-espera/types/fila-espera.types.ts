export interface FilaEsperaCreate {
  aluno_id: number
  sessao_id: number
}

export interface FilaEsperaResponse {
  id: number
  aluno_id: number
  sessao_id: number
  status: string
  created_at: string
  updated_at: string
}
