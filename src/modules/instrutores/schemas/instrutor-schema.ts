import { z } from 'zod'

export const instrutorCreateSchema = z.object({
  nome: z.string().min(3, 'Mínimo 3 caracteres').max(120),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Mínimo 6 caracteres').max(128),
  telefone: z.string().max(20).optional().nullable(),
  especialidade: z.string().max(100).optional().nullable(),
  ativo: z.boolean().default(true),
})

export const instrutorUpdateSchema = instrutorCreateSchema
  .extend({
    senha: z.string().min(6).max(128).optional(),
  })
  .partial()
  .extend({ ativo: z.boolean().optional() })

export type InstrutorCreateSchema = z.infer<typeof instrutorCreateSchema>
export type InstrutorUpdateSchema = z.infer<typeof instrutorUpdateSchema>
