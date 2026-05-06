import type { ElementType, SVGProps } from 'react'

import {
  Bell,
  Calendar,
  ClipboardList,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  ShieldUser,
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
  { id: 1, icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { id: 2, icon: Calendar, label: 'Agenda', href: '/agenda' },
  { id: 3, icon: ClipboardList, label: 'Matrícula', href: '/matricula' },
]

const secondSidebarData: SidebarData = [
  { id: 1, icon: ShieldUser, label: 'Administrativo', href: '/admin/dashboard', roles: ['ADMIN'] },
  { id: 2, icon: UserStar, label: 'Instrutores', href: '/instrutor/dashboard', roles: ['INSTRUTOR'] },
  { id: 3, icon: CreditCard, label: 'Planos', href: '/planos', roles: ['ADMIN'] },
  { id: 4, icon: Users, label: 'Alunos', href: '/aluno/dashboard', roles: ['ALUNO'] },
  { id: 5, icon: Dumbbell, label: 'Aparelhos', href: '/aparelhos', roles: ['ADMIN'] },
  { id: 6, icon: Bell, label: 'Alertas', href: '/alertas', roles: ['ADMIN'] },
]

export { firstSidebarData, secondSidebarData }
