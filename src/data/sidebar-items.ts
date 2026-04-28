import type { ElementType, SVGProps } from 'react'

import {
  Bell,
  Calendar,
  ClipboardList,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  StarIcon,
  Users,
} from 'lucide-react'

type SidebarItem = {
  id: number
  icon: ElementType<SVGProps<SVGSVGElement>>
  label: string
  href: string
}

export type SidebarData = SidebarItem[]

const firstSidebarData: SidebarData = [
  { id: 1, icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { id: 2, icon: Calendar, label: 'Agenda', href: '/agenda' },
  { id: 3, icon: ClipboardList, label: 'Matrícula', href: '/matricula' },
]

const secondSidebarData: SidebarData = [
  { id: 1, icon: CreditCard, label: 'Planos', href: '/planos' },
  { id: 2, icon: Users, label: 'Usuários', href: '/usuarios' },
  { id: 3, icon: Dumbbell, label: 'Aparelhos', href: '/aparelhos' },
  { id: 4, icon: Bell, label: 'Alertas', href: '/alertas' },
]

export { firstSidebarData, secondSidebarData }
