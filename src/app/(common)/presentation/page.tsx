import type { JSX } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Apresentação',
  description:
    'Conheça o estúdio de pilates e descubra como podemos ajudar você a alcançar seus objetivos de saúde e bem-estar.',
}

const PresentationPage = (): JSX.Element => {
  return <div>PresentationPage</div>
}

export default PresentationPage
