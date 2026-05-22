import { type JSX } from 'react'

import { InstrutoresTable } from '@/modules/instrutores'

const InstrutoresPage = (): JSX.Element => {
  return (
    <main className="py-8 px-4">
      <InstrutoresTable />
    </main>
  )
}

export default InstrutoresPage
