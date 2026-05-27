export interface DashboardData {
  total_alunos_ativos: number
  total_instrutores_ativos: number
  total_matriculas_ativas: number
  total_sessoes_futuras: number
  total_agendamentos_futuros: number
  total_sessoes_lotadas: number
}

export interface AgendamentoPorDiaItem {
  data: string
  total: number
}

export interface AgendamentoPorDiaResponse {
  items: AgendamentoPorDiaItem[]
}

export interface AlunosPorMesItem {
  mes: string
  total: number
}

export interface AlunosPorMesResponse {
  items: AlunosPorMesItem[]
}
