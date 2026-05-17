'use client'

import { useEffect, type JSX } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { agendamentoSchema, type AgendamentoFormValues } from '../schemas'
import type { Agendamento } from '../types'

interface AgendamentoFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AgendamentoFormValues) => void
  isPending: boolean
  defaultValues?: Agendamento | null
}

export function AgendamentoForm({
  open,
  onClose,
  onSubmit,
  isPending,
  defaultValues,
}: AgendamentoFormProps): JSX.Element {
  const isEditing = !!defaultValues

  const form = useForm<AgendamentoFormValues>({
    defaultValues: { nome: '', descricao: '', ativo: true },
  })

  const { formState: { errors } } = form
  const ativo = form.watch('ativo')

  useEffect(() => {
    if (open) {
      form.reset(
        defaultValues
          ? { nome: defaultValues.nome, descricao: defaultValues.descricao, ativo: defaultValues.ativo }
          : { nome: '', descricao: '', ativo: true },
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" placeholder="Nome do agendamento" {...form.register('nome')} />
            {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="descricao">Descrição</Label>
            <Input id="descricao" placeholder="Descrição" {...form.register('descricao')} />
            {errors.descricao && (
              <p className="text-xs text-destructive">{errors.descricao.message}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Controller
              name="ativo"
              control={form.control}
              render={({ field }) => (
                <Switch
                  id="ativo"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="ativo">{ativo ? 'Ativo' : 'Inativo'}</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
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
