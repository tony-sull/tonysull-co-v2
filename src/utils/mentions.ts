import fs from "fs"
import unionBy from "lodash/unionBy"
import site from "../data/site.json"

interface WebMention {
  published: string | Date
  "wm-id": string
}

interface WebMentionResponse {
  children: WebMention[]
}

const domain = new URL(site.url).hostname

// Define cache location and API endpoint
const CACHE_FILE_PATH = "_cache/webmentions.json"
const API = "https://webmention.io/api"
const TOKEN = import.meta.env.WEBMENTION_IO_TOKEN

async function fetchWebmentions(since, perPage = 1000) {
  // If we don't have a domain name or token, abort
  if (!domain || !TOKEN) {
    console.warn(">>> unable to fetch webmentions: missing domain or token")
    return false
  }

  let url = `${API}/mentions.jf2?domain=${domain}&token=${TOKEN}&per-page=${perPage}`
  if (since) url += `&since=${since}`

  const response = await fetch(url)
  if (response.ok) {
    const feed = (await response.json()) as WebMentionResponse
    console.log(`>>> ${feed.children.length} new webmentions fetch from ${API}`)
    return feed
  }

  return null
}

// Merge fresh webmentions with cached entires, unique per id
function mergeWebmentions(a: WebMentionResponse, b: WebMentionResponse) {
  return unionBy(a.children, b.children, "wm-id")
}

// save combined webmentions in cache file
function writeToCache(data: any) {
  const dir = "_cache"
  const fileContent = JSON.stringify(data, null, 2)

  // create cache folder if it doesn't exist already
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  // write data to cache json file
  fs.writeFile(CACHE_FILE_PATH, fileContent, (err) => {
    if (err) throw err
    console.log(`>>> webmentions cached to ${CACHE_FILE_PATH}`)
  })
}

// get cache contents from json file
function readFromCache() {
  if (fs.existsSync(CACHE_FILE_PATH)) {
    const cacheFile = fs.readFileSync(CACHE_FILE_PATH, 'utf-8')
    return JSON.parse(cacheFile)
  }

  // no cache found
  return {
    lastFetched: null,
    children: [],
  }
}

async function _getAllMentions() {
  const cache = readFromCache()
  console.log(">>> Reading webmentions from cache ...")

  if (cache.children.length) {
    console.log(`>>> ${cache.children.length} webmentions loaded from cache`)
  }

  // Only fetch new mentions when TOKEN is set, usually disabled in dev
  if (TOKEN) {
    console.log(">>> Checking for new webmentions ...")
    const feed = await fetchWebmentions(cache.lastFetched)
    if (feed) {
      const webmentions = {
        lastFetched: new Date().toISOString(),
        children: mergeWebmentions(cache, feed),
      }
      writeToCache(webmentions)
      return webmentions
    }
  } else {
    console.log(
      `>>> Skipping webmentions check, WEBMENTION_IO_TOKEN not provided`
    )
  }

  return cache
}

let _mentionsPromise
export async function getAllMentions() {
  _mentionsPromise = _mentionsPromise || _getAllMentions()
  return await _mentionsPromise
}

function compareUrls(a, b) {
  return a.replace(/(\/#|\/|#)$/, "") === b.replace(/(\/#|\/|#)$/, "")
}

export function isForUrl(url) {
  return function (webmention) {
    return compareUrls(webmention["wm-target"], url)
  }
}

export function isMentionType(type) {
  return function (webmention) {
    return !!webmention[type]
  }
}

export function sortMentions(descending = false) {
  return function (a: WebMention, b: WebMention) {
    const aDate = new Date(a.published)
    const bDate = new Date(b.published)

    return descending
      ? aDate.getTime() - bDate.getTime()
      : bDate.getTime() - aDate.getTime()
  }
}

export const MENTION_TYPE = {
  Like: "like-of",
  Reply: "in-reply-to",
  Share: "repost-of",
}
