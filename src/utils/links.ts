export function getDomain(path: string) {
  const url = new URL(path)
  return url.hostname
}

export function pathJoin(...parts: string[]) {
  const separator = "/"
  const replace = new RegExp(`${separator}{1,}`, "g")
  return parts.join(separator).replace(replace, separator)
}
