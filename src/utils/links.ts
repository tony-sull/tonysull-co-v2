export function getDomain(path: string) {
  const url = new URL(path)
  return url.hostname
}
