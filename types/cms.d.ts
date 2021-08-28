declare namespace CMS {
  type Icon =
    | "arrow-right"
    | "at"
    | "book"
    | "bookmark"
    | "github"
    | "home"
    | "moon"
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

    type Block = HeroBlock | ArticlesBlock
  }
}
