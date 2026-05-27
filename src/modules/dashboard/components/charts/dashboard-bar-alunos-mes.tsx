'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetAlunosPorMes } from '../../hooks/use-get-alunos-por-mes'
import type { JSX } from 'react'

const DashboardBarAlunosMes = (): JSX.Element => {
  const { data, isLoading } = useGetAlunosPorMes()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    )
  }

  const chartData = (data?.items ?? []).map(item => ({
    mes: format(parseISO(`${item.mes}-01`), 'MMM/yy', { locale: ptBR }),
    total: item.total,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Novos Alunos — Últimos 6 meses</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ fontSize: 12 }}
              formatter={value => [value ?? 0, 'Novos alunos']}
            />
            <Bar dataKey="total" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export { DashboardBarAlunosMes }
