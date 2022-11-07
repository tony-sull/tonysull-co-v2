import fetch from 'node-fetch'
import type { Article, Graph, Periodical, Thing } from 'schema-dts'

const API_ROOT = 'https://api.tonysull.co'

async function fetchContent<T extends Thing>(slug: string, type: string) {
  const url = new URL(`/${type}/${slug}.jsonld`, API_ROOT)
  const res = await fetch(url.toString())
  return (await res.json()) as T
}

export async function fetchArticle(slug: string) {
  return await fetchContent<Article>(slug, 'Article')
}

export async function fetchArticles(periodicalSlug: string, slugs?: string[]) {
  if (slugs?.length) {
    return await Promise.all(slugs.map(slug => fetchArticle(slug)))
  }

  const periodical = await fetchPeriodical(periodicalSlug)
  return periodical['@graph'] as Article[]
}

export async function fetchPeriodical(slug: string) {
  return await fetchContent<Graph & Periodical>(slug, 'Periodical')
}
