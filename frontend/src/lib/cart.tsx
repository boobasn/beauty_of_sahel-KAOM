import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { CartContext, type CartLine, type CartState } from './cartContext'
import { useCatalog } from './catalogContext'

// Le panier et les favoris sont gardés dans le navigateur de la cliente.
const CART_KEY = 'kaom.cart'
const WISH_KEY = 'kaom.wishlist'

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function store(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // stockage indisponible (navigation privée) : le panier reste en mémoire
  }
}

const same = (a: CartLine, b: CartLine) => a.slug === b.slug && a.size === b.size && a.color === b.color

export function CartProvider({ children }: { children: ReactNode }) {
  const { findProduct } = useCatalog()
  const [raw, setRaw] = useState<CartLine[]>(() => readStored(CART_KEY, []))
  const [wishlist, setWishlist] = useState<string[]>(() => readStored(WISH_KEY, []))
  const [open, setOpen] = useState(false)

  useEffect(() => store(CART_KEY, raw), [raw])
  useEffect(() => store(WISH_KEY, wishlist), [wishlist])

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
          const i = prev.findIndex((l) => same(l, { ...line, qty }))
          if (i === -1) return [...prev, { ...line, qty }]
          return prev.map((l, j) => (j === i ? { ...l, qty: Math.min(20, l.qty + qty) } : l))
        })
        setOpen(true)
      },
      setQty: (index, qty) => {
        const target = lines[index]
        setRaw((prev) => prev.map((l) => (same(l, target) ? { ...l, qty: Math.max(1, Math.min(20, qty)) } : l)))
      },
      remove: (index) => {
        const target = lines[index]
        setRaw((prev) => prev.filter((l) => !same(l, target)))
      },
      clear: () => setRaw([]),
      wishlist,
      toggleWish: (slug) =>
        setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug])),
    }
  }, [raw, open, wishlist, findProduct])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
