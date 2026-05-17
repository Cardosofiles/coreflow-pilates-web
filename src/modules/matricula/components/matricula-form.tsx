'use client'

import { useState, type JSX } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getApiErrorMessage } from '@/lib/api-error'
import { useGetAlunos } from '@/modules/alunos'
import { useGetPlanos, type DuracaoMeses } from '@/modules/planos'

import { useCreateMatricula } from '../hooks/use-create-matricula'
import { useUpdateMatricula } from '../hooks/use-update-matricula'
import type { MatriculaResponse, StatusMatricula } from '../types/matricula.types'

const formSchema = z.object({
  aluno_id: z.string().min(1, 'Selecione um aluno'),
  data_inicio: z.string().min(1, 'Informe a data de início'),
  status: z.enum(['PENDENTE_PAGAMENTO', 'ATIVA', 'DESATIVADA']),
})

type FormValues = z.infer<typeof formSchema>

const AULAS_LABEL: Record<number, string> = {
  1: '1x/semana',
  2: '2x/semana',
  3: '3x/semana',
}

const DURACAO_LABEL: Record<number, string> = {
  1: '30 dias',
  2: '60 dias',
  3: '90 dias',
  6: '180 dias',
  12: '365 dias',
}

const STATUS_OPTIONS: { value: StatusMatricula; label: string }[] = [
  { value: 'PENDENTE_PAGAMENTO', label: 'Pendente de Pagamento' },
  { value: 'ATIVA', label: 'Ativa' },
  { value: 'DESATIVADA', label: 'Desativada' },
]

function getInitials(nome: string): string {
  return nome
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

interface MatriculaFormProps {
  mode?: 'create' | 'edit'
  matricula?: MatriculaResponse
  defaultAlunoId?: number
  onSuccess: () => void
}

const MatriculaForm = ({
  mode = 'create',
  matricula,
  defaultAlunoId,
  onSuccess,
}: MatriculaFormProps): JSX.Element => {
  const { data: alunos = [] } = useGetAlunos()
  const { data: planos = [] } = useGetPlanos()
  const { mutate: createMatricula, isPending: isCreating } = useCreateMatricula()
  const { mutate: updateMatricula, isPending: isUpdating } = useUpdateMatricula()
  const isPending = isCreating || isUpdating

  const [selectedPlanoId, setSelectedPlanoId] = useState<number | null>(
    matricula?.plano_id ?? null,
  )
  const [planoError, setPlanoError] = useState('')

  const form = useForm<FormValues>({
    defaultValues:
      mode === 'edit' && matricula
        ? {
            aluno_id: String(matricula.aluno_id),
            data_inicio: matricula.data_inicio,
            status: matricula.status,
          }
        : {
            aluno_id: defaultAlunoId ? String(defaultAlunoId) : '',
            data_inicio: '',
            status: 'PENDENTE_PAGAMENTO',
          },
  })

  const err = form.formState.errors
  const selectedPlano = planos.find(p => p.id === selectedPlanoId)

  const handleSubmit = form.handleSubmit(values => {
    const parsed = formSchema.safeParse(values)
    if (!parsed.success) {
      parsed.error.issues.forEach(issue => {
        form.setError(issue.path[0] as keyof FormValues, { message: issue.message })
      })
      return
    }

    if (!selectedPlanoId) {
      setPlanoError('Selecione um plano')
      return
    }
    setPlanoError('')

    if (mode === 'create') {
      createMatricula(
        {
          aluno_id: Number(parsed.data.aluno_id),
          plano_id: selectedPlanoId,
          data_inicio: parsed.data.data_inicio,
          status: parsed.data.status,
        },
        {
          onSuccess: () => {
            toast.success('Matrícula criada com sucesso!')
            onSuccess()
          },
          onError: err => toast.error(getApiErrorMessage(err, 'Erro ao criar matrícula.')),
        },
      )
    } else if (matricula) {
      updateMatricula(
        {
          id: matricula.id,
          data: {
            plano_id: selectedPlanoId,
            data_inicio: parsed.data.data_inicio,
            status: parsed.data.status,
          },
        },
        {
          onSuccess: () => {
            toast.success('Matrícula atualizada com sucesso!')
            onSuccess()
          },
          onError: err => toast.error(getApiErrorMessage(err, 'Erro ao atualizar matrícula.')),
        },
      )
    }
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Aluno
        </Label>
        <Controller
          name="aluno_id"
          control={form.control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={mode === 'edit'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha um aluno..." />
              </SelectTrigger>
              <SelectContent>
                {alunos.map(aluno => (
                  <SelectItem key={aluno.id} value={String(aluno.id)}>
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {getInitials(aluno.nome)}
                      </span>
                      {aluno.nome}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {err.aluno_id && <p className="text-destructive text-xs">{err.aluno_id.message}</p>}
      </div>

      {selectedPlano && (
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Informações do Plano
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-sm">Frequência</Label>
              <div className="bg-muted/40 rounded-md border px-3 py-2 text-sm text-muted-foreground">
                {AULAS_LABEL[selectedPlano.aulas_por_semana]}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Duração</Label>
              <div className="bg-muted/40 rounded-md border px-3 py-2 text-sm text-muted-foreground">
                {DURACAO_LABEL[selectedPlano.duracao_meses]}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Plano *
        </Label>
        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {planos.map(plano => (
            <button
              key={plano.id}
              type="button"
              onClick={() => {
                setSelectedPlanoId(plano.id)
                setPlanoError('')
              }}
              className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-sm transition-colors ${
                selectedPlanoId === plano.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-2 text-left">
                {selectedPlanoId === plano.id && (
                  <Check className="size-4 shrink-0 text-primary" />
                )}
                <div>
                  <p className="font-medium">{plano.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {DURACAO_LABEL[plano.duracao_meses as DuracaoMeses]}
                  </p>
                </div>
              </div>
              <span className="font-semibold">
                R${' '}
                {Number(plano.valor_mensal).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                <span className="font-normal text-muted-foreground">
                  /{DURACAO_LABEL[plano.duracao_meses as DuracaoMeses]}
                </span>
              </span>
            </button>
          ))}
        </div>
        {planoError && <p className="text-destructive text-xs">{planoError}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="data_inicio">Data de início *</Label>
        <Input id="data_inicio" type="date" {...form.register('data_inicio')} />
        {err.data_inicio && (
          <p className="text-destructive text-xs">{err.data_inicio.message}</p>
        )}
      </div>

      {mode === 'edit' && (
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? mode === 'create'
              ? 'Salvando...'
              : 'Atualizando...'
            : mode === 'create'
              ? 'Salvar Matrícula'
              : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  )
}

export { MatriculaForm }
