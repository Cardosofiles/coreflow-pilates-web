'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type JSX } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { SignInEmailField, SignInPasswordField } from '@/modules/auth/components'
import type { SignInFormData } from '@/modules/auth/types'

const SignInForm = (): JSX.Element => {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const form = useForm<SignInFormData>({
    // resolver: zodResolver(signInFormSchema),
    // defaultValues: {
    //   email: '',
    //   password: '',
    // },
  })

  const handleSignIn = async (data: SignInFormData) => {
    // setServerError(null)
    // setPending(true)
    // const { error } = await signIn.email({
    //   email: data.email,
    //   password: data.password,
    // })
    // setPending(false)
    // if (error) {
    //   setServerError(error.message ?? 'Erro ao fazer login. Tente novamente.')
    //   return
    // }
    router.push('/dashboard')
    // router.refresh()
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
