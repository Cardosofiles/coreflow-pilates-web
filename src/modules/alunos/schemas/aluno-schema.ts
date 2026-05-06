import { z } from 'zod'

export const alunoCreateSchema = z.object({
  nome: z.string().min(3, 'Mínimo 3 caracteres').max(120),
  email: z.email('Email inválido'),
  senha: z.string().min(6, 'Mínimo 6 caracteres').max(128),
  telefone: z.string().max(20).optional().nullable(),
  data_nascimento: z.string().optional().nullable(),
  ativo: z.boolean().default(true),
})

export const alunoUpdateSchema = alunoCreateSchema
  .extend({ senha: z.string().min(6).max(128).optional() })
  .partial()
  .extend({ ativo: z.boolean().optional() })

export type AlunoCreateSchema = z.infer<typeof alunoCreateSchema>
export type AlunoUpdateSchema = z.infer<typeof alunoUpdateSchema>
