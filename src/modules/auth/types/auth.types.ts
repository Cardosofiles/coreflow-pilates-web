import type z from 'zod'

import type { signInFormSchema, signUpFormSchema } from '@/modules/auth/schemas'

export type SignInFormData = z.infer<typeof signInFormSchema>
export type SignUpFormData = z.infer<typeof signUpFormSchema>

export type PapelUsuario = 'ADMIN' | 'ALUNO' | 'INSTRUTOR'

export interface Usuario {
  id: number
  nome: string
  email: string
  papel: PapelUsuario
}

export interface LoginResponse {
  access_token: string
  token_type: string
  usuario: Usuario
}
