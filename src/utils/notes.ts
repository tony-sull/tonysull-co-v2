import path from 'path'
import type { MarkdownInstance } from 'astro'

export type NoteSlug = string
export interface Note {
  slug: NoteSlug
  title: string
  date: Date | string
  tags: string[]
  link?: string
  twitter_id?: string
  Content: MarkdownInstance<Note>['Content']
}

function parseData(data: MarkdownInstance<Note>): { id: string; note: Note } {
  const { file, frontmatter: note, Content } = data
  const id = path.basename(file).replace(path.extname(file), '')
  return {
    id,
    note: {
      ...note,
      Content,
    },
  }
}

function sortNotes(a: Note, b: Note) {
  const aDate = new Date(a.date)
  const bDate = new Date(b.date)
  return bDate.getTime() - aDate.getTime()
}

export function getNotes(allNotes: MarkdownInstance<Note>[], ids?: NoteSlug[]) {
  const notesMap = allNotes.map(parseData).reduce((acc, { id, note }) => {
    acc.set(id, note)

    return acc
  }, new Map<string, Note>())

  return !!ids
    ? (ids.map(id => notesMap.get(id)).filter(Boolean) as Note[])
    : Array.from(notesMap.values()).filter(Boolean).sort(sortNotes)
}
