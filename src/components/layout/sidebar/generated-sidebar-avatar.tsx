import type { JSX } from 'react'

import { botttsNeutral, initials } from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface GeneratedSidebarAvatarProps {
  seed: string
  className?: string
  variant: 'botttsNeutral' | 'initials'
}

const GeneratedSidebarAvatar = ({
  seed,
  className,
  variant,
}: GeneratedSidebarAvatarProps): JSX.Element => {
  let avatar

  if (variant === 'botttsNeutral') {
    avatar = createAvatar(botttsNeutral, {
      seed,
    })
  } else {
    avatar = createAvatar(initials, {
      seed,
      fontWeight: 500,
      fontSize: 42,
    })
  }

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar.toDataUri()} alt="Avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}

export { GeneratedSidebarAvatar }
