import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import ProductCard from '../components/ProductCard'
import { categories, collections, findCollection, products, type Category } from '../data/catalog'

type Sort = 'nouveautes' | 'prix-asc' | 'prix-desc'
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const PRICES = [
  { key: 'all', label: 'Tous les prix', min: 0, max: Infinity },
  { key: 'lt50', label: 'Moins de 50 000 FCFA', min: 0, max: 50000 },
  { key: '50-80', label: '50 000 à 80 000 FCFA', min: 50000, max: 80000 },
  { key: 'gt80', label: 'Plus de 80 000 FCFA', min: 80000, max: Infinity },
]

export default function Shop({ collection }: { collection?: string }) {
  const current = collection ? findCollection(collection) : undefined
  const [cats, setCats] = useState<Category[]>([])
  const [size, setSize] = useState<string | null>(null)
  const [price, setPrice] = useState('all')
  const [sort, setSort] = useState<Sort>('nouveautes')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const list = useMemo(() => {
    const range = PRICES.find((p) => p.key === price)!
    const filtered = products
      .filter((p) => p.status !== 'Brouillon')
      .filter((p) => !current || p.collection === current.slug)
      .filter((p) => cats.length === 0 || cats.includes(p.category))
      .filter((p) => !size || p.sizes.includes(size))
      .filter((p) => p.price >= range.min && p.price < range.max)
    if (sort === 'prix-asc') return [...filtered].sort((a, b) => a.price - b.price)
    if (sort === 'prix-desc') return [...filtered].sort((a, b) => b.price - a.price)
    return filtered
  }, [current, cats, size, price, sort])

  const toggleCat = (c: Category) => setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  const reset = () => {
    setCats([])
    setSize(null)
    setPrice('all')
  }

  return (
    <main>
      <section className="page-title">
        <div className="container">
          <nav className="crumbs" aria-label="Fil d’Ariane">
            <a href="#">Accueil</a>
            <span aria-hidden="true">/</span>
            <a href="#collections">Boutique</a>
            {current && (
              <>
                <span aria-hidden="true">/</span>
                <span>{current.name}</span>
              </>
            )}
          </nav>
          <h1 className="h1">{current ? current.name : 'Boutique'}</h1>
          <p className="muted page-title-sub">{current ? current.description : 'Boubous, kaftans, robes et accessoires, du prêt-à-porter à la pièce unique.'}</p>
          <div className="coll-switch">
            <a href="#collections" aria-current={!current ? 'page' : undefined}>Tout</a>
            {collections.map((c) => (
              <a key={c.slug} href={`#collection-${c.slug}`} aria-current={current?.slug === c.slug ? 'page' : undefined}>
                {c.name}
              </a>
            ))}
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
            {categories.map((c) => (
              <label key={c.name} className="check">
                <input id={`cat-${c.name}`} type="checkbox" checked={cats.includes(c.name)} onChange={() => toggleCat(c.name)} />
                <span>{c.name}</span>
                <span className="check-count">{c.count}</span>
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
          <button className="btn btn-outline btn-block" onClick={reset}>Effacer les filtres</button>
        </aside>

        <section className="shop-main">
          <div className="toolbar">
            <button className="btn btn-outline btn-sm filters-open" onClick={() => setFiltersOpen(true)}>
              Filtrer
            </button>
            <p className="result-count">{list.length} produit{list.length > 1 ? 's' : ''}</p>
            <label className="select">
              <span className="sr-only">Trier par</span>
              <select id="shop-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="nouveautes">Trier : nouveautés</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
              </select>
            </label>
          </div>
          {list.length > 0 ? (
            <div className="product-grid product-grid-3">
              {list.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <p>Aucun produit ne correspond à ces filtres.</p>
              <button className="btn btn-dark" onClick={reset}>Effacer les filtres</button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
