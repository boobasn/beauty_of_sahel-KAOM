import { demoCollections, demoProducts, demoSettings } from './demoData'
import type {
  Collection,
  CollectionInput,
  CustomerRequest,
  Dashboard,
  Product,
  ProductInput,
  RequestInput,
  RequestStatus,
  Session,
  Settings,
} from './types'

/** Adresse de l'API. Vide = même domaine (nginx ou proxy Vite redirige /api). */
const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

/** Mode démo : aucune API, données locales en mémoire (GitHub Pages). */
export const DEMO = import.meta.env.VITE_DEMO === 'true'

export class ApiError extends Error {
  status: number
  fields: Record<string, string>
  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message)
    this.status = status
    this.fields = fields
  }
}

/** Les photos sont servies par l'API sous /uploads. */
export const assetUrl = (url: string) => (url.startsWith('/uploads/') ? `${API_URL}${url}` : url)

let token: string | null = null
let onUnauthorized: (() => void) | null = null

export function setToken(value: string | null) {
  token = value
}

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  if (token && path.startsWith('/api/admin')) headers.set('Authorization', `Bearer ${token}`)

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers })
  } catch {
    throw new ApiError(0, 'Connexion impossible. Vérifiez votre réseau et réessayez.')
  }
  if (res.status === 401 && path.startsWith('/api/admin')) onUnauthorized?.()
  if (!res.ok) {
    let message = 'Une erreur est survenue. Réessayez dans un instant.'
    let fields: Record<string, string> = {}
    try {
      const problem = await res.json()
      if (problem.detail) message = problem.detail
      if (problem.errors) fields = problem.errors
    } catch {
      // réponse sans corps JSON
    }
    throw new ApiError(res.status, message, fields)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

const json = (body: unknown) => JSON.stringify(body)

// ---------------------------------------------------------------------------
// Magasin en mémoire pour le mode démo
// ---------------------------------------------------------------------------
// Les modifications de la démo sont gardées dans le navigateur (localStorage) : elles
// survivent au rechargement et aux autres onglets, mais restent propres à ce navigateur.
const DEMO_KEY = 'kaom.demo.v1'
type DemoStore = {
  collections: Collection[]
  products: Product[]
  requests: CustomerRequest[]
  subscribers: number
  nextId: number
}
const freshDemo = (): DemoStore => ({
  collections: structuredClone(demoCollections),
  products: structuredClone(demoProducts),
  requests: [],
  subscribers: 0,
  nextId: 100,
})
function loadDemo(): DemoStore {
  if (!DEMO) return freshDemo()
  try {
    const raw = localStorage.getItem(DEMO_KEY)
    return raw ? { ...freshDemo(), ...(JSON.parse(raw) as DemoStore) } : freshDemo()
  } catch {
    return freshDemo()
  }
}
let demo = loadDemo()
const later = <T,>(value: T) => new Promise<T>((r) => setTimeout(() => r(structuredClone(value)), 150))
/** Enregistre la démo puis répond, comme le ferait l'API. */
const saved = <T,>(value: T) => {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(demo))
  } catch {
    return Promise.reject(
      new ApiError(507, 'Stockage de la démo plein : retirez des photos ou réinitialisez la démo.'),
    )
  }
  return later(value)
}

/** Remet la démo à zéro (catalogue d'exemple). */
export function resetDemo() {
  try {
    localStorage.removeItem(DEMO_KEY)
  } catch {
    // stockage indisponible
  }
  demo = freshDemo()
}

/** Réduit une photo (1000 px, JPEG) pour qu'elle tienne dans le stockage du navigateur. */
async function compressImage(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new ApiError(400, 'Format accepté : JPG, PNG ou WebP')
  }
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.78)
}
const slugify = (s: string) =>
  s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'article'
const visible = () =>
  demo.products.filter(
    (p) => p.status === 'PUBLISHED' && (!p.collection || demo.collections.find((c) => c.slug === p.collection)?.published),
  )
const withCounts = (list: Collection[], products: Product[]) =>
  list.map((c) => ({ ...c, productCount: products.filter((p) => p.collection === c.slug).length }))
const toProduct = (input: ProductInput, base?: Product): Product => ({
  ...(base ?? { id: demo.nextId++, images: [] }),
  ...input,
  slug: input.slug || base?.slug || slugify(input.name),
  oldPrice: input.oldPrice && input.oldPrice > input.price ? input.oldPrice : null,
  badge: input.badge || null,
  fabric: input.fabric || null,
  description: input.description || null,
  collectionName: demo.collections.find((c) => c.slug === input.collection)?.name ?? null,
})
const notFound = () => Promise.reject(new ApiError(404, 'Introuvable'))

// ---------------------------------------------------------------------------
// API publique
// ---------------------------------------------------------------------------
export const api = {
  settings: (): Promise<Settings> => (DEMO ? later(demoSettings) : request('/api/settings')),

  collections: (): Promise<Collection[]> =>
    DEMO ? later(withCounts(demo.collections.filter((c) => c.published), visible())) : request('/api/collections'),

  products: (): Promise<Product[]> => (DEMO ? later(visible()) : request('/api/products')),

  product: (slug: string): Promise<Product> => {
    if (!DEMO) return request(`/api/products/${encodeURIComponent(slug)}`)
    const p = visible().find((x) => x.slug === slug)
    return p ? later(p) : notFound()
  },

  createRequest: (input: RequestInput): Promise<CustomerRequest> => {
    if (!DEMO) return request('/api/requests', { method: 'POST', body: json(input) })
    const lines = (input.items ?? []).map((i) => {
      const p = demo.products.find((x) => x.slug === i.slug)!
      return { text: `${i.qty} × ${p.name}, ${i.color}, taille ${i.size}`, total: p.price * i.qty }
    })
    const r: CustomerRequest = {
      id: demo.nextId++, type: input.type, status: 'NEW', customerName: input.customerName, phone: input.phone,
      email: input.email ?? null, message: input.message ?? null, items: lines.map((l) => l.text).join('\n') || null,
      total: lines.reduce((n, l) => n + l.total, 0), createdAt: new Date().toISOString(),
    }
    demo.requests.unshift(r)
    return saved(r)
  },

  subscribe: (email: string): Promise<void> => {
    if (!DEMO) return request('/api/newsletter', { method: 'POST', body: json({ email }) })
    demo.subscribers++
    return saved(undefined)
  },

  login: (email: string, password: string): Promise<Session> => {
    if (!DEMO) return request('/api/auth/login', { method: 'POST', body: json({ email, password }) })
    if (!email || password.length < 4) return Promise.reject(new ApiError(401, 'E-mail ou mot de passe incorrect'))
    return saved({ token: 'demo', expiresAt: new Date(Date.now() + 864e5).toISOString(), email, name: 'Démo' })
  },
}

// ---------------------------------------------------------------------------
// API du backoffice (jeton requis)
// ---------------------------------------------------------------------------
export const admin = {
  dashboard: (): Promise<Dashboard> =>
    DEMO
      ? later({
          productsPublished: demo.products.filter((p) => p.status === 'PUBLISHED').length,
          productsTotal: demo.products.length,
          lowStock: demo.products.filter((p) => p.stock <= 2).length,
          collections: demo.collections.length,
          requestsNew: demo.requests.filter((r) => r.status === 'NEW').length,
          requestsThisWeek: demo.requests.length,
          subscribers: demo.subscribers,
        })
      : request('/api/admin/dashboard'),

  products: (): Promise<Product[]> => (DEMO ? later(demo.products) : request('/api/admin/products')),

  createProduct: (input: ProductInput): Promise<Product> => {
    if (!DEMO) return request('/api/admin/products', { method: 'POST', body: json(input) })
    const p = toProduct(input)
    demo.products.unshift(p)
    return saved(p)
  },

  updateProduct: (id: number, input: ProductInput): Promise<Product> => {
    if (!DEMO) return request(`/api/admin/products/${id}`, { method: 'PUT', body: json(input) })
    const i = demo.products.findIndex((p) => p.id === id)
    demo.products[i] = toProduct(input, demo.products[i])
    return saved(demo.products[i])
  },

  deleteProduct: (id: number): Promise<void> => {
    if (!DEMO) return request(`/api/admin/products/${id}`, { method: 'DELETE' })
    demo.products = demo.products.filter((p) => p.id !== id)
    return saved(undefined)
  },

  uploadImages: async (id: number, files: File[]): Promise<Product> => {
    if (!DEMO) {
      const form = new FormData()
      files.forEach((f) => form.append('files', f))
      return request(`/api/admin/products/${id}/images`, { method: 'POST', body: form })
    }
    const p = demo.products.find((x) => x.id === id)!
    if (p.images.length + files.length > 8) throw new ApiError(400, '8 photos maximum par article')
    const urls = await Promise.all(files.map(compressImage))
    urls.forEach((url) => p.images.push({ id: demo.nextId++, url, alt: p.name }))
    return saved(p).catch((e) => {
      p.images = p.images.filter((i) => !urls.includes(i.url))
      throw e
    })
  },

  deleteImage: (id: number, imageId: number): Promise<Product> => {
    if (!DEMO) return request(`/api/admin/products/${id}/images/${imageId}`, { method: 'DELETE' })
    const p = demo.products.find((x) => x.id === id)!
    p.images = p.images.filter((i) => i.id !== imageId)
    return saved(p)
  },

  collections: (): Promise<Collection[]> =>
    DEMO ? later(withCounts(demo.collections, demo.products)) : request('/api/admin/collections'),

  createCollection: (input: CollectionInput): Promise<Collection> => {
    if (!DEMO) return request('/api/admin/collections', { method: 'POST', body: json(input) })
    const col: Collection = { ...input, id: demo.nextId++, slug: input.slug || slugify(input.name), coverUrl: null, productCount: 0 }
    demo.collections.push(col)
    return saved(col)
  },

  updateCollection: (id: number, input: CollectionInput): Promise<Collection> => {
    if (!DEMO) return request(`/api/admin/collections/${id}`, { method: 'PUT', body: json(input) })
    const i = demo.collections.findIndex((x) => x.id === id)
    demo.collections[i] = { ...demo.collections[i], ...input, slug: input.slug || demo.collections[i].slug }
    return saved(demo.collections[i])
  },

  deleteCollection: (id: number): Promise<void> => {
    if (!DEMO) return request(`/api/admin/collections/${id}`, { method: 'DELETE' })
    const col = demo.collections.find((x) => x.id === id)!
    if (demo.products.some((p) => p.collection === col.slug)) {
      return Promise.reject(new ApiError(409, "Déplacez ou supprimez d'abord les articles de cette collection"))
    }
    demo.collections = demo.collections.filter((x) => x.id !== id)
    return saved(undefined)
  },

  uploadCover: (id: number, file: File): Promise<Collection> => {
    if (!DEMO) {
      const form = new FormData()
      form.append('file', file)
      return request(`/api/admin/collections/${id}/cover`, { method: 'POST', body: form })
    }
    const col = demo.collections.find((x) => x.id === id)!
    return compressImage(file).then((url) => {
      col.coverUrl = url
      return saved(col)
    })
  },

  requests: (): Promise<CustomerRequest[]> => (DEMO ? later(demo.requests) : request('/api/admin/requests')),

  updateRequest: (id: number, status: RequestStatus): Promise<CustomerRequest> => {
    if (!DEMO) return request(`/api/admin/requests/${id}`, { method: 'PATCH', body: json({ status }) })
    const r = demo.requests.find((x) => x.id === id)!
    r.status = status
    return saved(r)
  },

  subscribers: (): Promise<{ email: string; createdAt: string }[]> =>
    DEMO ? later([]) : request('/api/admin/newsletter'),

  deleteRequest: (id: number): Promise<void> => {
    if (!DEMO) return request(`/api/admin/requests/${id}`, { method: 'DELETE' })
    demo.requests = demo.requests.filter((x) => x.id !== id)
    return saved(undefined)
  },
}
