import { z } from 'zod'

export const signInFormSchema = z.object({
  email: z.email({
    message: 'Email é obrigatório',
  }),
  password: z.string().min(1, { message: 'Senha é obrigatória' }).max(20),
})

export const signUpFormSchema = z
  .object({
    name: z.string().min(1, { message: 'Nome é obrigatório' }).max(100),
    email: z.email({
      message: 'Email é obrigatório',
    }),
    password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }).max(20),
    confirmPassword: z.string().min(6, { message: 'Confirmação de senha é obrigatória' }).max(20),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
