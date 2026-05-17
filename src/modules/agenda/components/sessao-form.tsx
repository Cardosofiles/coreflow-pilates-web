'use client'

import { useEffect, type JSX } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { sessaoSchema, type SessaoFormValues } from '../schemas'

interface SessaoFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: SessaoFormValues) => void
  isPending: boolean
}

export function SessaoForm({ open, onClose, onSubmit, isPending }: SessaoFormProps): JSX.Element {
  const form = useForm<SessaoFormValues>({
    defaultValues: { data: '', hora_inicio: '', hora_fim: '', capacidade_maxima: 6 },
  })

  const { formState: { errors } } = form

  useEffect(() => {
    if (open) form.reset({ data: '', hora_inicio: '', hora_fim: '', capacidade_maxima: 6 })
  }, [open, form])

  const handleSubmit = form.handleSubmit(values => {
    const parsed = sessaoSchema.safeParse(values)
    if (!parsed.success) {
      parsed.error.issues.forEach(issue => {
        form.setError(issue.path[0] as keyof SessaoFormValues, {
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
          <DialogTitle>Nova Sessão</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="data">Data</Label>
            <Input id="data" type="date" {...form.register('data')} />
            {errors.data && <p className="text-xs text-destructive">{errors.data.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="hora_inicio">Início</Label>
              <Input id="hora_inicio" type="time" {...form.register('hora_inicio')} />
              {errors.hora_inicio && (
                <p className="text-xs text-destructive">{errors.hora_inicio.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="hora_fim">Fim</Label>
              <Input id="hora_fim" type="time" {...form.register('hora_fim')} />
              {errors.hora_fim && (
                <p className="text-xs text-destructive">{errors.hora_fim.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="capacidade_maxima">Capacidade máxima</Label>
            <Input
              id="capacidade_maxima"
              type="number"
              min={1}
              {...form.register('capacidade_maxima', { valueAsNumber: true })}
            />
            {errors.capacidade_maxima && (
              <p className="text-xs text-destructive">{errors.capacidade_maxima.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar sessão
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
