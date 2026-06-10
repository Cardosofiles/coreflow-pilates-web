import type { JSX } from 'react'
import type { Metadata } from 'next'

import { PresentationShell } from '@/modules/presentation'

export const metadata: Metadata = {
  title: 'Apresentação',
  description:
    'Apresentação interativa do CoreFlow Pilates — produto, arquitetura, equipe e infraestrutura do trabalho V2 da disciplina de Análise de Sistemas I (UNITRI).',
}

const PresentationPage = (): JSX.Element => {
  return <PresentationShell />
}

export default PresentationPage
