export const unescapeString = (str: string) => {
  return str.replace(/\\([ntr\\"'])|(&nbsp;)/g, (_, match, htmlEntity) => {
    if (htmlEntity) {
      return '\u00A0' // Unicode for non-breaking space
    }
    switch (match) {
      case 'n':
        return '\n'
      case 't':
        return '\t'
      case 'r':
        return '\r'
      case '\\':
        return '\\'
      case '"':
        return '"'
      case "'":
        return "'"
      default:
        return match
    }
  })
}
