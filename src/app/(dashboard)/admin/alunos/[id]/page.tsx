import type { JSX } from 'react'

import { AlunoDetails } from '@/modules/alunos'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AlunoDetailsPage({ params }: Props): Promise<JSX.Element> {
  const { id } = await params
  return <AlunoDetails id={Number(id)} />
}
