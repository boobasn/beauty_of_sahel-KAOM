import { createContext, useContext } from 'react'
import type { Product } from '../api/types'

export interface CartLine {
  slug: string
  size: string
  color: string
  qty: number
}

export interface CartState {
  lines: (CartLine & { product: Product })[]
  count: number
  total: number
  open: boolean
  setOpen: (open: boolean) => void
  add: (line: Omit<CartLine, 'qty'>, qty?: number) => void
  setQty: (index: number, qty: number) => void
  remove: (index: number) => void
  clear: () => void
  wishlist: string[]
  toggleWish: (slug: string) => void
}

export const CartContext = createContext<CartState | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être utilisé dans CartProvider')
  return ctx
}
