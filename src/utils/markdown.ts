import md from "nano-markdown"

export function mdToHtml(content: string) {
  return md(content)
}
