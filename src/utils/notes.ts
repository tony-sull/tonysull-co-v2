import path from "path"

interface NoteData extends CMS.Note {
  astro: any
  file: URL
  url: string
}

function parseData(data: NoteData): { id: string; note: CMS.Note } {
  const { astro, file, url, ...note } = data
  const id = path
    .basename(file.pathname)
    .replace(path.extname(file.pathname), "")
  return {
    id,
    note: {
      ...note,
      content: astro.source,
      slug: id,
    },
  }
}

function sortNotes(a: CMS.Note, b: CMS.Note) {
  const aDate = new Date(a.date)
  const bDate = new Date(b.date)
  return bDate.getTime() - aDate.getTime()
}

export function getNotes(allNotes: NoteData[], ids?: CMS.NoteSlug[]) {
  const notesMap = allNotes.map(parseData).reduce((acc, { id, note }) => {
    acc.set(id, note)

    return acc
  }, new Map<string, CMS.Note>())

  return !!ids
    ? ids.map((id) => notesMap.get(id))
    : Array.from(notesMap.values()).sort(sortNotes)
}
