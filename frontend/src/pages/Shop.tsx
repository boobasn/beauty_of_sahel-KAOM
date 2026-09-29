import { useMemo, useState } from 'react'
import { categories, categoryLabels, genderLabels, type Category, type Gender } from '../api/types'
import Icon from '../components/Icon'
import ProductCard from '../components/ProductCard'
import { useCatalog } from '../lib/catalogContext'

type Sort = 'nouveautes' | 'prix-asc' | 'prix-desc'
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const PRICES = [
  { key: 'all', label: 'Tous les prix', min: 0, max: Infinity },
  { key: 'lt50', label: 'Moins de 50 000 FCFA', min: 0, max: 50000 },
  { key: '50-80', label: '50 000 à 80 000 FCFA', min: 50000, max: 80000 },
  { key: 'gt80', label: 'Plus de 80 000 FCFA', min: 80000, max: Infinity },
]

interface ShopProps {
  collection?: string
  promo?: boolean
  category?: string
}

export default function Shop({ collection, promo, category }: ShopProps) {
  const { products, collections, findCollection, status, error, reload } = useCatalog()
  const current = collection ? findCollection(collection) : undefined
  const initialCat = categories.includes(category as Category) ? [category as Category] : []
  const [cats, setCats] = useState<Category[]>(initialCat)
  const [genders, setGenders] = useState<Gender[]>([])
  const [size, setSize] = useState<string | null>(null)
  const [price, setPrice] = useState('all')
  const [available, setAvailable] = useState(false)
  const [sort, setSort] = useState<Sort>('nouveautes')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const scope = useMemo(
    () => products.filter((p) => (!current || p.collection === current.slug) && (!promo || p.oldPrice)),
    [products, current, promo],
  )

  const list = useMemo(() => {
    const range = PRICES.find((p) => p.key === price)!
    const filtered = scope
      .filter((p) => cats.length === 0 || cats.includes(p.category))
      .filter((p) => genders.length === 0 || genders.includes(p.gender))
      .filter((p) => !size || p.sizes.includes(size))
      .filter((p) => !available || p.stock > 0)
      .filter((p) => p.price >= range.min && p.price < range.max)
    if (sort === 'prix-asc') return [...filtered].sort((a, b) => a.price - b.price)
    if (sort === 'prix-desc') return [...filtered].sort((a, b) => b.price - a.price)
    return filtered
  }, [scope, cats, genders, size, available, price, sort])

  const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((x) => x !== value) : [...list, value])
  const reset = () => {
    setCats([])
    setGenders([])
    setSize(null)
    setPrice('all')
    setAvailable(false)
  }

  const title = current ? current.name : promo ? 'Promotions' : 'Boutique'
  const subtitle = current
    ? current.description
    : promo
      ? 'Les pièces à prix réduit, tant qu’il en reste.'
      : 'Boubous, kaftans, robes et accessoires, du prêt-à-porter à la pièce unique.'

  return (
    <main>
      <section className="page-title">
        <div className="container">
          <nav className="crumbs" aria-label="Fil d’Ariane">
            <a href="#">Accueil</a>
            <span aria-hidden="true">/</span>
            <a href="#collections">Boutique</a>
            {(current || promo) && (
              <>
                <span aria-hidden="true">/</span>
                <span>{title}</span>
              </>
            )}
          </nav>
          <h1 className="h1">{title}</h1>
          {subtitle && <p className="muted page-title-sub">{subtitle}</p>}
          <div className="coll-switch">
            <a href="#collections" aria-current={!current && !promo ? 'page' : undefined}>
              Tout
            </a>
            {collections.map((c) => (
              <a key={c.slug} href={`#collection-${c.slug}`} aria-current={current?.slug === c.slug ? 'page' : undefined}>
                {c.name}
              </a>
            ))}
            <a href="#promotions" aria-current={promo ? 'page' : undefined}>
              Promotions
            </a>
          </div>
        </div>
      </section>

      <div className="container shop">
        <aside className="filters" data-open={filtersOpen} aria-label="Filtres">
          <div className="filters-head">
            <p className="filters-title">Filtrer</p>
            <button className="icon-btn filters-close" onClick={() => setFiltersOpen(false)} aria-label="Fermer les filtres">
              <Icon name="close" />
            </button>
          </div>
          <fieldset className="filter">
            <legend>Catégorie</legend>
            {categories.map((c) => {
              const n = scope.filter((p) => p.category === c).length
              return (
                <label key={c} className="check">
                  <input id={`cat-${c}`} type="checkbox" checked={cats.includes(c)} onChange={() => setCats(toggle(cats, c))} />
                  <span>{categoryLabels[c]}</span>
                  <span className="check-count">{n}</span>
                </label>
              )
            })}
          </fieldset>
          <fieldset className="filter">
            <legend>Pour</legend>
            {(Object.keys(genderLabels) as Gender[]).map((g) => (
              <label key={g} className="check">
                <input id={`gender-${g}`} type="checkbox" checked={genders.includes(g)} onChange={() => setGenders(toggle(genders, g))} />
                <span>{genderLabels[g]}</span>
              </label>
            ))}
          </fieldset>
          <fieldset className="filter">
            <legend>Taille</legend>
            <div className="size-grid">
              {SIZES.map((s) => (
                <button key={s} className="size-btn" aria-pressed={size === s} onClick={() => setSize(size === s ? null : s)}>
                  {s}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="filter">
            <legend>Prix</legend>
            {PRICES.map((p) => (
              <label key={p.key} className="check">
                <input id={`price-${p.key}`} type="radio" name="price" checked={price === p.key} onChange={() => setPrice(p.key)} />
                <span>{p.label}</span>
              </label>
            ))}
          </fieldset>
          <label className="check">
            <input id="shop-available" type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
            <span>Disponible uniquement</span>
          </label>
          <button className="btn btn-outline btn-block" onClick={reset}>
            Effacer les filtres
          </button>
        </aside>

        <section className="shop-main">
          <div className="toolbar">
            <button className="btn btn-outline btn-sm filters-open" onClick={() => setFiltersOpen(true)}>
              Filtrer
            </button>
            <p className="result-count">
              {list.length} produit{list.length > 1 ? 's' : ''}
            </p>
            <label className="select">
              <span className="sr-only">Trier par</span>
              <select id="shop-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="nouveautes">Trier : nouveautés</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
              </select>
            </label>
          </div>
          {status === 'loading' && <p className="muted">Chargement des pièces…</p>}
          {status === 'error' && (
            <div className="empty">
              <p>{error}</p>
              <button className="btn btn-dark" onClick={reload}>
                Réessayer
              </button>
            </div>
          )}
          {status === 'ready' && list.length > 0 && (
            <div className="product-grid product-grid-3">
              {list.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
          {status === 'ready' && list.length === 0 && (
            <div className="empty">
              <p>Aucun produit ne correspond à ces filtres.</p>
              <button className="btn btn-dark" onClick={reset}>
                Effacer les filtres
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
