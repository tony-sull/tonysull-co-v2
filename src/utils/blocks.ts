export type Markdown = string

export interface CTA {
  title: string
  url: string
}

export interface HeroBlock {
  type: "hero"
  title: string
  content: Markdown
  cta: CTA
}

export interface ArticlesBlock {
  type: "articles"
  title: string
  ids: string[] | undefined
}

export interface NotesBlock {
  type: "notes"
  title: string
  ids: string[] | undefined
}

export type Block = HeroBlock | ArticlesBlock | NotesBlock

export function isArticlesBlock(
  block: Block
): block is ArticlesBlock {
  return block.type === "articles"
}

export function isHeroBlock(block: Block): block is HeroBlock {
  return block.type === "hero"
}

export function isNotesBlock(block: Block): block is NotesBlock {
  return block.type === "notes"
}
