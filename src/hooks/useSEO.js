import { useEffect } from 'react'

export function useSEO({ title, description, canonical }) {
  useEffect(() => {
    if (title) document.title = title
    if (description) {
      let el = document.querySelector('meta[name="description"]')
      if (el) el.setAttribute('content', description)
    }
    if (canonical) {
      let el = document.querySelector('link[rel="canonical"]')
      if (el) el.setAttribute('href', canonical)
    }
  }, [title, description, canonical])
}
