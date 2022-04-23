import path from "path"
import type { MarkdownInstance } from 'astro'
import { CMS } from "../../types/cms";

function parseData(data: MarkdownInstance<CMS.Note>): { id: string; note: CMS.Note } {
  const { file, frontmatter: note, Content } = data
  const id = path
    .basename(file)
    .replace(path.extname(file), "")
  return {
    id,
    note: {
      ...note,
      Content
    },
  }
}

function sortNotes(a: CMS.Note, b: CMS.Note) {
  const aDate = new Date(a.date)
  const bDate = new Date(b.date)
  return bDate.getTime() - aDate.getTime()
}

export function getNotes(allNotes: MarkdownInstance<CMS.Note>[], ids?: CMS.NoteSlug[]) {
  const notesMap = allNotes.map(parseData).reduce((acc, { id, note }) => {
    acc.set(id, note)

    return acc
  }, new Map<string, CMS.Note>())

  return !!ids
    ? ids.map((id) => notesMap.get(id))
    : Array.from(notesMap.values()).sort(sortNotes)
}
