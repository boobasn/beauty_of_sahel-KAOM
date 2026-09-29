import { useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import Visual from '../components/Visual'
import { categories, collections, findCollection, products, type Category } from '../data/catalog'

type Sort = 'nouveautes' | 'prix-asc' | 'prix-desc'

export default function Shop({ collection }: { collection?: string }) {
  const current = collection ? findCollection(collection) : undefined
  const [cat, setCat] = useState<Category | 'Tout'>('Tout')
  const [sort, setSort] = useState<Sort>('nouveautes')
  const [available, setAvailable] = useState(false)

  const list = useMemo(() => {
    const filtered = products
      .filter((p) => p.status !== 'Brouillon')
      .filter((p) => !current || p.collection === current.slug)
      .filter((p) => cat === 'Tout' || p.category === cat)
      .filter((p) => !available || p.stock > 0)
    if (sort === 'prix-asc') return [...filtered].sort((a, b) => a.price - b.price)
    if (sort === 'prix-desc') return [...filtered].sort((a, b) => b.price - a.price)
    return filtered
  }, [current, cat, sort, available])

  return (
    <main>
      <section className={`shop-hero ${current ? 'shop-hero-collection' : ''}`}>
        <div className="container shop-hero-inner">
          <div>
            <nav className="crumbs" aria-label="Fil d'Ariane">
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
            <p className="eyebrow">{current ? current.season : 'Toutes les collections'}</p>
            <h1 className="display">{current ? current.name : 'La boutique'}</h1>
            <p className="measure">
              {current
                ? current.description
                : 'Boubous, kaftans, robes et accessoires, du prêt-à-porter à la pièce unique.'}
            </p>
          </div>
          {current && (
            <div className="shop-hero-visual">
              <Visual motif={current.motif} tone={current.tone} ratio="16 / 10" label={`Campagne ${current.name}`} />
            </div>
          )}
        </div>
        <div className="container coll-switch">
          <a href="#collections" aria-current={!current ? 'page' : undefined}>
            Tout
          </a>
          {collections.map((c) => (
            <a key={c.slug} href={`#collection-${c.slug}`} aria-current={current?.slug === c.slug ? 'page' : undefined}>
              {c.name}
            </a>
          ))}
        </div>
      </section>

      <section className="container shop-body">
        <div className="toolbar">
          <div className="chips" role="group" aria-label="Catégorie">
            {(['Tout', ...categories.map((c) => c.name)] as const).map((c) => (
              <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="toolbar-right">
            <label className="check">
              <input id="shop-available" type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
              Disponible uniquement
            </label>
            <label className="select">
              <span className="sr-only">Trier</span>
              <select id="shop-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                <option value="nouveautes">Nouveautés</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
              </select>
            </label>
          </div>
        </div>
        <p className="result-count">
          {list.length} pièce{list.length > 1 ? 's' : ''}
        </p>
        {list.length > 0 ? (
          <div className="product-grid">
            {list.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <p>Aucune pièce ne correspond à ces filtres.</p>
            <button className="btn btn-ghost" onClick={() => { setCat('Tout'); setAvailable(false) }}>
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
