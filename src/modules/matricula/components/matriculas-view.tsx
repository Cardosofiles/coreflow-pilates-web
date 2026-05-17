

'use client'

import { useMemo, useState, type JSX } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { differenceInDays, parseISO } from 'date-fns'

import { DataTable, StatusBadge, ConfirmDialog, FormModal } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getApiErrorMessage } from '@/lib/api-error'
import { useGetAlunos } from '@/modules/alunos'
import { useGetPlanos } from '@/modules/planos'

import { useGetMatriculas } from '../hooks/use-get-matriculas'
import { useDeleteMatricula } from '../hooks/use-delete-matricula'
import type { MatriculaResponse } from '../types/matricula.types'
import { MatriculaForm } from './matricula-form'

const AULAS_LABEL: Record<number, string> = {
  1: '1x/semana',
  2: '2x/semana',
  3: '3x/semana',
}

function getVencimentoInfo(dataFim: string): { label: string; isUrgent: boolean; daysLeft: number } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const fim = parseISO(dataFim)
  const daysLeft = differenceInDays(fim, today)
  const label = fim.toLocaleDateString('pt-BR')
  return { label, isUrgent: daysLeft <= 7 && daysLeft >= 0, daysLeft }
}

const MatriculasSkeleton = (): JSX.Element => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-9 w-40" />
    </div>
    <Skeleton className="h-9 w-72" />
    <div className="rounded-md border">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex gap-6 border-b px-4 py-3 last:border-0">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  </div>
)

const MatriculasView = (): JSX.Element => {
  const { data: matriculas = [], isLoading } = useGetMatriculas()
  const { data: alunos = [] } = useGetAlunos()
  const { data: planos = [] } = useGetPlanos()
  const { mutate: deleteMatricula, isPending: isDeleting } = useDeleteMatricula()

  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<MatriculaResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MatriculaResponse | null>(null)

  const alunoMap = useMemo(() => new Map(alunos.map(a => [a.id, a])), [alunos])
  const planoMap = useMemo(() => new Map(planos.map(p => [p.id, p])), [planos])

  const vencendoCount = useMemo(
    () =>
      matriculas.filter(m => {
        const { isUrgent } = getVencimentoInfo(m.data_fim)
        return isUrgent && m.status === 'ATIVA'
      }).length,
    [matriculas],
  )

  const handleDelete = () => {
    if (!deleteTarget) return
    const aluno = alunoMap.get(deleteTarget.aluno_id)
    deleteMatricula(deleteTarget.id, {
      onSuccess: () => {
        toast.success(`Matrícula de "${aluno?.nome ?? 'aluno'}" removida.`)
        setDeleteTarget(null)
      },
      onError: err => {
        toast.error(getApiErrorMessage(err, 'Erro ao remover matrícula.'))
        setDeleteTarget(null)
      },
    })
  }

  const columns = useMemo<ColumnDef<MatriculaResponse>[]>(
    () => [
      {
        id: 'aluno',
        header: 'Aluno',
        cell: ({ row }) => {
          const aluno = alunoMap.get(row.original.aluno_id)
          if (!aluno) return <span className="text-muted-foreground">—</span>
          const initials = aluno.nome
            .split(' ')
            .slice(0, 2)
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
          return (
            <div className="flex items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                {initials}
              </span>
              <span className="font-medium">{aluno.nome}</span>
            </div>
          )
        },
      },
      {
        id: 'modalidade',
        header: 'Modalidade',
        cell: ({ row }) => (
          <Badge variant="outline" className="text-xs">
            {AULAS_LABEL[row.original.aulas_por_semana_contratadas] ?? '—'}
          </Badge>
        ),
      },
      {
        id: 'plano',
        header: 'Plano',
        cell: ({ row }) => {
          const plano = planoMap.get(row.original.plano_id)
          return <span>{plano?.nome ?? '—'}</span>
        },
      },
      {
        id: 'inicio',
        header: 'Início',
        cell: ({ row }) =>
          new Date(row.original.data_inicio + 'T00:00:00').toLocaleDateString('pt-BR'),
      },
      {
        id: 'vencimento',
        header: 'Vencimento',
        cell: ({ row }) => {
          const { label, isUrgent, daysLeft } = getVencimentoInfo(row.original.data_fim)
          return (
            <span className={isUrgent ? 'font-medium text-orange-500' : ''}>
              {label}
              {isUrgent && <span className="ml-1 text-xs">({daysLeft}d)</span>}
            </span>
          )
        },
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const m = row.original
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditTarget(m)}>
                    <Pencil className="mr-2 size-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleteTarget(m)}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ],
    [alunoMap, planoMap],
  )

  if (isLoading) return <MatriculasSkeleton />

  return (
    <>
      {vencendoCount > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-md bg-destructive/90 px-4 py-2.5 text-sm text-white">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0" />
            <span>
              <strong>{vencendoCount} plano{vencendoCount > 1 ? 's' : ''}</strong>{' '}
              vence{vencendoCount > 1 ? 'm' : ''} em menos de 7 dias.
            </span>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Matrículas</h1>
          <p className="text-muted-foreground text-sm">
            Vincule alunos a modalidades, planos e instrutores
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Nova Matrícula
        </Button>
      </div>

      <DataTable
        data={matriculas}
        columns={columns}
        searchKey="aluno_id"
        searchPlaceholder="Buscar aluno ou instrutor..."
      />

      <FormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Nova Matrícula"
        description="Vincule um aluno a modalidade, plano e instrutor"
      >
        <MatriculaForm mode="create" onSuccess={() => setCreateOpen(false)} />
      </FormModal>

      <FormModal
        open={!!editTarget}
        onOpenChange={open => !open && setEditTarget(null)}
        title="Editar Matrícula"
        description={`Aluno: ${alunoMap.get(editTarget?.aluno_id ?? 0)?.nome ?? ''}`}
      >
        <MatriculaForm
          key={editTarget?.id}
          mode="edit"
          matricula={editTarget ?? undefined}
          onSuccess={() => setEditTarget(null)}
        />
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={open => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Excluir matrícula"
        description={`Tem certeza que deseja excluir a matrícula de "${alunoMap.get(deleteTarget?.aluno_id ?? 0)?.nome ?? 'aluno'}"?`}
        confirmLabel="Excluir"
      />
    </>
  )
}

export { MatriculasView }
