import type { Dispatch, JSX, SetStateAction } from 'react'

import {
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from '@/components/ui/command'

interface CommandSidebarDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const CommandSidebarDialog = ({ open, setOpen }: CommandSidebarDialogProps): JSX.Element => {
  return (
    <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Encontre uma reunião ou agente" />
      <CommandList>
        <CommandItem>Test</CommandItem>
      </CommandList>
    </CommandResponsiveDialog>
  )
}

export { CommandSidebarDialog }
