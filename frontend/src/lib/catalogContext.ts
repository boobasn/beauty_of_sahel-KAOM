import { createContext, useContext } from 'react'
import type { Collection, Product, Settings } from '../api/types'

export interface CatalogState {
  status: 'loading' | 'ready' | 'error'
  error: string | null
  collections: Collection[]
  products: Product[]
  settings: Settings | null
  reload: () => void
  findProduct: (slug: string) => Product | undefined
  findCollection: (slug: string) => Collection | undefined
}

export const CatalogContext = createContext<CatalogState | null>(null)

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog doit être utilisé dans CatalogProvider')
  return ctx
}
