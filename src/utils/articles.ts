import path from "path"

interface ArticleData extends CMS.Article {
  astro: any
  file: URL
  url: string
}

function parseData(data: ArticleData): { id: string; article: CMS.Article } {
  const { astro, file, url, ...article } = data
  const id = path
    .basename(file.pathname)
    .replace(path.extname(file.pathname), "")
  return { id, article }
}

function sortArticles(a: CMS.Article, b: CMS.Article) {
  const aDate = new Date(a.published_date)
  const bDate = new Date(b.published_date)
  return bDate.getTime() - aDate.getTime()
}

export function getArticles(
  allArticles: ArticleData[],
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
