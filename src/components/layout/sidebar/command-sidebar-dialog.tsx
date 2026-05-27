'use client'

import { useMemo, useState, type Dispatch, type JSX, type SetStateAction } from 'react'

import { useRouter } from 'next/navigation'

import { ArrowRight, Dumbbell, Plus, UserIcon, UserStar } from 'lucide-react'

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
  CommandSeparator,
} from '@/components/ui/command'

import { useUserPapel } from '@/context/user-context'
import { firstSidebarData, secondSidebarData } from '@/data/sidebar-items'
import { cn } from '@/lib/utils'
import { useGetAlunos } from '@/modules/alunos'
import { useGetAparelhos } from '@/modules/aparelhos'
import { useGetInstrutores } from '@/modules/instrutores/hooks/use-get-instrutores'

interface CommandSidebarDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

interface QuickAction {
  id: string
  label: string
  href: string
  roles: string[]
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'new-aluno', label: 'Novo aluno', href: '/admin/alunos', roles: ['ADMIN'] },
  { id: 'new-sessao', label: 'Nova sessão', href: '/admin/sessoes', roles: ['ADMIN'] },
  { id: 'new-aparelho', label: 'Novo aparelho', href: '/admin/aparelhos', roles: ['ADMIN'] },
]

const StatusBadge = ({ ativo }: { ativo: boolean }): JSX.Element => (
  <span
    className={cn(
      'ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium',
      ativo
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
        : 'bg-muted text-muted-foreground'
    )}
  >
    {ativo ? 'Ativo' : 'Inativo'}
  </span>
)

const CommandSidebarDialog = ({ open, setOpen }: CommandSidebarDialogProps): JSX.Element => {
  const router = useRouter()
  const papel = useUserPapel()
  const [inputValue, setInputValue] = useState('')

  const { data: alunos = [] } = useGetAlunos()
  const { data: instrutores = [] } = useGetInstrutores()
  const { data: aparelhos = [] } = useGetAparelhos()

  const allNavItems = useMemo(
    () =>
      [...firstSidebarData, ...secondSidebarData].filter(
        item => !item.roles || item.roles.includes(papel as never)
      ),
    [papel]
  )

  const quickActions = useMemo(
    () => QUICK_ACTIONS.filter(action => action.roles.includes(papel ?? '')),
    [papel]
  )

  const showEntities = inputValue.length >= 2

  const filteredAlunos = useMemo(() => {
    if (!showEntities) return []
    const q = inputValue.toLowerCase()
    return alunos
      .filter(a => a.nome.toLowerCase().includes(q) || a.email.toLowerCase().includes(q))
      .slice(0, 5)
  }, [alunos, inputValue, showEntities])

  const filteredInstrutores = useMemo(() => {
    if (!showEntities) return []
    const q = inputValue.toLowerCase()
    return instrutores
      .filter(i => i.nome.toLowerCase().includes(q) || i.email.toLowerCase().includes(q))
      .slice(0, 5)
  }, [instrutores, inputValue, showEntities])

  const filteredAparelhos = useMemo(() => {
    if (!showEntities) return []
    const q = inputValue.toLowerCase()
    return aparelhos.filter(a => a.nome.toLowerCase().includes(q)).slice(0, 5)
  }, [aparelhos, inputValue, showEntities])

  const navigate = (href: string): void => {
    router.push(href)
    setOpen(false)
    setInputValue('')
  }

  const handleOpenChange = (value: boolean): void => {
    setOpen(value)
    if (!value) setInputValue('')
  }

  return (
    <CommandResponsiveDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Busca global"
      description="Busque por páginas, alunos, instrutores e aparelhos"
    >
      <CommandInput
        placeholder="Buscar páginas, alunos, instrutores..."
        value={inputValue}
        onValueChange={setInputValue}
      />

      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        {!inputValue && quickActions.length > 0 && (
          <CommandGroup heading="Ações rápidas">
            {quickActions.map(action => (
              <CommandItem
                key={action.id}
                value={action.label}
                onSelect={() => navigate(action.href)}
              >
                <Plus className="text-muted-foreground" />
                <span>{action.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading="Navegação">
          {allNavItems.map(item => {
            const Icon = item.icon
            return (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() => navigate(item.href)}
              >
                <Icon className="text-muted-foreground" />
                <span>{item.label}</span>
                <ArrowRight className="text-muted-foreground ml-auto size-3 opacity-40" />
              </CommandItem>
            )
          })}
        </CommandGroup>

        {showEntities && filteredAlunos.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Alunos">
              {filteredAlunos.map(aluno => (
                <CommandItem
                  key={`aluno-${aluno.id}`}
                  value={`${aluno.nome} ${aluno.email}`}
                  onSelect={() => navigate(`/admin/alunos/${aluno.id}`)}
                >
                  <UserIcon className="text-muted-foreground shrink-0" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm">{aluno.nome}</span>
                    <span className="text-muted-foreground truncate text-xs">{aluno.email}</span>
                  </div>
                  <StatusBadge ativo={aluno.ativo} />
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {showEntities && filteredInstrutores.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Instrutores">
              {filteredInstrutores.map(instrutor => (
                <CommandItem
                  key={`instrutor-${instrutor.id}`}
                  value={`${instrutor.nome} ${instrutor.email}`}
                  onSelect={() => navigate(`/admin/instrutores/${instrutor.id}`)}
                >
                  <UserStar className="text-muted-foreground shrink-0" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm">{instrutor.nome}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {instrutor.especialidade ?? instrutor.email}
                    </span>
                  </div>
                  <StatusBadge ativo={instrutor.ativo} />
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {showEntities && filteredAparelhos.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Aparelhos">
              {filteredAparelhos.map(aparelho => (
                <CommandItem
                  key={`aparelho-${aparelho.id}`}
                  value={aparelho.nome}
                  onSelect={() => navigate(`/admin/aparelhos/${aparelho.id}`)}
                >
                  <Dumbbell className="text-muted-foreground shrink-0" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm">{aparelho.nome}</span>
                    {aparelho.descricao && (
                      <span className="text-muted-foreground line-clamp-1 text-xs">
                        {aparelho.descricao}
                      </span>
                    )}
                  </div>
                  <StatusBadge ativo={aparelho.ativo} />
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandResponsiveDialog>
  )
}

export { CommandSidebarDialog }
