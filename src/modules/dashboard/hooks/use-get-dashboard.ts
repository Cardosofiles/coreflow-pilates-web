import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api'
import type { DashboardData } from '../types/dashboard.types'

export function useGetDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<DashboardData>('/admin/dashboard').then(r => r.data),
  })
}
