import { unescapeString } from '@/utils/string/unescapeString'

describe('unescapeString', () => {
  test('should unescape \\n to a newline character', () => {
    const input = 'Hello\\nWorld'
    const result = unescapeString(input)
    expect(result).toBe('Hello\nWorld')
  })

  test('should unescape \\t to a tab character', () => {
    const input = 'Hello\\tWorld'
    const result = unescapeString(input)
    expect(result).toBe('Hello\tWorld')
  })

  test('should unescape \\r to a carriage return', () => {
    const input = 'Hello\\rWorld'
    const result = unescapeString(input)
    expect(result).toBe('Hello\rWorld')
  })

  test('should unescape \\\\ to a backslash', () => {
    const input = 'Hello\\\\World'
    const result = unescapeString(input)
    expect(result).toBe('Hello\\World')
  })

  test('should unescape \\" to a double quote', () => {
    const input = 'Hello\\"World"'
    const result = unescapeString(input)
    expect(result).toBe('Hello"World"')
  })

  test("should unescape \\' to a single quote", () => {
    const input = "Hello\\'World'"
    const result = unescapeString(input)
    expect(result).toBe("Hello'World'")
  })

  test('should unescape &nbsp; to a non-breaking space', () => {
    const input = 'Hello&nbsp;World'
    const result = unescapeString(input)
    expect(result).toBe('Hello\u00A0World')
  })

  test('should handle mixed escape sequences', () => {
    const input = 'Line1\\nLine2\\tTabbed&nbsp;Space'
    const result = unescapeString(input)
    expect(result).toBe('Line1\nLine2\tTabbed\u00A0Space')
  })
})
