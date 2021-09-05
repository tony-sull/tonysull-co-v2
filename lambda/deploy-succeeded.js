import Twitter from "twitter"
import { decode } from "html-entities"
import Parser from "rss-parser"
import site from "../src/data/site.json"

// URL of notes RSS feed
const NOTES_URL = `${site.url}${site.rss.notes}`

// Configure Twitter API Client
const twitter = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
})

// Configure RSS parser
const parser = new Parser({
  customFields: {
    item: ["content"],
  },
})

// Helper function to return unknown errors
const handleError = (err) => {
  console.error(err)
  const msg = Array.isArray(err) ? err[0].message : err.message
  return status(422, String(msg))
}

// Helper function to return function status
const status = (code, msg) => {
  console.log(msg)
  return {
    statusCode: code,
    body: msg,
  }
}

// Check existing notes
const processNotes = async (notes) => {
  if (!notes.length) {
    return status(404, "No notes found to process.")
  }

  // assume the last note is not yet syndicated
  const latestNote = notes[0]

  try {
    // the RSS feed item's ID is either the post slug or
    // twitter post ID. Twitter post IDs don't contain hyphens,
    // if one isn't found assume it hasn't been posted yet
    if (latestNote.id.indexOf("-") < 0) {
      return publishNote(latestNote)
    } else {
      return status(400, "Latest note was already syndicated. No action taken.")
    }
  } catch (err) {
    return handleError(err)
  }
}

// Prepare the content string for tweet format
const prepareStatusText = (note) => {
  const tags = note.categories.map((tag) => `#${tag}`).join(" ")

  const maxLength = 280 - 23 - 2 - tags.length - 2

  // strip html tag and decode entities
  let text = note.content.trim().replace(/<[^>]+>/g, "")
  text = decode(text)

  // truncate note text if its too long for a tweet.
  if (text.length > maxLength) {
    text = text.substring(0, maxLength - 3) + "..."
  }

  // include the hashtags
  if (tags.length) {
    text += "\n\n" + tags
  }

  // include the note url at the end
  text += "\n\n" + note.link

  // if it has a link, let that be the last url
  // so twitter picks it up for the preview
  // if (note.link && note.link.length) {
  //  text += " " + note.link
  // }

  return text
}

// Push a new note to Twitter
const publishNote = async (note) => {
  try {
    const statusText = prepareStatusText(note)

    const tweet = await twitter.post("statuses/update", {
      status: statusText,
    })

    if (tweet) {
      return status(200, `Note ${note.title} successfully posted to Twitter.`)
    } else {
      return status(422, "Error posting to Twitter API.")
    }
  } catch (err) {
    return handleError(err)
  }
}

// main lambda function handler
exports.handler = async () => {
  try {
    // Fetch the list of published notes to work on,
    // then process them to check if an action is necessary
    const feed = await parser.parseURL(NOTES_URL)
    return await processNotes(feed.items)
  } catch (err) {
    return handleError(err)
  }
}
