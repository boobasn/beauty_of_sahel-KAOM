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
const demo = {
  collections: structuredClone(demoCollections),
  products: structuredClone(demoProducts),
  requests: [] as CustomerRequest[],
  subscribers: 0,
  nextId: 100,
}
const later = <T,>(value: T) => new Promise<T>((r) => setTimeout(() => r(structuredClone(value)), 150))
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
    return later(r)
  },

  subscribe: (email: string): Promise<void> => {
    if (!DEMO) return request('/api/newsletter', { method: 'POST', body: json({ email }) })
    demo.subscribers++
    return later(undefined)
  },

  login: (email: string, password: string): Promise<Session> => {
    if (!DEMO) return request('/api/auth/login', { method: 'POST', body: json({ email, password }) })
    if (!email || password.length < 4) return Promise.reject(new ApiError(401, 'E-mail ou mot de passe incorrect'))
    return later({ token: 'demo', expiresAt: new Date(Date.now() + 864e5).toISOString(), email, name: 'Démo' })
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
    return later(p)
  },

  updateProduct: (id: number, input: ProductInput): Promise<Product> => {
    if (!DEMO) return request(`/api/admin/products/${id}`, { method: 'PUT', body: json(input) })
    const i = demo.products.findIndex((p) => p.id === id)
    demo.products[i] = toProduct(input, demo.products[i])
    return later(demo.products[i])
  },

  deleteProduct: (id: number): Promise<void> => {
    if (!DEMO) return request(`/api/admin/products/${id}`, { method: 'DELETE' })
    demo.products = demo.products.filter((p) => p.id !== id)
    return later(undefined)
  },

  uploadImages: (id: number, files: File[]): Promise<Product> => {
    if (!DEMO) {
      const form = new FormData()
      files.forEach((f) => form.append('files', f))
      return request(`/api/admin/products/${id}/images`, { method: 'POST', body: form })
    }
    const p = demo.products.find((x) => x.id === id)!
    files.forEach((f) => p.images.push({ id: demo.nextId++, url: URL.createObjectURL(f), alt: p.name }))
    return later(p)
  },

  deleteImage: (id: number, imageId: number): Promise<Product> => {
    if (!DEMO) return request(`/api/admin/products/${id}/images/${imageId}`, { method: 'DELETE' })
    const p = demo.products.find((x) => x.id === id)!
    p.images = p.images.filter((i) => i.id !== imageId)
    return later(p)
  },

  collections: (): Promise<Collection[]> =>
    DEMO ? later(withCounts(demo.collections, demo.products)) : request('/api/admin/collections'),

  createCollection: (input: CollectionInput): Promise<Collection> => {
    if (!DEMO) return request('/api/admin/collections', { method: 'POST', body: json(input) })
    const col: Collection = { ...input, id: demo.nextId++, slug: input.slug || slugify(input.name), coverUrl: null, productCount: 0 }
    demo.collections.push(col)
    return later(col)
  },

  updateCollection: (id: number, input: CollectionInput): Promise<Collection> => {
    if (!DEMO) return request(`/api/admin/collections/${id}`, { method: 'PUT', body: json(input) })
    const i = demo.collections.findIndex((x) => x.id === id)
    demo.collections[i] = { ...demo.collections[i], ...input, slug: input.slug || demo.collections[i].slug }
    return later(demo.collections[i])
  },

  deleteCollection: (id: number): Promise<void> => {
    if (!DEMO) return request(`/api/admin/collections/${id}`, { method: 'DELETE' })
    const col = demo.collections.find((x) => x.id === id)!
    if (demo.products.some((p) => p.collection === col.slug)) {
      return Promise.reject(new ApiError(409, "Déplacez ou supprimez d'abord les articles de cette collection"))
    }
    demo.collections = demo.collections.filter((x) => x.id !== id)
    return later(undefined)
  },

  uploadCover: (id: number, file: File): Promise<Collection> => {
    if (!DEMO) {
      const form = new FormData()
      form.append('file', file)
      return request(`/api/admin/collections/${id}/cover`, { method: 'POST', body: form })
    }
    const col = demo.collections.find((x) => x.id === id)!
    col.coverUrl = URL.createObjectURL(file)
    return later(col)
  },

  requests: (): Promise<CustomerRequest[]> => (DEMO ? later(demo.requests) : request('/api/admin/requests')),

  updateRequest: (id: number, status: RequestStatus): Promise<CustomerRequest> => {
    if (!DEMO) return request(`/api/admin/requests/${id}`, { method: 'PATCH', body: json({ status }) })
    const r = demo.requests.find((x) => x.id === id)!
    r.status = status
    return later(r)
  },

  subscribers: (): Promise<{ email: string; createdAt: string }[]> =>
    DEMO ? later([]) : request('/api/admin/newsletter'),

  deleteRequest: (id: number): Promise<void> => {
    if (!DEMO) return request(`/api/admin/requests/${id}`, { method: 'DELETE' })
    demo.requests = demo.requests.filter((x) => x.id !== id)
    return later(undefined)
  },
}
