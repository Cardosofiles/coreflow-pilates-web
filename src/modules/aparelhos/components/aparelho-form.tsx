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

import { aparelhoSchema, type AparelhoFormValues } from '../schemas/aparelho.schema'
import type { AparelhoResponse } from '../types/aparelho.types'

interface AparelhoFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AparelhoFormValues) => void
  isPending: boolean
  defaultValues?: AparelhoResponse | null
}

export function AparelhoForm({
  open,
  onClose,
  onSubmit,
  isPending,
  defaultValues,
}: AparelhoFormProps): JSX.Element {
  const isEditing = !!defaultValues

  const form = useForm<AparelhoFormValues>({
    defaultValues: { nome: '', descricao: null, ativo: true },
  })

  const { formState: { errors } } = form
  const ativo = form.watch('ativo')

  useEffect(() => {
    if (open) {
      form.reset(
        defaultValues
          ? { nome: defaultValues.nome, descricao: defaultValues.descricao, ativo: defaultValues.ativo }
          : { nome: '', descricao: null, ativo: true },
      )
    }
  }, [open, defaultValues, form])

  const handleSubmit = form.handleSubmit(values => {
    const parsed = aparelhoSchema.safeParse(values)
    if (!parsed.success) {
      parsed.error.issues.forEach(issue => {
        form.setError(issue.path[0] as keyof AparelhoFormValues, { message: issue.message })
      })
      return
    }
    onSubmit(parsed.data)
  })

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Aparelho' : 'Novo Aparelho'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="nome">Nome *</Label>
            <Input id="nome" placeholder="Ex: Reformer, Cadillac…" {...form.register('nome')} />
            {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              placeholder="Descrição opcional do aparelho"
              {...form.register('descricao')}
            />
            {errors.descricao && (
              <p className="text-xs text-destructive">{errors.descricao.message}</p>
            )}
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="ativo" className="cursor-pointer font-medium">
                {ativo ? 'Ativo' : 'Inativo'}
              </Label>
              <p className="text-muted-foreground text-xs">
                Aparelhos inativos não aparecem nos agendamentos
              </p>
            </div>
            <Controller
              name="ativo"
              control={form.control}
              render={({ field }) => (
                <Switch id="ativo" checked={field.value ?? true} onCheckedChange={field.onChange} />
              )}
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Salvar alterações' : 'Criar aparelho'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
