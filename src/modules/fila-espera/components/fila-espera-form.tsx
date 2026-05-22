'use client'

import { type JSX } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getApiErrorMessage } from '@/lib/api-error'

import { useCreateFilaEspera } from '@/modules/fila-espera/hooks/use-create-fila-espera'
import { filaEsperaCreateSchema } from '@/modules/fila-espera/schemas/fila-espera-schema'
import { z } from 'zod'

type FormValues = z.infer<typeof filaEsperaCreateSchema>

interface Props {
  onSuccess?: () => void
}

const FilaEsperaForm = ({ onSuccess }: Props): JSX.Element => {
  const { mutate: createFilaEspera, isPending } = useCreateFilaEspera()

  const form = useForm<FormValues>({
    defaultValues: {
      aluno_id: 0,
      sessao_id: 0,
    },
  })

  const handleSubmit = form.handleSubmit(values => {
    const parsed = filaEsperaCreateSchema.safeParse(values)
    if (!parsed.success) {
      parsed.error.issues.forEach(issue => {
        form.setError(issue.path[0] as keyof FormValues, { message: issue.message })
      })
      return
    }

    createFilaEspera(parsed.data, {
      onSuccess: () => {
        toast.success('Adicionado à fila de espera com sucesso.')
        form.reset()
        onSuccess?.()
      },
      onError: err => toast.error(getApiErrorMessage(err, 'Erro ao adicionar à fila de espera.')),
    })
  })

  const err = form.formState.errors

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="aluno_id">ID do Aluno *</Label>
        <Input
          id="aluno_id"
          type="number"
          {...form.register('aluno_id', { valueAsNumber: true })}
          disabled={isPending}
        />
        {err.aluno_id && <p className="text-destructive text-sm">{err.aluno_id.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sessao_id">ID da Sessão *</Label>
        <Input
          id="sessao_id"
          type="number"
          {...form.register('sessao_id', { valueAsNumber: true })}
          disabled={isPending}
        />
        {err.sessao_id && <p className="text-destructive text-sm">{err.sessao_id.message}</p>}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Salvando...' : 'Adicionar à Fila'}
        </Button>
      </div>
    </form>
  )
}

export { FilaEsperaForm }
