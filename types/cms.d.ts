declare namespace CMS {
  type Icon =
    | "arrow-right"
    | "at"
    | "book"
    | "bookmark"
    | "comment"
    | "github"
    | "heart"
    | "home"
    | "moon"
    | "refresh"
    | "roller"
    | "rss"
    | "sun"
    | "twitter"

  type Markdown = string

  interface Navigation {
    main: [
      {
        title: string
        href: string
        icon: Icon
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
  }

  type NoteSlug = string
  interface Note {
    slug: NoteSlug
    title: string
    date: Date | string
    tags: string[]
    link?: string
    twitter_id?: TwitterPostId
    content: Markdown
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
