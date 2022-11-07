import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import site from '@data/site.json'
import { fetchArticles } from '@utils/api.js'
import { isoDate } from '@utils/dates.js'
import { identifierToSlug } from '@utils/slugs.js'

export const get: APIRoute = async () => {
  const allArticles = await fetchArticles('articles')

  return rss({
    title: `Articles • ${site.title}`,
    description: site.description,
    site: import.meta.env.SITE,
    customData: `<language>en-us</language><author><name>${
      site.title
    }</name></author><id>${site.url}${site.rss.articles}</id><updated>${isoDate(
      new Date()
    )}</updated>`,
    items: allArticles.map(article => {
      const slug = identifierToSlug(article.identifier!.toString())

      return {
        title: article.name!.toString(),
        description: article.description!.toString(),
        link: `/articles/${slug}/`,
        pubDate: new Date(article.datePublished!.toString()),
        customData: `<id>${slug}</id><updated>${isoDate(
          article.dateModified?.toString() || article.datePublished!.toString()
        )}</updated>`,
      }
    }),
  })
}
