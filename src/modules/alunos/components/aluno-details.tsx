'use client'

import { type JSX } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Mail, Phone, User } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/common'

import { useGetAluno } from '../hooks/use-get-aluno'

interface Props {
  id: number
}

const AlunoDetailsSkeleton = (): JSX.Element => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-48" />
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-20" />
      ))}
    </div>
  </div>
)

const AlunoDetails = ({ id }: Props): JSX.Element => {
  const router = useRouter()
  const { data: aluno, isLoading, isError } = useGetAluno(id)

  if (isLoading) return <AlunoDetailsSkeleton />

  if (isError || !aluno) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 size-4" />
          Voltar
        </Button>
        <p className="text-destructive">Aluno não encontrado.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{aluno.nome}</h1>
          <p className="text-muted-foreground text-sm">
            Cadastrado em {new Date(aluno.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={aluno.ativo ? 'ATIVO' : 'INATIVO'} />
        </div>
      </div>

      <Tabs defaultValue="dados">
        <TabsList>
          <TabsTrigger value="dados">Dados</TabsTrigger>
          <TabsTrigger value="matriculas">Matrículas</TabsTrigger>
          <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <User className="size-4" />
                  Nome
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">{aluno.nome}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="size-4" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">{aluno.email}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="size-4" />
                  Telefone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">{aluno.telefone ?? '—'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="size-4" />
                  Data de Nascimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base">
                  {aluno.data_nascimento
                    ? new Date(aluno.data_nascimento + 'T00:00:00').toLocaleDateString('pt-BR')
                    : '—'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="matriculas" className="mt-6">
          <Card>
            <CardContent className="text-muted-foreground py-12 text-center text-sm">
              Disponível após implementar o módulo de Matrículas.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agendamentos" className="mt-6">
          <Card>
            <CardContent className="text-muted-foreground py-12 text-center text-sm">
              Disponível após implementar o módulo de Agendamentos.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { AlunoDetails }
