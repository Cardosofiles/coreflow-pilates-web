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
import { formatPhoneBR } from '@/lib/masks'

import { useCreateAluno } from '../hooks/use-create-aluno'
import { useUpdateAluno } from '../hooks/use-update-aluno'
import type { AlunoCreate, AlunoUpdate, AlunoResponse } from '../types/aluno.types'

const formSchema = z.object({
  nome: z.string().min(3, 'Mínimo 3 caracteres').max(120),
  email: z.string().min(1, 'Email obrigatório'),
  senha: z.string().max(128),
  telefone: z.string().max(20),
  data_nascimento: z.string(),
  ativo: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface Props {
  mode: 'create' | 'edit'
  aluno?: AlunoResponse
  onSuccess?: () => void
}

const AlunoForm = ({ mode, aluno, onSuccess }: Props): JSX.Element => {
  const isEdit = mode === 'edit'
  const { mutate: createAluno, isPending: isCreating } = useCreateAluno()
  const { mutate: updateAluno, isPending: isUpdating } = useUpdateAluno(aluno?.id ?? 0)
  const isPending = isCreating || isUpdating

  const form = useForm<FormValues>({
    defaultValues: {
      nome: aluno?.nome ?? '',
      email: aluno?.email ?? '',
      senha: '',
      telefone: aluno?.telefone ?? '',
      data_nascimento: aluno?.data_nascimento ?? '',
      ativo: aluno?.ativo ?? true,
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
      const payload: AlunoUpdate = {
        nome: parsed.data.nome,
        email: parsed.data.email,
        telefone: toNullable(parsed.data.telefone),
        data_nascimento: toNullable(parsed.data.data_nascimento),
        ativo: parsed.data.ativo,
      }
      if (parsed.data.senha) payload.senha = parsed.data.senha

      updateAluno(payload, {
        onSuccess: () => {
          toast.success('Aluno atualizado com sucesso.')
          onSuccess?.()
        },
        onError: err => toast.error(getApiErrorMessage(err, 'Erro ao atualizar aluno.')),
      })
    } else {
      const payload: AlunoCreate = {
        nome: parsed.data.nome,
        email: parsed.data.email,
        senha: parsed.data.senha,
        telefone: toNullable(parsed.data.telefone),
        data_nascimento: toNullable(parsed.data.data_nascimento),
        ativo: parsed.data.ativo,
      }

      createAluno(payload, {
        onSuccess: () => {
          toast.success('Aluno cadastrado com sucesso.')
          form.reset()
          onSuccess?.()
        },
        onError: err => toast.error(getApiErrorMessage(err, 'Erro ao cadastrar aluno.')),
      })
    }
  })

  const err = form.formState.errors

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="nome">Nome *</Label>
        <Input
          id="nome"
          placeholder="Nome completo do aluno"
          autoComplete="name"
          {...form.register('nome')}
          disabled={isPending}
        />
        {err.nome && <p className="text-destructive text-sm">{err.nome.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="exemplo@email.com"
          autoComplete="email"
          {...form.register('email')}
          disabled={isPending}
        />
        {err.email && <p className="text-destructive text-sm">{err.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="senha">{isEdit ? 'Nova Senha' : 'Senha *'}</Label>
        <Input
          id="senha"
          type="password"
          placeholder={isEdit ? 'Deixe em branco para não alterar' : 'Mínimo 6 caracteres'}
          autoComplete={isEdit ? 'new-password' : 'new-password'}
          {...form.register('senha')}
          disabled={isPending}
        />
        {err.senha && <p className="text-destructive text-sm">{err.senha.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="telefone">Telefone</Label>
          <Controller
            name="telefone"
            control={form.control}
            render={({ field }) => (
              <Input
                id="telefone"
                type="tel"
                placeholder="(00) 00000-0000"
                autoComplete="tel"
                value={field.value}
                onChange={e => field.onChange(formatPhoneBR(e.target.value))}
                disabled={isPending}
              />
            )}
          />
          {err.telefone && <p className="text-destructive text-sm">{err.telefone.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="data_nascimento">Data de Nascimento</Label>
          <Input
            id="data_nascimento"
            type="date"
            {...form.register('data_nascimento')}
            disabled={isPending}
          />
          {err.data_nascimento && (
            <p className="text-destructive text-sm">{err.data_nascimento.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label htmlFor="ativo" className="cursor-pointer font-medium">
            Ativo
          </Label>
          <p className="text-muted-foreground text-xs">
            Alunos inativos não conseguem agendar sessões
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
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Cadastrar aluno'}
        </Button>
      </div>
    </form>
  )
}

export { AlunoForm }
