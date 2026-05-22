import type { ElementType, SVGProps } from 'react'

import {
  CalendarCheck2,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  ListOrdered,
  Users,
  UserStar,
} from 'lucide-react'

import type { PapelUsuario } from '@/modules/auth'

type SidebarItem = {
  id: number
  icon: ElementType<SVGProps<SVGSVGElement>>
  label: string
  href: string
  roles?: PapelUsuario[]
}

export type SidebarData = SidebarItem[]

const firstSidebarData: SidebarData = [
  { id: 1, icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard', roles: ['ADMIN'] },
]

const secondSidebarData: SidebarData = [
  // ADMIN
  { id: 1, icon: Users, label: 'Alunos', href: '/admin/alunos', roles: ['ADMIN'] },
  { id: 2, icon: UserStar, label: 'Instrutores', href: '/admin/instrutores', roles: ['ADMIN'] },
  { id: 3, icon: CreditCard, label: 'Planos', href: '/admin/planos', roles: ['ADMIN'] },
  { id: 4, icon: CalendarDays, label: 'Sessões', href: '/admin/sessoes', roles: ['ADMIN'] },
  { id: 5, icon: ClipboardList, label: 'Matrículas', href: '/admin/matricula', roles: ['ADMIN'] },
  {
    id: 6,
    icon: CalendarCheck2,
    label: 'Agendamentos',
    href: '/admin/agendamentos',
    roles: ['ADMIN'],
  },
  { id: 7, icon: Dumbbell, label: 'Aparelhos', href: '/admin/aparelhos', roles: ['ADMIN'] },
  {
    id: 8,
    icon: ListOrdered,
    label: 'Fila de Espera',
    href: '/admin/fila-espera',
    roles: ['ADMIN'],
  },
]

export { firstSidebarData, secondSidebarData }
