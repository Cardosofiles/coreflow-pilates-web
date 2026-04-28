'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type JSX } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'

import { signUpFormSchema, type SignUpFormData } from '@/schemas/auth.schema'
import {
  SignUpConfirmPasswordField,
  SignUpEmailField,
  SignUpNameField,
  SignUpPasswordField,
} from '@/modules/auth/ui/components'

const SignUp = (): JSX.Element => {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const form = useForm<SignUpFormData>({
    // resolver: zodResolver(signUpFormSchema),
    // defaultValues: {
    //   name: '',
    //   email: '',
    //   password: '',
    //   confirmPassword: '',
    // },
    // TODO
  })

  const handleSignUp = async (data: SignUpFormData) => {
    // setServerError(null)
    // setPending(true)
    // const { error } = await signUp.email({
    //   name: data.name,
    //   email: data.email,
    //   password: data.password,
    // })
    // setPending(false)
    // if (error) {
    //   setServerError(error.message ?? 'Erro ao criar conta. Tente novamente.')
    //   return
    // }
    router.push('/dashboard')
    // router.refresh()
  }

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="w-full max-w-sm space-y-6 p-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
          <p className="text-muted-foreground text-sm">
            Preencha os dados abaixo para criar sua conta
          </p>
        </div>

        <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4" noValidate>
          <SignUpNameField control={form.control} disabled={pending} />
          <SignUpEmailField control={form.control} disabled={pending} />
          <SignUpPasswordField control={form.control} disabled={pending} />
          <SignUpConfirmPasswordField control={form.control} disabled={pending} />

          {serverError && (
            <p role="alert" className="text-destructive text-sm">
              {serverError}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-sm">
          Já tem uma conta?{' '}
          <Link
            href="/sign-in"
            className="hover:text-primary font-medium underline underline-offset-4"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}

export { SignUp }
