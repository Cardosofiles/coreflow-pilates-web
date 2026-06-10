'use client'

import { type JSX } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { getLoginErrorMessage, useLogin } from '@/modules/auth/hooks'
import { signInFormSchema } from '@/modules/auth/schemas'
import type { SignInFormData } from '@/modules/auth/types'
import { SignInEmailField } from './sign-in-email-field'
import { SignInPasswordField } from './sign-in-password-field'

const SignInForm = (): JSX.Element => {
  const loginMutation = useLogin()

  const form = useForm<SignInFormData>({
    defaultValues: { email: '', password: '' },
  })

  const handleSignIn = (data: SignInFormData) => {
    const parsed = signInFormSchema.safeParse(data)
    if (!parsed.success) {
      parsed.error.issues.forEach(issue => {
        form.setError(issue.path[0] as keyof SignInFormData, { message: issue.message })
      })
      return
    }
    loginMutation.mutate(parsed.data)
  }

  const pending = loginMutation.isPending
  const serverError = loginMutation.isError ? getLoginErrorMessage(loginMutation.error) : null

  return (
    <div className="mx-auto w-full max-w-sm space-y-6 p-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
          <p className="text-muted-foreground text-sm">
            Digite seu email e senha para acessar sua conta
          </p>
        </div>

        <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4" noValidate>
          <SignInEmailField control={form.control} disabled={pending} />
          <SignInPasswordField control={form.control} disabled={pending} />

          {serverError && (
            <p role="alert" className="text-destructive text-sm">
              {serverError}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        {/* <p className="text-muted-foreground text-center text-sm">
          Não tem uma conta?{' '}
          <Link
            href="/sign-up"
            className="hover:text-primary font-medium underline underline-offset-4"
          >
            Criar conta
          </Link>
        </p> */}
    </div>
  )
}

export { SignInForm }
