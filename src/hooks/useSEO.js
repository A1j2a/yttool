import { useEffect } from 'react'

export function useSEO({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
}) {
  useEffect(() => {
    // Title
    if (title) {
      document.title = title
    }

    // Helper to update or create meta tags
    const setMeta = (selector, attr, value) => {
      if (!value) return
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        if (selector.startsWith('meta[name=')) {
          const name = selector.match(/name="([^"]+)"/)?.[1]
          if (name) el.setAttribute('name', name)
        } else if (selector.startsWith('meta[property=')) {
          const prop = selector.match(/property="([^"]+)"/)?.[1]
          if (prop) el.setAttribute('property', prop)
        }
        document.head.appendChild(el)
      }
      el.setAttribute(attr, value)
    }

    // Description & Keywords
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[name="keywords"]', 'content', keywords)

    // OpenGraph
    setMeta('meta[property="og:title"]', 'content', ogTitle || title)
    setMeta('meta[property="og:description"]', 'content', ogDescription || description)
    if (ogImage) setMeta('meta[property="og:image"]', 'content', ogImage)
    if (canonical) setMeta('meta[property="og:url"]', 'content', canonical)

    // Twitter
    setMeta('meta[name="twitter:title"]', 'content', ogTitle || title)
    setMeta('meta[name="twitter:description"]', 'content', ogDescription || description)

    // Canonical link
    if (canonical) {
      let el = document.querySelector('link[rel="canonical"]')
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', 'canonical')
        document.head.appendChild(el)
      }
      el.setAttribute('href', canonical)
    }
  }, [title, description, keywords, canonical, ogTitle, ogDescription, ogImage])
}
