export function identifierToSlug(identifier: string) {
  return identifier.slice(identifier.lastIndexOf('/') + 1)
}
