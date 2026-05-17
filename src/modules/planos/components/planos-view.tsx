'use client'

import { useState, type JSX } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FormModal } from '@/components/common'

import { useGetPlanos } from '../hooks/use-get-planos'
import { PlanoCard } from './plano-card'
import { PlanoForm } from './plano-form'

const PlanosGridSkeleton = (): JSX.Element => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="rounded-lg border p-5 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-8 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
    ))}
  </div>
)

const PlanosView = (): JSX.Element => {
  const { data: planos = [], isLoading } = useGetPlanos()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Planos</h1>
          <p className="text-muted-foreground text-sm">Gerencie os planos disponíveis</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Novo Plano
        </Button>
      </div>

      {isLoading ? (
        <PlanosGridSkeleton />
      ) : planos.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-sm">
          <p className="mb-4">Nenhum plano cadastrado.</p>
          <Button variant="outline" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 size-4" />
            Criar primeiro plano
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {planos.map(plano => (
            <PlanoCard key={plano.id} plano={plano} />
          ))}
        </div>
      )}

      <FormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Novo Plano"
        description="Preencha os dados para cadastrar um novo plano."
      >
        <PlanoForm mode="create" onSuccess={() => setCreateOpen(false)} />
      </FormModal>
    </>
  )
}

export { PlanosView }
