import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import site from '@data/site.json'
import { fetchArticles } from '@utils/api.js'
import { isoDate } from '@utils/dates.js'
import { identifierToSlug } from '@utils/slugs.js'

export const get: APIRoute = async () => {
    const allNotes = await fetchArticles('notes')

  return rss({
    title: `Notes • ${site.title}`,
    site: import.meta.env.SITE,
    description: site.description,
    customData: `<language>en-us</language><author><name>${
      site.title
    }</name></author><id>${site.url}${site.rss.notes}</id><updated>${isoDate(
      new Date()
    )}</updated>`,
    items: allNotes.map(
        (note) => {
            const slug = identifierToSlug(note.identifier!.toString())
            const date = note.datePublished!.toString()
            const tags = (note.keywords?.toString() || '').split(',').filter(Boolean)
          return {
            title: note.name!.toString(),
            link: `/notes/${slug}/`,
            pubDate: new Date(date),
            customData: `<id>${slug}</id><updated>${isoDate(
              date
            )}</updated>${tags
              .map((tag) => `<category>${tag}</category>`)
              .join("")}`,
          }
        }
      ),
  })
}