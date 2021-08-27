import { calculateReadingTime } from "markdown-reading-time"

export function readMinutes(md) {
  const { minutes } = calculateReadingTime(md)

  return minutes
}
