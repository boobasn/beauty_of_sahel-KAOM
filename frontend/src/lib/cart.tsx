import { useMemo, useState, type ReactNode } from 'react'
import { findProduct } from '../data/catalog'
import { CartContext, type CartLine, type CartState } from './cartContext'

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([
    { slug: 'robe-tiaya', size: 'M', color: 'Sable', qty: 1 },
  ])
  const [open, setOpen] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>(['veste-bogolan'])

  const value = useMemo<CartState>(() => {
    const lines = raw.flatMap((l) => {
      const product = findProduct(l.slug)
      return product ? [{ ...l, product }] : []
    })
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.qty * l.product.price, 0),
      open,
      setOpen,
      add: (line, qty = 1) => {
        setRaw((prev) => {
          const i = prev.findIndex((l) => l.slug === line.slug && l.size === line.size && l.color === line.color)
          if (i === -1) return [...prev, { ...line, qty }]
          return prev.map((l, j) => (j === i ? { ...l, qty: l.qty + qty } : l))
        })
        setOpen(true)
      },
      setQty: (index, qty) =>
        setRaw((prev) => prev.map((l, j) => (j === index ? { ...l, qty: Math.max(1, qty) } : l))),
      remove: (index) => setRaw((prev) => prev.filter((_, j) => j !== index)),
      wishlist,
      toggleWish: (slug) =>
        setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug])),
    }
  }, [raw, open, wishlist])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

