export function isArticlesBlock(
  block: CMS.UI.Block
): block is CMS.UI.ArticlesBlock {
  return block.type === "articles"
}

export function isHeroBlock(block: CMS.UI.Block): block is CMS.UI.HeroBlock {
  return block.type === "hero"
}

export function isNotesBlock(block: CMS.UI.Block): block is CMS.UI.NotesBlock {
  return block.type === "notes"
}
