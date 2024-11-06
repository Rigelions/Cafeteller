import { useAtom } from 'jotai'
import { loadingFloatingAtom } from '@/atom/loading'

const useFloatingSpinner = () => {
  const [, showSpinner] = useAtom(loadingFloatingAtom)
  return showSpinner
}

export default useFloatingSpinner
