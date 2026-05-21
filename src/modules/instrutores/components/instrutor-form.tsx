'use client'

import { type JSX } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { getApiErrorMessage } from '@/lib/api-error'

import { useCreateInstrutor } from '../hooks/use-create-instrutor'
import { useUpdateInstrutor } from '../hooks/use-update-instrutor'
import type { InstrutorCreate, InstrutorUpdate, InstrutorResponse } from '../types/instrutor.types'

const formSchema = z.object({
  nome: z.string().min(3, 'Mínimo 3 caracteres').max(120),
  email: z.string().min(1, 'Email obrigatório'),
  senha: z.string().max(128),
  telefone: z.string().max(20),
  especialidade: z.string().max(100),
  ativo: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  mode: 'create' | 'edit'
  instrutor?: InstrutorResponse
  onSuccess?: () => void
}

const InstrutorForm = ({ mode, instrutor, onSuccess }: Props): JSX.Element => {
  const isEdit = mode === 'edit'
  const { mutate: createInstrutor, isPending: isCreating } = useCreateInstrutor()
  const { mutate: updateInstrutor, isPending: isUpdating } = useUpdateInstrutor(instrutor?.id ?? 0)
  const isPending = isCreating || isUpdating

  const form = useForm<FormValues>({
    defaultValues: {
      nome: instrutor?.nome ?? '',
      email: instrutor?.email ?? '',
      senha: '',
      telefone: instrutor?.telefone ?? '',
      especialidade: instrutor?.especialidade ?? '',
      ativo: instrutor?.ativo ?? true,
    },
  })

  const handleSubmit = form.handleSubmit(values => {
    const parsed = formSchema.safeParse(values)
    if (!parsed.success) {
      parsed.error.issues.forEach(issue => {
        form.setError(issue.path[0] as keyof FormValues, { message: issue.message })
      })
      return
    }

    if (!isEdit && parsed.data.senha.length < 6) {
      form.setError('senha', { message: 'Mínimo 6 caracteres' })
      return
    }

    const toNullable = (v: string) => v.trim() || null

    if (isEdit) {
      const payload: InstrutorUpdate = {
        nome: parsed.data.nome,
        email: parsed.data.email,
        telefone: toNullable(parsed.data.telefone),
        especialidade: toNullable(parsed.data.especialidade),
        ativo: parsed.data.ativo,
      }
      if (parsed.data.senha) payload.senha = parsed.data.senha

      updateInstrutor(payload, {
        onSuccess: () => {
          toast.success('Instrutor atualizado com sucesso.')
          onSuccess?.()
        },
        onError: err => toast.error(getApiErrorMessage(err, 'Erro ao atualizar instrutor.')),
      })
    } else {
      const payload: InstrutorCreate = {
        nome: parsed.data.nome,
        email: parsed.data.email,
        senha: parsed.data.senha,
        telefone: toNullable(parsed.data.telefone),
        especialidade: toNullable(parsed.data.especialidade),
        ativo: parsed.data.ativo,
      }

      createInstrutor(payload, {
        onSuccess: () => {
          toast.success('Instrutor cadastrado com sucesso.')
          form.reset()
          onSuccess?.()
        },
        onError: err => toast.error(getApiErrorMessage(err, 'Erro ao cadastrar instrutor.')),
      })
    }
  })

  const err = form.formState.errors

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="nome">Nome *</Label>
        <Input id="nome" {...form.register('nome')} disabled={isPending} />
        {err.nome && <p className="text-destructive text-sm">{err.nome.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" {...form.register('email')} disabled={isPending} />
        {err.email && <p className="text-destructive text-sm">{err.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="senha">{isEdit ? 'Nova Senha' : 'Senha *'}</Label>
        <Input
          id="senha"
          type="password"
          placeholder={isEdit ? 'Deixe em branco para não alterar' : 'Mínimo 6 caracteres'}
          {...form.register('senha')}
          disabled={isPending}
        />
        {err.senha && <p className="text-destructive text-sm">{err.senha.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" {...form.register('telefone')} disabled={isPending} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="especialidade">Especialidade</Label>
          <Input id="especialidade" {...form.register('especialidade')} disabled={isPending} />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label htmlFor="ativo" className="cursor-pointer font-medium">
            Ativo
          </Label>
          <p className="text-muted-foreground text-xs">
            Instrutores inativos não aparecem nas seleções
          </p>
        </div>
        <Controller
          name="ativo"
          control={form.control}
          render={({ field }) => (
            <Switch
              id="ativo"
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isPending}
            />
          )}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Cadastrar instrutor'}
        </Button>
      </div>
    </form>
  )
}

export { InstrutorForm }
