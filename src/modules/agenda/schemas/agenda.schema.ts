import { z } from 'zod'

export const agendamentoSchema = z.object({
  aluno_id: z.number().int().positive('Aluno é obrigatório'),
  sessao_id: z.number().int().positive('Sessão é obrigatória'),
  aparelho_id: z.number().int().positive('Aparelho é obrigatório'),
  instrutor_id: z.number().int().positive('Instrutor é obrigatório'),
  matricula_id: z.number().int().positive().optional().nullable(),
  tipo_cobranca: z.enum(['MATRICULA', 'AVULSO']).default('MATRICULA'),
  observacao: z.string().max(500).optional().nullable(),
})

export type AgendamentoFormValues = z.infer<typeof agendamentoSchema>

export const sessaoSchema = z.object({
  data: z.string().min(1, 'Data é obrigatória'),
  hora_inicio: z.string().min(1, 'Hora de início é obrigatória'),
  hora_fim: z.string().min(1, 'Hora de fim é obrigatória'),
  capacidade_maxima: z.number().min(1, 'Mínimo de 1 aluno'),
})

export type SessaoFormValues = z.infer<typeof sessaoSchema>
