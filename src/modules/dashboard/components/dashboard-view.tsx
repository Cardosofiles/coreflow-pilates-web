'use client'

import {
  Users,
  UserCheck,
  ClipboardList,
  CalendarDays,
  CalendarCheck,
  AlertCircle,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetDashboard } from '../hooks/use-get-dashboard'
import { DashboardBarMetricas } from './charts/dashboard-bar-metricas'
import { DashboardDonutSessoes } from './charts/dashboard-donut-sessoes'
import { DashboardLineAgendamentos } from './charts/dashboard-line-agendamentos'
import { DashboardBarAlunosMes } from './charts/dashboard-bar-alunos-mes'
import type { JSX } from 'react'

const DashboardSkeleton = (): JSX.Element => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-5 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16" />
        </CardContent>
      </Card>
    ))}
  </div>
)

const DashboardView = (): JSX.Element => {
  const { data, isLoading, isError } = useGetDashboard()

  if (isLoading) return <DashboardSkeleton />

  if (isError || !data) {
    return (
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <span>Erro ao carregar os dados do dashboard.</span>
      </div>
    )
  }

  const cards = [
    {
      title: 'Alunos Ativos',
      value: data.total_alunos_ativos,
      icon: Users,
      description: 'Alunos com cadastro ativo',
    },
    {
      title: 'Instrutores Ativos',
      value: data.total_instrutores_ativos,
      icon: UserCheck,
      description: 'Instrutores em atividade',
    },
    {
      title: 'Matrículas Ativas',
      value: data.total_matriculas_ativas,
      icon: ClipboardList,
      description: 'Matrículas com status ativa',
    },
    {
      title: 'Sessões Futuras',
      value: data.total_sessoes_futuras,
      icon: CalendarDays,
      description: 'Sessões abertas a partir de hoje',
    },
    {
      title: 'Agendamentos Futuros',
      value: data.total_agendamentos_futuros,
      icon: CalendarCheck,
      description: 'Agendamentos confirmados a partir de hoje',
    },
    {
      title: 'Sessões Lotadas',
      value: data.total_sessoes_lotadas,
      icon: AlertCircle,
      description: 'Sessões futuras com capacidade máxima atingida',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do studio em tempo real.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ title, value, icon: Icon, description }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardBarMetricas data={data} isLoading={false} />
        <DashboardDonutSessoes data={data} isLoading={false} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardLineAgendamentos />
        <DashboardBarAlunosMes />
      </div>
    </div>
  )
}

export { DashboardView }
