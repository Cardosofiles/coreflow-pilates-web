import { z } from 'zod'

export const planoCreateSchema = z.object({
  nome: z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
  descricao: z.string().max(500).optional().nullable(),
  valor_mensal: z.coerce.number().positive('Valor deve ser maior que zero'),
  aulas_por_semana: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  duracao_meses: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(6), z.literal(12)]),
  ativo: z.boolean().default(true),
})

export const planoUpdateSchema = planoCreateSchema.partial()

export type PlanoCreateSchema = z.infer<typeof planoCreateSchema>
export type PlanoUpdateSchema = z.infer<typeof planoUpdateSchema>
