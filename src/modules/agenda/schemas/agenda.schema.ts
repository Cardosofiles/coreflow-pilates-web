import { z } from 'zod'

export const agendamentoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  ativo: z.boolean().default(true),
})

export type AgendamentoFormValues = z.infer<typeof agendamentoSchema>

export const sessaoSchema = z.object({
  data: z.string().min(1, 'Data é obrigatória'),
  hora_inicio: z.string().min(1, 'Hora de início é obrigatória'),
  hora_fim: z.string().min(1, 'Hora de fim é obrigatória'),
  capacidade_maxima: z.number().min(1, 'Mínimo de 1 aluno'),
})

export type SessaoFormValues = z.infer<typeof sessaoSchema>
