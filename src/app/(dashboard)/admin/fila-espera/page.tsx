import { type JSX } from 'react'

import { FilaEsperaTable } from '@/modules/fila-espera'

const FilaEsperaPage = (): JSX.Element => {
  return (
    <main className="py-8 px-4">
      <FilaEsperaTable />
    </main>
  )
}

export default FilaEsperaPage
