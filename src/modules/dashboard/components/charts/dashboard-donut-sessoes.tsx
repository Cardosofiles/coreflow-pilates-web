'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DashboardData } from '../../types/dashboard.types'
import type { JSX } from 'react'

interface Props {
  data: DashboardData | undefined
  isLoading: boolean
}

const COLORS = ['#ef4444', '#22c55e']

const DashboardDonutSessoes = ({ data, isLoading }: Props): JSX.Element => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full rounded-full" />
        </CardContent>
      </Card>
    )
  }

  const lotadas = data?.total_sessoes_lotadas ?? 0
  const disponiveis = Math.max((data?.total_sessoes_futuras ?? 0) - lotadas, 0)

  const chartData = [
    { name: 'Lotadas', value: lotadas },
    { name: 'Disponíveis', value: disponiveis },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Ocupação — Sessões Futuras</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ fontSize: 12 }}
              formatter={(value, name) => [value ?? 0, name]}
            />
            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export { DashboardDonutSessoes }
