import type z from 'zod'

import type { signInFormSchema, signUpFormSchema } from '@/modules/auth/schemas'

export type SignInFormData = z.infer<typeof signInFormSchema>
export type SignUpFormData = z.infer<typeof signUpFormSchema>
