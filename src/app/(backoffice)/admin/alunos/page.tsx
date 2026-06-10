import type { JSX } from 'react'

import { AlunosTable } from '@/modules/alunos'

export default function AlunosPage(): JSX.Element {
  return (
    <main className="py-8 px-4">
      <AlunosTable />
    </main>
  )
}
