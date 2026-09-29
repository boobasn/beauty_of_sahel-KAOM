// Types alignés sur l'API Spring Boot (backend/src/main/java/com/kaom/sahel/web/dto).

export type Motif = 'bogolan' | 'indigo' | 'wax' | 'tissage' | 'bazin'
export type Tone = 'indigo' | 'henne' | 'sable' | 'nuit' | 'mil'
export type Category = 'BOUBOUS' | 'KAFTANS' | 'ENSEMBLES' | 'ROBES' | 'VESTES' | 'ACCESSOIRES'
export type Gender = 'FEMME' | 'HOMME' | 'MIXTE'
export type ProductStatus = 'PUBLISHED' | 'DRAFT'
export type RequestType = 'ORDER' | 'BESPOKE' | 'CONTACT'
export type RequestStatus = 'NEW' | 'IN_PROGRESS' | 'CONFIRMED' | 'DONE' | 'CANCELLED'

export interface Collection {
  id: number
  slug: string
  name: string
  season: string | null
  tagline: string | null
  description: string | null
  coverUrl: string | null
  motif: Motif
  tone: Tone
  featured: boolean
  position: number
  published: boolean
  productCount: number
}

export interface ProductColor {
  name: string
  hex: string
}

export interface ProductImage {
  id: number
  url: string
  alt: string | null
}

export interface Product {
  id: number
  slug: string
  name: string
  collection: string | null
  collectionName: string | null
  category: Category
  gender: Gender
  price: number
  oldPrice: number | null
  fabric: string | null
  description: string | null
  motif: Motif
  tone: Tone
  badge: string | null
  bestseller: boolean
  status: ProductStatus
  stock: number
  sizes: string[]
  colors: ProductColor[]
  images: ProductImage[]
}

export interface ProductInput {
  name: string
  slug?: string
  collection: string | null
  category: Category
  gender: Gender
  price: number
  oldPrice: number | null
  fabric: string
  description: string
  motif: Motif
  tone: Tone
  badge: string
  bestseller: boolean
  status: ProductStatus
  stock: number
  sizes: string[]
  colors: ProductColor[]
}

export interface CollectionInput {
  name: string
  slug?: string
  season: string
  tagline: string
  description: string
  motif: Motif
  tone: Tone
  featured: boolean
  position: number
  published: boolean
}

export interface Settings {
  whatsapp: string
  instagram: string
  email: string
  address: string
  freeShippingThreshold: number
}

export interface RequestItem {
  slug: string
  size: string
  color: string
  qty: number
}

export interface RequestInput {
  type: RequestType
  customerName: string
  phone: string
  email?: string
  message?: string
  items?: RequestItem[]
}

export interface CustomerRequest {
  id: number
  type: RequestType
  status: RequestStatus
  customerName: string
  phone: string
  email: string | null
  message: string | null
  items: string | null
  total: number
  createdAt: string
}

export interface Dashboard {
  productsPublished: number
  productsTotal: number
  lowStock: number
  collections: number
  requestsNew: number
  requestsThisWeek: number
  subscribers: number
}

export interface Session {
  token: string
  expiresAt: string
  email: string
  name: string | null
}

export const categoryLabels: Record<Category, string> = {
  BOUBOUS: 'Boubous',
  KAFTANS: 'Kaftans',
  ENSEMBLES: 'Ensembles',
  ROBES: 'Robes',
  VESTES: 'Vestes',
  ACCESSOIRES: 'Accessoires',
}

export const genderLabels: Record<Gender, string> = { FEMME: 'Femme', HOMME: 'Homme', MIXTE: 'Mixte' }

export const requestTypeLabels: Record<RequestType, string> = {
  ORDER: 'Commande',
  BESPOKE: 'Sur mesure',
  CONTACT: 'Contact',
}

export const requestStatusLabels: Record<RequestStatus, string> = {
  NEW: 'Nouvelle',
  IN_PROGRESS: 'En cours',
  CONFIRMED: 'Confirmée',
  DONE: 'Terminée',
  CANCELLED: 'Annulée',
}

export const motifs: Motif[] = ['bazin', 'bogolan', 'indigo', 'wax', 'tissage']
export const tones: Tone[] = ['henne', 'indigo', 'sable', 'nuit', 'mil']
export const categories = Object.keys(categoryLabels) as Category[]

export const formatPrice = (value: number) =>
  `${new Intl.NumberFormat('fr-FR').format(value).replace(/[  ]/g, ' ')} FCFA`
