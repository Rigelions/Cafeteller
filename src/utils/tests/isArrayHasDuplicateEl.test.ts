import { isArrayHasDuplicateEl } from '@/utils/array'

describe('isArrayHasDuplicateEl', () => {
  test('should return true if two arrays have the same element', () => {
    const array1 = [1, 2, 3]
    const array2 = [4, 5, 6, 3]
    const result = isArrayHasDuplicateEl(array1, array2)
    expect(result).toBe(true)
  })

  test('should return false if two arrays do not have the same element', () => {
    const array1 = [1, 2, 3]
    const array2 = [4, 5, 6]
    const result = isArrayHasDuplicateEl(array1, array2)
    expect(result).toBe(false)
  })

  test('should return false if one of the arrays is empty', () => {
    const array1 = [1, 2, 3]
    const array2: number[] = []
    const result = isArrayHasDuplicateEl(array1, array2)
    expect(result).toBe(false)
  })

  test('should return false if both arrays are empty', () => {
    const array1: any[] = []
    const array2: any[] = []
    const result = isArrayHasDuplicateEl(array1, array2)
    expect(result).toBe(false)
  })

  test('should return false if one of the arrays is undefined', () => {
    const array1 = [1, 2, 3]
    const array2 = undefined
    const result = isArrayHasDuplicateEl(array1, array2 as any)
    expect(result).toBe(false)
  })

  test('should return false if both arrays are undefined', () => {
    const array1 = undefined
    const array2 = undefined
    const result = isArrayHasDuplicateEl(array1 as any, array2 as any)
    expect(result).toBe(false)
  })

  test('should return true if both object is duplicate', () => {
    const array1 = [{ a: 1 }, { b: 2 }, { c: 3 }]
    const array2 = [{ b: 2 }, { c: 3 }, { a: 1 }]
    const result = isArrayHasDuplicateEl(array1, array2)
    expect(result).toBe(true)
  })
})
