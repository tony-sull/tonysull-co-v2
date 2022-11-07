import type { MarkdownInstance } from 'astro'

declare module CMS {
  type Markdown = string

  interface Navigation {
    main: [
      {
        title: string
        href: string
      }
    ]
  }

  interface Site {
    title: string
    description: string
    url: string
    domain: string
    social: {
      twitter_card: string
      twitter_url: string
      github_url: string
    }
  }

  interface Image {
    src: string
    alt: string
  }

  type ArticleSlug = string
  type TwitterPostId = string
  interface Article {
    slug: ArticleSlug
    title: string
    description: string
    image: Image
    category: string
    draft?: boolean
    published_date: Date | string
    modified_date?: Date | string
    twitter_id?: TwitterPostId
    canonical_url?: string
    Content: MarkdownInstance<Article>['Content']
  }

  type NoteSlug = string
  interface Note {
    slug: NoteSlug
    title: string
    date: Date | string
    tags: string[]
    link?: string
    twitter_id?: TwitterPostId
    Content: MarkdownInstance<Note>['Content']
  }

  namespace UI {
    interface CTA {
      title: string
      url: string
    }

    interface HeroBlock {
      type: "hero"
      title: string
      content: Markdown
      cta: CTA
    }

    interface ArticlesBlock {
      type: "articles"
      title: string
      ids: ArticleSlug[] | undefined
    }

    interface NotesBlock {
      type: "notes"
      title: string
      ids: NoteSlug[] | undefined
    }

    type Block = HeroBlock | ArticlesBlock | NotesBlock
  }
}
