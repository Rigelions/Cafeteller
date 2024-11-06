import React from 'react'
import { useAtom } from 'jotai'
import { loadingFloatingAtom } from '@/atom/loading'
import { CoffeeLoader } from '@/components/ui/MF'

const FloatingSpinner = () => {
  const [loading] = useAtom(loadingFloatingAtom)

  return (
    <div
      className={`fixed bottom-16 right-16 z-50 ${loading ? 'block' : 'hidden'}`}
    >
      <CoffeeLoader />
    </div>
  )
}

export default FloatingSpinner
