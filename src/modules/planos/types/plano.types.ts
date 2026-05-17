export type AulasPorSemana = 1 | 2 | 3
export type DuracaoMeses = 1 | 2 | 3 | 6 | 12

export interface PlanoCreate {
  nome: string
  descricao?: string | null
  valor_mensal: number
  aulas_por_semana: AulasPorSemana
  duracao_meses: DuracaoMeses
  ativo?: boolean
}

export interface PlanoUpdate {
  nome?: string
  descricao?: string | null
  valor_mensal?: number
  aulas_por_semana?: AulasPorSemana
  duracao_meses?: DuracaoMeses
  ativo?: boolean
}

export interface PlanoResponse {
  id: number
  nome: string
  descricao: string | null
  valor_mensal: number
  aulas_por_semana: AulasPorSemana
  duracao_meses: DuracaoMeses
  ativo: boolean
  created_at: string
  updated_at: string
}
