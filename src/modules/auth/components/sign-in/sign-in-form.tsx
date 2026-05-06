'use client'

import Link from 'next/link'
import { useState, type JSX } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { SignInEmailField } from './sign-in-email-field'
import { SignInPasswordField } from './sign-in-password-field'
import { signInFormSchema } from '@/modules/auth/schemas'
import type { SignInFormData } from '@/modules/auth/types'
import { useAuth } from '@/modules/auth/hooks'

const SignInForm = (): JSX.Element => {
  const { login } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const form = useForm<SignInFormData>({
    defaultValues: { email: '', password: '' },
  })

  const handleSignIn = async (data: SignInFormData) => {
    const parsed = signInFormSchema.safeParse(data)
    if (!parsed.success) {
      parsed.error.issues.forEach(issue => {
        form.setError(issue.path[0] as keyof SignInFormData, { message: issue.message })
      })
      return
    }
    setServerError(null)
    setPending(true)
    const error = await login(parsed.data)
    setPending(false)
    if (error) setServerError(error)
  }

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="w-full max-w-sm space-y-6 p-6">
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

        <p className="text-muted-foreground text-center text-sm">
          Não tem uma conta?{' '}
          <Link
            href="/sign-up"
            className="hover:text-primary font-medium underline underline-offset-4"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}

export { SignInForm }
