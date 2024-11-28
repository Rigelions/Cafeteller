import { isEqual } from '@/utils/isEqual'

const isArrayHasDuplicateEl = <T>(array1: T[], array2: T[]): boolean => {
  if (!array1) array1 = []
  if (!array2) array2 = []
  for (const el of array1) {
    if (array2.includes(el)) return true

    if (array2.some((e2) => isEqual(e2, el))) return true
  }
  return false
}

const isArrayNotEmpty = <T>(array: T[] | null | undefined) =>
  !!array && Array.isArray(array) && !!array.length

export { isArrayHasDuplicateEl, isArrayNotEmpty }
