import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import Visual from '../components/Visual'
import { findCollection, findProduct, formatPrice, products } from '../data/catalog'

const details = [
  {
    title: 'Tissu et entretien',
    body: "Lavage à la main à l'eau froide, séchage à l'ombre. Repassage doux sur l'envers pour préserver le brillant du bazin.",
  },
  {
    title: 'Coupe et tailles',
    body: 'Coupe ample. Le mannequin mesure 1,78 m et porte une taille M. Guide des tailles en centimètres disponible sur demande.',
  },
  {
    title: 'Livraison et retours',
    body: 'Dakar : 24 h, 2 000 FCFA. Afrique de l’Ouest : 3 à 5 jours. Europe et Amérique du Nord : 5 à 8 jours. Échange sous 14 jours hors sur mesure.',
  },
]

export default function ProductPage({ slug }: { slug: string }) {
  const product = findProduct(slug) ?? products[0]
  const collection = findCollection(product.collection)
  const [size, setSize] = useState<string | null>(null)
  const [color, setColor] = useState(product.colors[0].name)
  const [view, setView] = useState(0)
  const [asked, setAsked] = useState(false)
  const related = products.filter((p) => p.slug !== product.slug && p.status === 'En ligne').slice(0, 4)
  const views = ['Face', 'Dos', 'Détail broderie', 'Porté']

  return (
    <main>
      <div className="container">
        <nav className="crumbs" aria-label="Fil d'Ariane">
          <a href="#">Accueil</a>
          <span aria-hidden="true">/</span>
          <a href={`#collection-${product.collection}`}>{collection?.name}</a>
          <span aria-hidden="true">/</span>
          <span>{product.name}</span>
        </nav>
      </div>
      <section className="container pdp">
        <div className="pdp-gallery">
          <div className="pdp-thumbs" role="tablist" aria-label="Vues du produit">
            {views.map((v, i) => (
              <button key={v} role="tab" aria-selected={view === i} className="pdp-thumb" onClick={() => setView(i)}>
                <Visual motif={product.motif} tone={product.tone} category={i === 2 ? undefined : product.category} ratio="3 / 4" />
                <span className="sr-only">{v}</span>
              </button>
            ))}
          </div>
          <div className="pdp-main">
            <Visual
              motif={product.motif}
              tone={product.tone}
              category={view === 2 ? undefined : product.category}
              ratio="4 / 5"
              label={`Photo ${view + 1}/4 · ${views[view]}`}
            />
          </div>
        </div>

        <div className="pdp-info">
          <p className="eyebrow">
            {collection?.name} · {product.category}
          </p>
          <h1 className="h1">{product.name}</h1>
          <p className="pdp-price">{formatPrice(product.price)}</p>
          {product.badge && <span className="badge badge-inline">{product.badge}</span>}

          <div className="pdp-field">
            <p className="pdp-label">
              Couleur <span>{color}</span>
            </p>
            <div className="pdp-colors">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  className="color-btn"
                  aria-pressed={color === c.name}
                  aria-label={c.name}
                  style={{ background: c.hex }}
                  onClick={() => setColor(c.name)}
                />
              ))}
            </div>
          </div>

          <div className="pdp-field">
            <p className="pdp-label">
              Taille <a href="#produit-grand-boubou-laterite">Guide des tailles</a>
            </p>
            <div className="sizes">
              {product.sizes.map((s) => (
                <button key={s} className="size-btn" aria-pressed={size === s} onClick={() => setSize(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pdp-actions">
            <button className="btn btn-ink btn-block" disabled={product.stock === 0} onClick={() => setAsked(true)}>
              {product.stock === 0 ? 'Épuisé' : 'Commander sur WhatsApp'}
            </button>
            <button className="btn btn-ghost btn-block">Ajouter aux favoris</button>
          </div>
          {asked && (
            <p className="form-note" role="status">
              {size
                ? `Message préparé : « ${product.name}, ${color}, taille ${size} ». La créatrice vous répond sur WhatsApp au +221 77 000 00 00.`
                : 'Choisissez une taille pour préparer votre message de commande.'}
            </p>
          )}
          <p className="pdp-stock">
            {product.stock === 0
              ? 'Rupture. Disponible en sur mesure sous 3 semaines.'
              : product.stock <= 2
                ? `Plus que ${product.stock} en stock`
                : 'En stock, expédié sous 48 h'}
          </p>

          <p className="measure pdp-desc">{product.fabric}. Pièce coupée et cousue dans notre atelier de Dakar.</p>

          <div className="accordion">
            {details.map((d, i) => (
              <details key={d.title} open={i === 0}>
                <summary>{d.title}</summary>
                <p>{d.body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2 className="h2">Compléter le look</h2>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
