import { isArrayNotEmpty } from '@/utils/array'

describe('isArrayNotEmpty', () => {
  test('should return false if the array is null', () => {
    const array = null
    const result = isArrayNotEmpty(array)
    expect(result).toBe(false)
  })

  test('should return false if the array is undefined', () => {
    const array = undefined
    const result = isArrayNotEmpty(array)
    expect(result).toBe(false)
  })

  test('should return false if the array is an empty array', () => {
    const array: any[] = []
    const result = isArrayNotEmpty(array)
    expect(result).toBe(false)
  })

  test('should return true if the array is not empty', () => {
    const array = [1, 2, 3]
    const result = isArrayNotEmpty(array)
    expect(result).toBe(true)
  })
})
