import { useEffect } from 'react'
import useViewport from '@/hooks/useViewport'
import { breakpoints } from '@/utils/breakpoints'
import { useAtom } from 'jotai/index'
import { showFooterAtom } from '@/atom/navbar'

const ControlFooter = () => {
  const [, showFooter] = useAtom(showFooterAtom)
  const { width } = useViewport()

  useEffect(() => {
    if (width < breakpoints.lg) {
      showFooter(false)
    } else {
      showFooter(true)
    }
  }, [width])

  return null
}

export default ControlFooter
