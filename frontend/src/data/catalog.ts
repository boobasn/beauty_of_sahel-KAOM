// Données d'exemple pour la maquette. Elles seront remplacées par l'API Spring Boot
// (GET /api/collections, GET /api/products) une fois le backoffice en place.

export type Motif = 'bogolan' | 'indigo' | 'wax' | 'tissage' | 'bazin'
export type Tone = 'indigo' | 'henne' | 'sable' | 'nuit' | 'mil'

export interface Collection {
  slug: string
  name: string
  season: string
  tagline: string
  description: string
  motif: Motif
  tone: Tone
  pieces: number
}

export interface Product {
  slug: string
  name: string
  collection: string
  category: Category
  gender: 'Femme' | 'Homme' | 'Mixte'
  price: number
  oldPrice?: number
  bestseller?: boolean
  fabric: string
  colors: { name: string; hex: string }[]
  sizes: string[]
  motif: Motif
  tone: Tone
  badge?: 'Nouveau' | 'Pièce unique' | 'Dernières pièces' | 'Promo'
  status: 'En ligne' | 'Brouillon' | 'Rupture'
  stock: number
}

export type Category =
  | 'Boubous'
  | 'Kaftans'
  | 'Ensembles'
  | 'Robes'
  | 'Vestes'
  | 'Accessoires'

export const categories: { name: Category; count: number }[] = [
  { name: 'Boubous', count: 14 },
  { name: 'Kaftans', count: 9 },
  { name: 'Ensembles', count: 12 },
  { name: 'Robes', count: 18 },
  { name: 'Vestes', count: 6 },
  { name: 'Accessoires', count: 21 },
]

export const collections: Collection[] = [
  {
    slug: 'harmattan',
    name: 'Harmattan',
    season: 'Automne-Hiver 2026',
    tagline: 'Le vent sec, la lumière dorée, les silhouettes amples.',
    description:
      "Douze silhouettes taillées dans le bazin riche et le coton tissé main. Des volumes qui bougent avec le vent de saison, des teintes de latérite et d'indigo profond.",
    motif: 'bazin',
    tone: 'henne',
    pieces: 24,
  },
  {
    slug: 'fleuve',
    name: 'Fleuve',
    season: 'Printemps-Été 2026',
    tagline: "Indigo de Kaédi, lin léger, lignes d'eau.",
    description:
      "Une collection pensée pour la chaleur : lin, voile de coton et teintures à l'indigo naturel réalisées par des artisanes de la vallée du fleuve Sénégal.",
    motif: 'indigo',
    tone: 'indigo',
    pieces: 18,
  },
  {
    slug: 'ceremonie',
    name: 'Cérémonie',
    season: 'Capsule Tabaski',
    tagline: 'Les grands boubous brodés pour les jours de fête.',
    description:
      'Grands boubous, kaftans brodés et ensembles trois pièces. Broderies réalisées à la main à Dakar, finitions sur mesure.',
    motif: 'bogolan',
    tone: 'nuit',
    pieces: 11,
  },
]

export const products: Product[] = [
  {
    slug: 'grand-boubou-laterite',
    name: 'Grand boubou Latérite',
    collection: 'harmattan',
    category: 'Boubous',
    gender: 'Femme',
    price: 95000,
    bestseller: true,
    fabric: 'Bazin riche getzner, broderie ton sur ton',
    colors: [
      { name: 'Latérite', hex: '#A4532A' },
      { name: 'Indigo', hex: '#27336A' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'Sur mesure'],
    motif: 'bazin',
    tone: 'henne',
    badge: 'Nouveau',
    status: 'En ligne',
    stock: 6,
  },
  {
    slug: 'kaftan-nuit-de-dakar',
    name: 'Kaftan Nuit de Dakar',
    collection: 'ceremonie',
    category: 'Kaftans',
    gender: 'Homme',
    price: 66000,
    oldPrice: 78000,
    bestseller: true,
    fabric: 'Popeline de coton, broderie main au col',
    colors: [
      { name: 'Nuit', hex: '#1C1B26' },
      { name: 'Ivoire', hex: '#E8DCC6' },
    ],
    sizes: ['M', 'L', 'XL', 'XXL', 'Sur mesure'],
    motif: 'bogolan',
    tone: 'nuit',
    status: 'En ligne',
    stock: 9,
  },
  {
    slug: 'ensemble-fleuve',
    name: 'Ensemble Fleuve',
    collection: 'fleuve',
    category: 'Ensembles',
    gender: 'Femme',
    price: 62000,
    fabric: "Lin lavé teint à l'indigo naturel",
    colors: [{ name: 'Indigo', hex: '#27336A' }],
    sizes: ['XS', 'S', 'M', 'L'],
    motif: 'indigo',
    tone: 'indigo',
    badge: 'Dernières pièces',
    status: 'En ligne',
    stock: 2,
  },
  {
    slug: 'veste-bogolan',
    name: 'Veste Bogolan',
    collection: 'harmattan',
    category: 'Vestes',
    gender: 'Mixte',
    price: 54000,
    fabric: 'Bogolan de Ségou, doublure coton',
    colors: [{ name: 'Terre', hex: '#6B4A2E' }],
    sizes: ['S', 'M', 'L', 'XL'],
    motif: 'bogolan',
    tone: 'mil',
    badge: 'Pièce unique',
    bestseller: true,
    status: 'En ligne',
    stock: 1,
  },
  {
    slug: 'robe-tiaya',
    name: 'Robe Tiaya',
    collection: 'fleuve',
    category: 'Robes',
    gender: 'Femme',
    price: 48000,
    fabric: 'Voile de coton, plissé main',
    colors: [
      { name: 'Sable', hex: '#CDB892' },
      { name: 'Indigo', hex: '#27336A' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    motif: 'tissage',
    tone: 'sable',
    badge: 'Nouveau',
    status: 'En ligne',
    stock: 11,
  },
  {
    slug: 'boubou-ndiaga',
    name: 'Boubou Ndiaga trois pièces',
    collection: 'ceremonie',
    category: 'Boubous',
    gender: 'Homme',
    price: 120000,
    fabric: 'Bazin riche, broderie fil de soie',
    colors: [{ name: 'Ivoire', hex: '#E8DCC6' }],
    sizes: ['M', 'L', 'XL', 'XXL', 'Sur mesure'],
    motif: 'bazin',
    tone: 'sable',
    status: 'Brouillon',
    stock: 4,
  },
  {
    slug: 'sac-tanneur',
    name: 'Sac Tanneur',
    collection: 'harmattan',
    category: 'Accessoires',
    gender: 'Mixte',
    price: 29000,
    oldPrice: 35000,
    bestseller: true,
    fabric: 'Cuir tanné végétal, anse en wax',
    colors: [{ name: 'Cognac', hex: '#8A4B24' }],
    sizes: ['Unique'],
    motif: 'wax',
    tone: 'henne',
    status: 'En ligne',
    stock: 7,
  },
  {
    slug: 'robe-wax-plissee',
    name: 'Robe wax plissée',
    collection: 'fleuve',
    category: 'Robes',
    gender: 'Femme',
    price: 36000,
    oldPrice: 42000,
    fabric: 'Wax hollandais, ceinture nouée',
    colors: [{ name: 'Ocre', hex: '#C08A2E' }],
    sizes: ['S', 'M', 'L'],
    motif: 'wax',
    tone: 'mil',
    status: 'Rupture',
    stock: 0,
  },
  {
    slug: 'foulard-kaedi',
    name: 'Foulard Kaédi',
    collection: 'fleuve',
    category: 'Accessoires',
    gender: 'Mixte',
    price: 18000,
    fabric: "Voile de coton teint à l'indigo naturel",
    colors: [{ name: 'Indigo', hex: '#27336A' }],
    sizes: ['Unique'],
    motif: 'indigo',
    tone: 'indigo',
    badge: 'Nouveau',
    status: 'En ligne',
    stock: 15,
  },
]

export const fabrics = [
  {
    name: 'Bazin riche',
    origin: 'Teint et battu à Bamako',
    text: "Damassé de coton amidonné puis battu au maillet jusqu'à obtenir son brillant.",
  },
  {
    name: 'Bogolan',
    origin: 'Ségou, Mali',
    text: 'Coton tissé en bandes, peint à la boue fermentée et aux décoctions de feuilles.',
  },
  {
    name: 'Indigo',
    origin: 'Kaédi, vallée du fleuve',
    text: "Teinture végétale en cuve. Chaque bain fonce la couleur ; une pièce en demande jusqu'à huit.",
  },
  {
    name: 'Thioup',
    origin: 'Dakar',
    text: 'Technique de teinture par nouage et pliage qui dessine des motifs en réserve.',
  },
]

export const formatPrice = (value: number) =>
  `${new Intl.NumberFormat('fr-FR').format(value).replace(/ /g, ' ')} FCFA`

export const findProduct = (slug: string) => products.find((p) => p.slug === slug)
export const findCollection = (slug: string) => collections.find((c) => c.slug === slug)
