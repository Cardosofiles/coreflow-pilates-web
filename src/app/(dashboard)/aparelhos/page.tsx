import { HandFist } from 'lucide-react'
import type { JSX } from 'react'

const AparelhosPage = (): JSX.Element => {
  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-center space-y-4">
      <p className="uppercase">Aparelhos</p>
      <h1 className="text-7xl font-black tracking-tight">SABOR FRONT-END</h1>
      <HandFist className="h-24 w-24 animate-bounce" />
    </div>
  )
}

export default AparelhosPage
