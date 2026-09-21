const ALLOWED_DOMAINS = [
  /^https?:\/\/(www\.)?youtube\.com\/watch\?.*v=[\w-]{11}/,
  /^https?:\/\/youtu\.be\/[\w-]{11}/,
  /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]{11}/,
  /^https?:\/\/(www\.)?vimeo\.com\/\d+/,
  /^https?:\/\/(www\.)?dailymotion\.com\/video\//,
]

export function isValidVideoUrl(url) {
  if (!url || typeof url !== 'string') return false
  try {
    new URL(url)
  } catch {
    return false
  }
  return ALLOWED_DOMAINS.some((pattern) => pattern.test(url))
}

export function extractVideoId(url) {
  if (!url || typeof url !== 'string') return null
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}
