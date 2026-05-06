import type { JSX } from 'react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  // StatusAgendamento
  AGENDADO: {
    label: 'Agendado',
    className:
      'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
  },
  REALIZADO: {
    label: 'Realizado',
    className:
      'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
  },
  FALTA: {
    label: 'Falta',
    className:
      'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800',
  },
  // StatusMatricula
  PENDENTE_PAGAMENTO: {
    label: 'Pendente de Pagamento',
    className:
      'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800',
  },
  ATIVA: {
    label: 'Ativa',
    className:
      'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
  },
  DESATIVADA: {
    label: 'Desativada',
    className:
      'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
  },
  // StatusSessao
  ABERTA: {
    label: 'Aberta',
    className:
      'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
  },
  ENCERRADA: {
    label: 'Encerrada',
    className:
      'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
  },
  // StatusFilaEspera
  AGUARDANDO: {
    label: 'Aguardando',
    className:
      'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800',
  },
  CONVERTIDO: {
    label: 'Convertido',
    className:
      'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
  },
  // Compartilhado (masculino e feminino)
  CANCELADO: {
    label: 'Cancelado',
    className:
      'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
  },
  CANCELADA: {
    label: 'Cancelada',
    className:
      'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
  },
  // TipoCobranca
  MATRICULA: {
    label: 'Matrícula',
    className:
      'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800',
  },
  AVULSO: {
    label: 'Avulso',
    className:
      'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800',
  },
}

interface StatusBadgeProps {
  status: string
  className?: string
}

const StatusBadge = ({ status, className }: StatusBadgeProps): JSX.Element => {
  const config = STATUS_CONFIG[status] ?? { label: status, className: '' }
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}

export { StatusBadge }
