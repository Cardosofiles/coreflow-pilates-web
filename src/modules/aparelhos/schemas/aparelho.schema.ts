import { z } from 'zod'

export const aparelhoSchema = z.object({
  nome: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  descricao: z.string().max(500, 'Máximo 500 caracteres').optional().nullable(),
  ativo: z.boolean().default(true),
})

export type AparelhoFormValues = z.infer<typeof aparelhoSchema>
