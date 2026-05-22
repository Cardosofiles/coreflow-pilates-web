import { z } from 'zod'

export const filaEsperaCreateSchema = z.object({
  aluno_id: z.number().min(1, 'Aluno obrigatório'),
  sessao_id: z.number().min(1, 'Sessão obrigatória'),
})

export type FilaEsperaCreateSchema = z.infer<typeof filaEsperaCreateSchema>
