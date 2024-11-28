export const isEqual = <T>(value1: T, value2: T): boolean => {
  if (typeof value1 === 'object' && typeof value2 === 'object') {
    return JSON.stringify(value1) === JSON.stringify(value2)
  }

  return value1 === value2
}
