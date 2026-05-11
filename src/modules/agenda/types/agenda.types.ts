// ──────────────────────────────────────────────────────────
// Agendamento
// ──────────────────────────────────────────────────────────
export interface Agendamento {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgendamentoCreatePayload {
  nome: string;
  descricao: string;
  ativo: boolean;
}

export interface AgendamentoUpdatePayload {
  nome?: string;
  descricao?: string;
  ativo?: boolean;
}

// ──────────────────────────────────────────────────────────
// Sessão
// ──────────────────────────────────────────────────────────
export type SessaoStatus = "ABERTA" | "FECHADA" | "CANCELADA";

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