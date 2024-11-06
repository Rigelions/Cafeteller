import { useRef, useCallback, useEffect } from 'react'

/**
 * A type definition for the callback function used in the debounce hook.
 * @template T - An array of arguments the callback function will accept.
 */
type CallbackFunction<T extends unknown[]> = (...args: T) => void

/**
 * A custom React hook that provides a debounced version of a callback function.
 *
 * This hook returns a function that, when invoked, will postpone its execution until after
 * a specified delay in milliseconds has elapsed since the last time it was invoked.
 *
 * @template T - The type of arguments the debounced function accepts.
 * @param {CallbackFunction<T>} callback - The function to debounce.
 * @param {number} delay - The delay in milliseconds to debounce the callback.
 * @returns {[CallbackFunction<T>, () => void]} - A debounced version of the provided callback function and a cancel function to cancel any pending debounced callbacks.
 *
 * @example
 * // Usage in a React component:
 * const [debouncedSave, cancelDebounce] = useDebounce((value: string) => saveToServer(value), 500);
 *
 * <input onChange={(e) => debouncedSave(e.target.value)} />
 * <button onClick={cancelDebounce}>Cancel</button>
 */
function useDebounce<T extends unknown[]>(
  callback: CallbackFunction<T>,
  delay: number
): [CallbackFunction<T>, () => void] {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup the timer if the component using this hook unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const debouncedFunction = useCallback(
    (...args: T) => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  return [debouncedFunction, cancel]
}

export default useDebounce
