import { z } from 'zod'

export const matriculaCreateSchema = z.object({
  aluno_id: z.coerce.number().positive('Selecione um aluno'),
  plano_id: z.coerce.number().positive('Selecione um plano'),
  data_inicio: z.string().min(1, 'Informe a data de início'),
  status: z
    .enum(['PENDENTE_PAGAMENTO', 'ATIVA', 'DESATIVADA'])
    .optional()
    .default('PENDENTE_PAGAMENTO'),
})

export const matriculaUpdateSchema = z.object({
  plano_id: z.number().positive().optional(),
  data_inicio: z.string().optional(),
  status: z.enum(['PENDENTE_PAGAMENTO', 'ATIVA', 'DESATIVADA']).optional(),
})

export type MatriculaCreateSchema = z.infer<typeof matriculaCreateSchema>
export type MatriculaUpdateSchema = z.infer<typeof matriculaUpdateSchema>
