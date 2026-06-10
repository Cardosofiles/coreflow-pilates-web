'use client'

import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  FolderGit2,
  GitBranch,
  MapPin,
  Users,
} from 'lucide-react'
import { useRef, type JSX } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { Collaborator, GithubUser, GithubUserMap } from '../types/presentation.types'

/* ────────────────────────────────────────────────
   Card
──────────────────────────────────────────────── */
interface DeveloperCardProps {
  collaborator: Collaborator
  user?: GithubUser
  loading: boolean
}

const initials = (value: string): string =>
  value
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')

const DeveloperCard = ({ collaborator, user, loading }: DeveloperCardProps): JSX.Element => {
  const name = user?.name ?? collaborator.fallbackName
  const profileUrl = user?.html_url ?? `https://github.com/${collaborator.login}`

  return (
    <article
      className={cn(
        'group/dev relative flex w-[20.5rem] shrink-0 snap-start flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-sm transition-all duration-300',
        'hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_50px_oklch(0_0_0/0.12)]'
      )}
    >
      {/* accent wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-primary/10 blur-2xl transition-opacity duration-300 group-hover/dev:opacity-100 sm:opacity-0"
      />

      <header className="flex items-center gap-3.5">
        <Avatar
          size="lg"
          className="size-14 ring-2 ring-border transition-all duration-300 group-hover/dev:ring-primary/60"
        >
          {user?.avatar_url ? <AvatarImage src={user.avatar_url} alt={name} /> : null}
          <AvatarFallback className="bg-primary/10 font-mono text-sm font-bold text-primary">
            {loading ? '··' : initials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 className="truncate text-base font-semibold tracking-tight">{name}</h3>
          <span className="truncate font-mono text-sm text-muted-foreground">
            @{collaborator.login}
          </span>
        </div>
      </header>

      <Badge variant="outline" className="border-primary/30 text-[0.8rem] text-primary">
        {collaborator.role}
      </Badge>

      <p className="min-h-[4rem] text-[0.95rem] leading-relaxed text-muted-foreground">
        {loading ? (
          <span className="flex flex-col gap-2">
            <span className="h-3 w-full animate-pulse rounded bg-muted" />
            <span className="h-3 w-4/5 animate-pulse rounded bg-muted" />
            <span className="h-3 w-2/3 animate-pulse rounded bg-muted" />
          </span>
        ) : (
          <span className="line-clamp-3">
            {user?.bio ?? 'Colaborador(a) do projeto CoreFlow Pilates.'}
          </span>
        )}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <div className="flex min-w-0 items-center gap-4 font-mono text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <FolderGit2 className="size-4 text-primary/70" />
            <span className="tabular-nums">{user?.public_repos ?? '–'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-4 text-primary/70" />
            <span className="tabular-nums">{user?.followers ?? '–'}</span>
          </span>
          {user?.location ? (
            <span className="flex min-w-0 items-center gap-1.5">
              <MapPin className="size-4 shrink-0 text-primary/70" />
              <span className="truncate">{user.location}</span>
            </span>
          ) : null}
        </div>

        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir o perfil de ${name} no GitHub`}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          <ArrowUpRight className="size-4.5" />
        </a>
      </div>
    </article>
  )
}

/* ────────────────────────────────────────────────
   Carousel
──────────────────────────────────────────────── */
interface DeveloperCarouselProps {
  collaborators: Collaborator[]
  users: GithubUserMap
  loading: boolean
}

export const DeveloperCarousel = ({
  collaborators,
  users,
  loading,
}: DeveloperCarouselProps): JSX.Element => {
  const trackRef = useRef<HTMLDivElement>(null)
  const scrollByCards = (direction: 1 | -1): void => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * (track.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <GitBranch className="size-4" />
          <span className="font-mono text-sm tracking-wider uppercase">
            {collaborators.length} {collaborators.length === 1 ? 'colaborador' : 'colaboradores'}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Anterior"
            onClick={() => scrollByCards(-1)}
            className="size-9 rounded-full"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Próximo"
            onClick={() => scrollByCards(1)}
            className="size-9 rounded-full"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-smooth px-1 pb-2"
      >
        {collaborators.map((collaborator, index) => (
          <DeveloperCard
            key={`${collaborator.login}-${index}`}
            collaborator={collaborator}
            user={users[collaborator.login.toLowerCase()]}
            loading={loading}
          />
        ))}
      </div>
    </div>
  )
}
