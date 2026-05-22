export type TipoNotificacao = 'LEMBRETE_AULA'
export type CanalNotificacao = 'EMAIL'
export type StatusNotificacao = 'PENDENTE' | 'ENVIADO' | 'FALHOU'

export interface NotificacaoResponse {
  id: number
  tipo: TipoNotificacao
  canal: CanalNotificacao
  status: StatusNotificacao
  agendamento_id: number
  destinatario_email: string
  assunto: string
  mensagem: string
  enviar_em: string
  enviado_em: string | null
  erro: string | null
  created_at: string
  updated_at: string
}
