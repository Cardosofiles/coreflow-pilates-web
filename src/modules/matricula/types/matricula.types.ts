export type StatusMatricula = 'PENDENTE_PAGAMENTO' | 'ATIVA' | 'DESATIVADA'

export interface MatriculaCreate {
  aluno_id: number
  plano_id: number
  data_inicio: string
  status?: StatusMatricula
}

export interface MatriculaUpdate {
  plano_id?: number
  data_inicio?: string
  status?: StatusMatricula
}

export interface MatriculaResponse {
  id: number
  aluno_id: number
  plano_id: number
  data_inicio: string
  data_fim: string
  status: StatusMatricula
  valor_contratado: number
  aulas_por_semana_contratadas: number
  duracao_meses_contratada: number
  created_at: string
  updated_at: string
}
