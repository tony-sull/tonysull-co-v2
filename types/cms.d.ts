declare namespace CMS {
  type Icon =
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
    author: string
    social: {
      twitter_card: string
      twitter_url: string
      github_url: string
    }
  }

  type AuthorId = string
  interface Author {
    slug: AuthorId
    first_name: string
    last_name: string
    url: string
    twitter_handle: string
  }

  interface Image {
    src: string
    alt: string
  }

  type TagSlug = string
  interface Tag {
    slug: TagSlug
    title: string
  }

  type ArticleSlug = string
  type TwitterPostId = string
  interface Article {
    slug: ArticleSlug
    title: string
    description: string
    author: AuthorId
    image: Image
    tags: TagSlug[]
    published_date: Date
    modified_date?: Date
    twitter_id?: TwitterPostId
    canonical_url?: string
  }

  type EntityContent = Article

  type EntityType = "article" | "note" | "image" | "audio" | "video"

  type EntityId = string

  interface ArticleEntity {
    id: EntityId
    type: "article"
    properties: Article
  }

  interface NoteEntity {
    id: EntityId
    type: "note"
    properties: {}
  }

  interface ImageEntity {
    id: EntityId
    type: "image"
    properties: {}
  }

  interface AudioEntity {
    id: EntityId
    type: "audio"
    properties: {}
  }

  interface VideoEntity {
    id: EntityId
    type: "video"
    properties: {}
  }

  type Entity =
    | ArticleEntity
    | NoteEntity
    | ImageEntity
    | AudioEntity
    | VideoEntity
}
