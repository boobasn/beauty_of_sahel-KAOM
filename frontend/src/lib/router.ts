import { useEffect, useState } from 'react'

// Routage par ancre (#collections, #produit-robe-tiaya, #admin…) : fonctionne sur
// n'importe quel hébergement statique, GitHub Pages compris, sans règle de réécriture.

export type Route =
  | { page: 'home' }
  | { page: 'collections'; collection?: string; promo?: boolean; category?: string }
  | { page: 'product'; slug: string }
  | { page: 'admin' }

export function parseHash(hash: string): Route {
  const token = decodeURIComponent(hash.replace(/^#/, ''))
  if (token === 'collections') return { page: 'collections' }
  if (token === 'promotions') return { page: 'collections', promo: true }
  if (token.startsWith('categorie-')) return { page: 'collections', category: token.slice(10).toUpperCase() }
  if (token.startsWith('collection-')) return { page: 'collections', collection: token.slice(11) }
  if (token.startsWith('produit-')) return { page: 'product', slug: token.slice(8) }
  if (token === 'admin' || token === 'backoffice') return { page: 'admin' }
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
