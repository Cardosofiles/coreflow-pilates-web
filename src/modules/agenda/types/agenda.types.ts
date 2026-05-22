// ──────────────────────────────────────────────────────────
// Agendamento
// ──────────────────────────────────────────────────────────
export type StatusAgendamento = 'AGENDADO' | 'PRESENTE' | 'FALTA' | 'CANCELADO'
export type TipoCobrancaAgendamento = 'MATRICULA' | 'AVULSO'

export interface AgendamentoResponse {
  id: number;
  aluno_id: number;
  sessao_id: number;
  aparelho_id: number;
  instrutor_id: number;
  matricula_id: number | null;
  tipo_cobranca: TipoCobrancaAgendamento;
  status: StatusAgendamento;
  observacao: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgendamentoCreatePayload {
  aluno_id: number;
  sessao_id: number;
  aparelho_id: number;
  instrutor_id: number;
  matricula_id?: number | null;
  tipo_cobranca?: TipoCobrancaAgendamento;
  status?: StatusAgendamento;
  observacao?: string | null;
}

export interface AgendamentoUpdatePayload {
  aluno_id?: number;
  sessao_id?: number;
  aparelho_id?: number;
  instrutor_id?: number;
  matricula_id?: number | null;
  tipo_cobranca?: TipoCobrancaAgendamento;
  status?: StatusAgendamento;
  observacao?: string | null;
}

/** @deprecated use AgendamentoResponse */
export type Agendamento = AgendamentoResponse;

// ──────────────────────────────────────────────────────────
// Sessão
// ──────────────────────────────────────────────────────────
export type SessaoStatus = 'ABERTA' | 'ENCERRADA' | 'CANCELADA'

export interface Sessao {
  id: number;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  capacidade_maxima: number;
  status: SessaoStatus;
  created_at: string;
  updated_at: string;
}

export interface SessaoCreatePayload {
  data: string;
  hora_inicio: string;
  hora_fim: string;
  capacidade_maxima: number;
}

export interface SessaoUpdatePayload {
  data?: string | null;
  hora_inicio?: string | null;
  hora_fim?: string | null;
  capacidade_maxima?: number | null;
  status?: SessaoStatus | null;
}

// ──────────────────────────────────────────────────────────
// Shared
// ──────────────────────────────────────────────────────────
export interface ValidationErrorItem {
  loc: Array<string | number>;
  msg: string;
  type: string;
  input: string;
  ctx: Record<string, unknown>;
}

export interface ValidationError {
  detail: ValidationErrorItem[];
}