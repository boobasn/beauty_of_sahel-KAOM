import type { Collection, Product, Settings } from './types'

// Catalogue de démonstration, identique à backend/src/main/resources/db/demo.
// Utilisé quand le site tourne sans API (VITE_DEMO=true, ex. GitHub Pages).

const c = (id: number, slug: string, name: string, season: string, tagline: string, description: string,
  motif: Collection['motif'], tone: Collection['tone'], featured: boolean): Collection => ({
  id, slug, name, season, tagline, description, coverUrl: null, motif, tone, featured, position: id, published: true, productCount: 0,
})

export const demoCollections: Collection[] = [
  c(1, 'harmattan', 'Harmattan', 'Automne-Hiver 2026', 'Le vent sec, la lumière dorée, les silhouettes amples.',
    "Douze silhouettes taillées dans le bazin riche et le coton tissé main, aux teintes de latérite et d'indigo profond.", 'bazin', 'henne', true),
  c(2, 'fleuve', 'Fleuve', 'Printemps-Été 2026', 'Indigo profond, lin léger, lignes fluides.',
    "Une collection pensée pour la chaleur : lin, voile de coton et bleu indigo, des coupes légères pour les journées d'été.", 'indigo', 'indigo', false),
  c(3, 'ceremonie', 'Cérémonie', 'Capsule Tabaski', 'Les grands boubous brodés pour les jours de fête.',
    'Grands boubous, kaftans brodés et ensembles trois pièces, avec finitions sur mesure.', 'bogolan', 'nuit', false),
]

type Seed = Omit<Product, 'id' | 'collectionName' | 'images' | 'description'> & { description?: string }

const seeds: Seed[] = [
  { slug: 'foulard-indigo', name: 'Foulard Indigo', collection: 'fleuve', category: 'ACCESSOIRES', gender: 'MIXTE', price: 18000, oldPrice: null,
    fabric: "Voile de coton teint à l'indigo", motif: 'indigo', tone: 'indigo', badge: 'Nouveau', bestseller: false, status: 'PUBLISHED', stock: 15,
    sizes: ['Unique'], colors: [{ name: 'Indigo', hex: '#27336A' }] },
  { slug: 'grand-boubou-laterite', name: 'Grand boubou Latérite', collection: 'harmattan', category: 'BOUBOUS', gender: 'FEMME', price: 95000, oldPrice: null,
    fabric: 'Bazin riche getzner, broderie ton sur ton', motif: 'bazin', tone: 'henne', badge: 'Nouveau', bestseller: true, status: 'PUBLISHED', stock: 6,
    sizes: ['S', 'M', 'L', 'XL', 'Sur mesure'], colors: [{ name: 'Latérite', hex: '#A4532A' }, { name: 'Indigo', hex: '#27336A' }] },
  { slug: 'kaftan-nuit-de-dakar', name: 'Kaftan Nuit de Dakar', collection: 'ceremonie', category: 'KAFTANS', gender: 'HOMME', price: 66000, oldPrice: 78000,
    fabric: 'Popeline de coton, broderie main au col', motif: 'bogolan', tone: 'nuit', badge: null, bestseller: true, status: 'PUBLISHED', stock: 9,
    sizes: ['M', 'L', 'XL', 'XXL', 'Sur mesure'], colors: [{ name: 'Nuit', hex: '#1C1B26' }, { name: 'Ivoire', hex: '#E8DCC6' }] },
  { slug: 'ensemble-fleuve', name: 'Ensemble Fleuve', collection: 'fleuve', category: 'ENSEMBLES', gender: 'FEMME', price: 62000, oldPrice: null,
    fabric: "Lin lavé teint à l'indigo", motif: 'indigo', tone: 'indigo', badge: 'Dernières pièces', bestseller: false, status: 'PUBLISHED', stock: 2,
    sizes: ['XS', 'S', 'M', 'L'], colors: [{ name: 'Indigo', hex: '#27336A' }] },
  { slug: 'veste-bogolan', name: 'Veste Bogolan', collection: 'harmattan', category: 'VESTES', gender: 'MIXTE', price: 54000, oldPrice: null,
    fabric: 'Bogolan tissé main, doublure coton', motif: 'bogolan', tone: 'mil', badge: 'Pièce unique', bestseller: true, status: 'PUBLISHED', stock: 1,
    sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Terre', hex: '#6B4A2E' }] },
  { slug: 'robe-tiaya', name: 'Robe Tiaya', collection: 'fleuve', category: 'ROBES', gender: 'FEMME', price: 48000, oldPrice: null,
    fabric: 'Voile de coton, plissé main', motif: 'tissage', tone: 'sable', badge: 'Nouveau', bestseller: false, status: 'PUBLISHED', stock: 11,
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: [{ name: 'Sable', hex: '#CDB892' }, { name: 'Indigo', hex: '#27336A' }] },
  { slug: 'boubou-ndiaga', name: 'Boubou Ndiaga trois pièces', collection: 'ceremonie', category: 'BOUBOUS', gender: 'HOMME', price: 120000, oldPrice: null,
    fabric: 'Bazin riche, broderie fil de soie', motif: 'bazin', tone: 'sable', badge: null, bestseller: false, status: 'DRAFT', stock: 4,
    sizes: ['M', 'L', 'XL', 'XXL', 'Sur mesure'], colors: [{ name: 'Ivoire', hex: '#E8DCC6' }] },
  { slug: 'sac-tanneur', name: 'Sac Tanneur', collection: 'harmattan', category: 'ACCESSOIRES', gender: 'MIXTE', price: 29000, oldPrice: 35000,
    fabric: 'Cuir tanné végétal, anse en wax', motif: 'wax', tone: 'henne', badge: null, bestseller: true, status: 'PUBLISHED', stock: 7,
    sizes: ['Unique'], colors: [{ name: 'Cognac', hex: '#8A4B24' }] },
  { slug: 'robe-wax-plissee', name: 'Robe wax plissée', collection: 'fleuve', category: 'ROBES', gender: 'FEMME', price: 36000, oldPrice: 42000,
    fabric: 'Wax hollandais, ceinture nouée', motif: 'wax', tone: 'mil', badge: null, bestseller: false, status: 'PUBLISHED', stock: 0,
    sizes: ['S', 'M', 'L'], colors: [{ name: 'Ocre', hex: '#C08A2E' }] },
]

export const demoProducts: Product[] = seeds.map((s, i) => ({
  ...s,
  id: i + 1,
  description: s.description ?? null,
  collectionName: demoCollections.find((col) => col.slug === s.collection)?.name ?? null,
  images: [],
}))

export const demoSettings: Settings = {
  whatsapp: '221770000000',
  instagram: 'beauty_of_sahel',
  email: 'contact@example.com',
  address: 'Dakar, Sénégal',
  freeShippingThreshold: 50000,
}
