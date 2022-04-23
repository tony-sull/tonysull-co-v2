import path from "path"
import type { MarkdownInstance } from 'astro'

function parseData(data: MarkdownInstance<CMS.Article>): { id: string; article: CMS.Article } {
  const { frontmatter: article, file } = data
  const id = path
    .basename(file)
    .replace(path.extname(file), "")
  return { id, article }
}

function sortArticles(a: CMS.Article, b: CMS.Article) {
  const aDate = new Date(a.published_date)
  const bDate = new Date(b.published_date)
  return bDate.getTime() - aDate.getTime()
}

export function getArticles(
  allArticles: MarkdownInstance<CMS.Article>[],
  ids?: CMS.ArticleSlug[]
) {
  const articlesMap = allArticles
    .map(parseData)
    .reduce((acc, { id, article }) => {
      if (!article.draft) {
        acc.set(id, article)
      }

      return acc
    }, new Map<string, CMS.Article>())

  return !!ids
    ? ids.map((id) => articlesMap.get(id))
    : Array.from(articlesMap.values()).sort(sortArticles)
}
