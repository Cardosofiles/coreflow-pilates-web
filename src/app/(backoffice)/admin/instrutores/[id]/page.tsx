import { type JSX } from 'react'

import { InstrutorDetails } from '@/modules/instrutores'

interface Props {
  params: { id: string }
}

const InstrutorPage = ({ params }: Props): JSX.Element => {
  return <InstrutorDetails id={Number(params.id)} />
}

export default InstrutorPage
