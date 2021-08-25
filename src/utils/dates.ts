import { format } from "fecha"

function safeDate(date: Date | string) {
  return date instanceof Date ? date : new Date(date)
}

export function shortDate(date: Date | string) {
  return format(safeDate(date), "D MMM YYYY")
}

export function isoDate(date: Date | string) {
  return safeDate(date).toISOString()
}
