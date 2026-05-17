'use client'

import { useState, type JSX } from 'react'
import { MoreHorizontal, Pencil, Trash2, Check } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FormModal } from '@/components/common'
import { ConfirmDialog } from '@/components/common'
import { getApiErrorMessage } from '@/lib/api-error'

import { useDeletePlano } from '../hooks/use-delete-plano'
import type { PlanoResponse, DuracaoMeses, AulasPorSemana } from '../types/plano.types'
import { PlanoForm } from './plano-form'

const DURACAO_LABEL: Record<DuracaoMeses, string> = {
  1: '30 dias',
  2: '60 dias',
  3: '90 dias',
  6: '180 dias',
  12: '365 dias',
}

const AULAS_LABEL: Record<AulasPorSemana, string> = {
  1: '1x/semana',
  2: '2x/semana',
  3: '3x/semana',
}

interface PlanoCardProps {
  plano: PlanoResponse
}

const PlanoCard = ({ plano }: PlanoCardProps): JSX.Element => {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { mutate: deletePlano, isPending: isDeleting } = useDeletePlano()

  const beneficios = plano.descricao
    ? plano.descricao.split('\n').filter(b => b.trim().length > 0)
    : []

  const handleDelete = () => {
    deletePlano(plano.id, {
      onSuccess: () => {
        toast.success(`Plano "${plano.nome}" removido.`)
        setDeleteOpen(false)
      },
      onError: err => {
        toast.error(getApiErrorMessage(err, 'Erro ao remover plano.'))
        setDeleteOpen(false)
      },
    })
  }

  return (
    <>
      <div className="bg-card text-card-foreground flex flex-col rounded-lg border p-5 shadow-sm">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold">{plano.nome}</span>
            <Badge variant="outline" className="text-xs">
              {DURACAO_LABEL[plano.duracao_meses]}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-2 size-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-primary mb-3 text-2xl font-bold">
          R${' '}
          {Number(plano.valor_mensal).toLocaleString('pt-BR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
          <span className="text-muted-foreground ml-1 text-sm font-normal">
            /{DURACAO_LABEL[plano.duracao_meses]}
          </span>
        </p>

        <div className="mb-4 flex-1 space-y-1.5">
          <div className="flex items-center gap-1.5 text-sm">
            <Check className="text-primary size-3.5 shrink-0" />
            <span>{AULAS_LABEL[plano.aulas_por_semana]}</span>
          </div>
          {beneficios.map((b, i) => (
            <div key={i} className="flex items-center gap-1.5 text-sm">
              <Check className="text-primary size-3.5 shrink-0" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="mr-2 size-3.5" />
          Gerenciar
        </Button>
      </div>

      <FormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Editar Plano"
        description={plano.nome}
      >
        <PlanoForm mode="edit" plano={plano} onSuccess={() => setEditOpen(false)} />
      </FormModal>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Excluir plano"
        description={`Tem certeza que deseja excluir "${plano.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
      />
    </>
  )
}

export { PlanoCard }
