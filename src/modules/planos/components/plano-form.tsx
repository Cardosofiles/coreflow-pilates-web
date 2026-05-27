'use client'

import { useEffect, type JSX } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getApiErrorMessage } from '@/lib/api-error'

import { useCreatePlano } from '../hooks/use-create-plano'
import { useUpdatePlano } from '../hooks/use-update-plano'
import type { PlanoResponse, AulasPorSemana, DuracaoMeses } from '../types/plano.types'

const formSchema = z.object({
  nome: z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
  descricao: z.string().max(500).optional().nullable(),
  valor_mensal: z.string().min(1, 'Informe o valor'),
  aulas_por_semana: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  duracao_meses: z
    .union([z.literal(1), z.literal(2), z.literal(3), z.literal(6), z.literal(12)])
    .optional(),
  ativo: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

const DURACAO_OPTIONS: { value: DuracaoMeses; label: string }[] = [
  { value: 1, label: '30 dias' },
  { value: 2, label: '60 dias' },
  { value: 3, label: '90 dias' },
  { value: 6, label: '180 dias' },
  { value: 12, label: '365 dias' },
]

const AULAS_OPTIONS: { value: AulasPorSemana; label: string }[] = [
  { value: 1, label: '1x/semana' },
  { value: 2, label: '2x/semana' },
  { value: 3, label: '3x/semana' },
]

interface PlanoFormProps {
  mode: 'create' | 'edit'
  plano?: PlanoResponse
  onSuccess: () => void
}

const PlanoForm = ({ mode, plano, onSuccess }: PlanoFormProps): JSX.Element => {
  const { mutate: createPlano, isPending: isCreating } = useCreatePlano()
  const { mutate: updatePlano, isPending: isUpdating } = useUpdatePlano()
  const isPending = isCreating || isUpdating

  const form = useForm<FormValues>({
    defaultValues:
      mode === 'edit' && plano
        ? {
            nome: plano.nome,
            descricao: plano.descricao ?? '',
            valor_mensal: String(plano.valor_mensal),
            aulas_por_semana: plano.aulas_por_semana,
            duracao_meses: plano.duracao_meses,
            ativo: plano.ativo,
          }
        : { ativo: true, valor_mensal: '' },
  })

  useEffect(() => {
    if (mode === 'edit' && plano) {
      form.reset({
        nome: plano.nome,
        descricao: plano.descricao ?? '',
        valor_mensal: String(plano.valor_mensal),
        aulas_por_semana: plano.aulas_por_semana,
        duracao_meses: plano.duracao_meses,
        ativo: plano.ativo,
      })
    }
  }, [plano, mode, form])

  const err = form.formState.errors

  const handleSubmit = form.handleSubmit(values => {
    const parsed = formSchema.safeParse(values)
    if (!parsed.success) {
      parsed.error.issues.forEach(issue => {
        form.setError(issue.path[0] as keyof FormValues, { message: issue.message })
      })
      return
    }

    const valorNumerico = parseFloat(parsed.data.valor_mensal.replace(',', '.'))
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      form.setError('valor_mensal', { message: 'Informe um valor válido' })
      return
    }

    if (!parsed.data.aulas_por_semana) {
      form.setError('aulas_por_semana', { message: 'Selecione a modalidade' })
      return
    }

    if (!parsed.data.duracao_meses) {
      form.setError('duracao_meses', { message: 'Selecione a duração' })
      return
    }

    const payload = {
      nome: parsed.data.nome,
      descricao: parsed.data.descricao || null,
      valor_mensal: valorNumerico,
      aulas_por_semana: parsed.data.aulas_por_semana,
      duracao_meses: parsed.data.duracao_meses,
      ativo: parsed.data.ativo,
    }

    if (mode === 'create') {
      createPlano(payload, {
        onSuccess: () => {
          toast.success('Plano criado com sucesso!')
          onSuccess()
        },
        onError: err => toast.error(getApiErrorMessage(err, 'Erro ao criar plano.')),
      })
    } else if (plano) {
      updatePlano(
        { id: plano.id, data: payload },
        {
          onSuccess: () => {
            toast.success('Plano atualizado com sucesso!')
            onSuccess()
          },
          onError: err => toast.error(getApiErrorMessage(err, 'Erro ao atualizar plano.')),
        },
      )
    }
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nome">Nome do Plano *</Label>
          <Input id="nome" placeholder="Ex: Plano Mensal" {...form.register('nome')} />
          {err.nome && <p className="text-destructive text-xs">{err.nome.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="valor_mensal">Valor Mensal (R$) *</Label>
          <div className="relative">
            <span className="text-muted-foreground absolute inset-y-0 left-3 flex items-center text-sm select-none">
              R$
            </span>
            <Input
              id="valor_mensal"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              className="pl-9"
              {...form.register('valor_mensal')}
            />
          </div>
          {err.valor_mensal && (
            <p className="text-destructive text-xs">{err.valor_mensal.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Duração *</Label>
          <Controller
            name="duracao_meses"
            control={form.control}
            render={({ field }) => (
              <Select
                onValueChange={val => field.onChange(Number(val) as DuracaoMeses)}
                value={field.value !== undefined ? String(field.value) : ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a duração" />
                </SelectTrigger>
                <SelectContent>
                  {DURACAO_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {err.duracao_meses && (
            <p className="text-destructive text-xs">{err.duracao_meses.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Modalidades *</Label>
          <Controller
            name="aulas_por_semana"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {AULAS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                      field.value === opt.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          />
          {err.aulas_por_semana && (
            <p className="text-destructive text-xs">{err.aulas_por_semana.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="descricao">Benefícios</Label>
        <textarea
          id="descricao"
          rows={4}
          placeholder={`Um benefício por linha.\nEx:\nAcesso ilimitado ao estúdio\nAvaliação postural`}
          className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full resize-none rounded-md border px-3 py-2 text-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          {...form.register('descricao')}
        />
        <p className="text-muted-foreground text-xs">Insira um benefício por linha.</p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? mode === 'create'
              ? 'Salvando...'
              : 'Atualizando...'
            : mode === 'create'
              ? 'Salvar Plano'
              : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  )
}

export { PlanoForm }
