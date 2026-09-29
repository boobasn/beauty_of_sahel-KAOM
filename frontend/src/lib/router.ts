import { useEffect, useState } from 'react'

// Routage par ancre (#collections, #produit-robe-tiaya…) pour la maquette.
// Sera remplacé par react-router lors du développement complet.

export type Route =
  | { page: 'home' }
  | { page: 'collections'; collection?: string }
  | { page: 'product'; slug: string }
  | { page: 'backoffice' }

export function parseHash(hash: string): Route {
  const token = hash.replace(/^#/, '')
  if (token === 'collections') return { page: 'collections' }
  if (token.startsWith('collection-')) return { page: 'collections', collection: token.slice(11) }
  if (token.startsWith('produit-')) return { page: 'product', slug: token.slice(8) }
  if (token === 'backoffice') return { page: 'backoffice' }
  return { page: 'home' }
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))
  useEffect(() => {
    const onChange = () => {
      const next = parseHash(window.location.hash)
      setRoute(next)
      const anchor = window.location.hash.slice(1)
      if (next.page === 'home' && anchor) {
        // Ancre de section de l'accueil : on attend le rendu avant de défiler.
        requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView())
      } else {
        window.scrollTo({ top: 0 })
      }
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
