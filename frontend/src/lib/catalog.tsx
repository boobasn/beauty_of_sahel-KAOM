import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api } from '../api/client'
import type { Collection, Product, Settings } from '../api/types'
import { CatalogContext, type CatalogState } from './catalogContext'

/** Charge une fois le catalogue public (collections, articles, réglages de la boutique). */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<CatalogState['status']>('loading')
  const [error, setError] = useState<string | null>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    Promise.all([api.collections(), api.products(), api.settings()])
      .then(([c, p, s]) => {
        if (cancelled) return
        setCollections(c)
        setProducts(p)
        setSettings(s)
        setStatus('ready')
      })
      .catch((e: Error) => {
        if (cancelled) return
        setError(e.message)
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [version])

  const reload = useCallback(() => {
    setStatus('loading')
    setVersion((v) => v + 1)
  }, [])

  const value = useMemo<CatalogState>(
    () => ({
      status,
      error,
      collections,
      products,
      settings,
      reload,
      findProduct: (slug) => products.find((p) => p.slug === slug),
      findCollection: (slug) => collections.find((c) => c.slug === slug),
    }),
    [status, error, collections, products, settings, reload],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}
