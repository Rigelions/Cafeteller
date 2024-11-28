import { isEqual } from '@/utils/isEqual'

describe('isEqual', () => {
  test('should return true if two strings are equal', () => {
    const value1 = 'Hello World'
    const value2 = 'Hello World'
    const result = isEqual(value1, value2)
    expect(result).toBe(true)
  })

  test('should return false if two strings are not equal', () => {
    const value1 = 'Hello World'
    const value2 = 'Hello World!'
    const result = isEqual(value1, value2)
    expect(result).toBe(false)
  })

  test('should return true if two numbers are equal', () => {
    const value1 = 123
    const value2 = 123
    const result = isEqual(value1, value2)
    expect(result).toBe(true)
  })

  test('should return false if two numbers are not equal', () => {
    const value1 = 123
    const value2 = 1234
    const result = isEqual(value1, value2)
    expect(result).toBe(false)
  })

  test('should return true if two booleans are equal', () => {
    const value1 = true
    const value2 = true
    const result = isEqual(value1, value2)
    expect(result).toBe(true)
  })

  test('should return false if two booleans are not equal', () => {
    const value1 = true
    const value2 = false
    const result = isEqual(value1, value2)
    expect(result).toBe(false)
  })

  test('should return true if two objects are equal', () => {
    const value1 = { a: 1, b: 2, c: 3 }
    const value2 = { a: 1, b: 2, c: 3 }
    const result = isEqual(value1, value2)

    expect(result).toBe(true)
  })

  test('should return false if two objects are not equal', () => {
    const value1 = { a: 1, b: 2, c: 3 }
    const value2 = { a: 1, b: 2, c: 4 }
    const result = isEqual(value1, value2)

    expect(result).toBe(false)
  })
})
