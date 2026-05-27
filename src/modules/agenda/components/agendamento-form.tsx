'use client'

import { useEffect, type JSX } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Loader2, User, CalendarDays, Dumbbell, UserCheck, CreditCard, MessageSquare } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { agendamentoSchema, type AgendamentoFormValues } from '../schemas'
import type { AgendamentoResponse } from '../types'
import { useGetAlunos } from '@/modules/alunos'
import { useGetInstrutores } from '@/modules/instrutores/hooks'
import { useGetAparelhos } from '@/modules/aparelhos'
import { useGetSessoes } from '../hooks/use-get-sessoes'

interface AgendamentoFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AgendamentoFormValues) => void
  isPending: boolean
  defaultValues?: AgendamentoResponse | null
}

export function AgendamentoForm({
  open,
  onClose,
  onSubmit,
  isPending,
  defaultValues,
}: AgendamentoFormProps): JSX.Element {
  const isEditing = !!defaultValues
  const { data: alunos } = useGetAlunos()
  const { data: instrutores } = useGetInstrutores()
  const { data: aparelhos } = useGetAparelhos()
  const { data: sessoes } = useGetSessoes()

  const form = useForm<AgendamentoFormValues>({
    defaultValues: {
      aluno_id: undefined,
      sessao_id: undefined,
      aparelho_id: undefined,
      instrutor_id: undefined,
      matricula_id: null,
      tipo_cobranca: 'MATRICULA',
      observacao: null,
    },
  })

  const {
    formState: { errors },
  } = form

  useEffect(() => {
    if (open) {
      form.reset(
        defaultValues
          ? {
              aluno_id: defaultValues.aluno_id,
              sessao_id: defaultValues.sessao_id,
              aparelho_id: defaultValues.aparelho_id,
              instrutor_id: defaultValues.instrutor_id,
              matricula_id: defaultValues.matricula_id,
              tipo_cobranca: defaultValues.tipo_cobranca,
              observacao: defaultValues.observacao,
            }
          : {
              aluno_id: undefined,
              sessao_id: undefined,
              aparelho_id: undefined,
              instrutor_id: undefined,
              matricula_id: null,
              tipo_cobranca: 'MATRICULA',
              observacao: null,
            },
      )
    }
  }, [open, defaultValues, form])

  const handleSubmit = form.handleSubmit(values => {
    const parsed = agendamentoSchema.safeParse(values)
    if (!parsed.success) {
      parsed.error.issues.forEach(issue => {
        form.setError(issue.path[0] as keyof AgendamentoFormValues, {
          message: issue.message,
        })
      })
      return
    }
    onSubmit(parsed.data)
  })

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize os dados do agendamento abaixo.'
              : 'Preencha os dados para registrar um novo agendamento.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-1">
          {/* Aluno */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <User className="size-3.5 text-muted-foreground" />
              Aluno *
            </Label>
            <Controller
              name="aluno_id"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={v => field.onChange(Number(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {alunos?.map(a => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.aluno_id && (
              <p className="text-xs text-destructive">{errors.aluno_id.message}</p>
            )}
          </div>

          {/* Sessão */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-muted-foreground" />
              Sessão *
            </Label>
            <Controller
              name="sessao_id"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={v => field.onChange(Number(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a sessão" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessoes?.map(s => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.data} — {s.hora_inicio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.sessao_id && (
              <p className="text-xs text-destructive">{errors.sessao_id.message}</p>
            )}
          </div>

          {/* Aparelho + Instrutor */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Dumbbell className="size-3.5 text-muted-foreground" />
                Aparelho *
              </Label>
              <Controller
                name="aparelho_id"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={v => field.onChange(Number(v))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {aparelhos?.map(a => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.aparelho_id && (
                <p className="text-xs text-destructive">{errors.aparelho_id.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <UserCheck className="size-3.5 text-muted-foreground" />
                Instrutor *
              </Label>
              <Controller
                name="instrutor_id"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={v => field.onChange(Number(v))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {instrutores?.map(i => (
                        <SelectItem key={i.id} value={String(i.id)}>
                          {i.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.instrutor_id && (
                <p className="text-xs text-destructive">{errors.instrutor_id.message}</p>
              )}
            </div>
          </div>

          {/* Separador visual */}
          <div className="border-t" />

          {/* Tipo de Cobrança + Observação */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tipo_cobranca" className="flex items-center gap-1.5">
                <CreditCard className="size-3.5 text-muted-foreground" />
                Cobrança
              </Label>
              <Controller
                name="tipo_cobranca"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="tipo_cobranca" className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MATRICULA">Matrícula</SelectItem>
                      <SelectItem value="AVULSO">Avulso</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="observacao" className="flex items-center gap-1.5">
                <MessageSquare className="size-3.5 text-muted-foreground" />
                Observação
              </Label>
              <Input
                id="observacao"
                placeholder="Opcional"
                {...form.register('observacao')}
              />
            </div>
          </div>

          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Salvar alterações' : 'Criar agendamento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
