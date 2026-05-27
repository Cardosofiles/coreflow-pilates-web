'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DashboardData } from '../../types/dashboard.types'
import type { JSX } from 'react'

interface Props {
  data: DashboardData | undefined
  isLoading: boolean
}

const LABELS: Record<keyof DashboardData, string> = {
  total_alunos_ativos: 'Alunos',
  total_instrutores_ativos: 'Instrutores',
  total_matriculas_ativas: 'Matrículas',
  total_sessoes_futuras: 'Sessões',
  total_agendamentos_futuros: 'Agendamentos',
  total_sessoes_lotadas: 'Lotadas',
}

const DashboardBarMetricas = ({ data, isLoading }: Props): JSX.Element => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    )
  }

  const chartData = data
    ? (Object.keys(LABELS) as (keyof DashboardData)[]).map(key => ({
        name: LABELS[key],
        total: data[key],
      }))
    : []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Visão Geral — Métricas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11 }}
              className="fill-muted-foreground"
            />
            <Tooltip contentStyle={{ fontSize: 12 }} formatter={value => [value ?? 0, 'Total']} />
            <Bar dataKey="total" fill="#7c3aed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export { DashboardBarMetricas }
