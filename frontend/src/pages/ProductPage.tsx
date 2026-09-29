import { useState } from 'react'
import Icon from '../components/Icon'
import ProductCard from '../components/ProductCard'
import Visual from '../components/Visual'
import { findCollection, findProduct, formatPrice, products } from '../data/catalog'
import { useCart } from '../lib/cartContext'

const details = [
  { title: 'Description', body: 'Pièce coupée et cousue dans notre atelier de Dakar. Coupe ample, finitions main.' },
  { title: 'Tissu et entretien', body: 'Lavage à la main à l’eau froide, séchage à l’ombre. Repassage doux sur l’envers.' },
  { title: 'Livraison et retours', body: 'Dakar : 24 h. Afrique de l’Ouest : 3 à 5 jours. Europe et Amérique du Nord : 5 à 8 jours. Échange sous 14 jours, hors sur mesure.' },
]

export default function ProductPage({ slug }: { slug: string }) {
  const product = findProduct(slug) ?? products[0]
  const collection = findCollection(product.collection)
  const cart = useCart()
  const [size, setSize] = useState<string | null>(null)
  const [color, setColor] = useState(product.colors[0].name)
  const [qty, setQty] = useState(1)
  const [error, setError] = useState(false)
  const soldOut = product.stock === 0
  const wished = cart.wishlist.includes(product.slug)
  const related = products.filter((p) => p.slug !== product.slug && p.status === 'En ligne').slice(0, 4)

  const add = () => {
    if (!size) return setError(true)
    cart.add({ slug: product.slug, size, color }, qty)
  }

  return (
    <main>
      <div className="container">
        <nav className="crumbs" aria-label="Fil d’Ariane">
          <a href="#">Accueil</a>
          <span aria-hidden="true">/</span>
          <a href={`#collection-${product.collection}`}>{collection?.name}</a>
          <span aria-hidden="true">/</span>
          <span>{product.name}</span>
        </nav>
      </div>

      <section className="container pdp">
        <div className="pdp-gallery">
          <Visual motif={product.motif} tone={product.tone} category={product.category} ratio="3 / 4" label="Face" />
          <Visual motif={product.motif} tone={product.tone} category={product.category} ratio="3 / 4" label="Dos" />
          <Visual motif={product.motif} tone={product.tone} ratio="3 / 4" label="Détail du tissu" />
          <Visual motif={product.motif} tone={product.tone} category={product.category} ratio="3 / 4" label="Porté" />
        </div>

        <div className="pdp-info">
          <p className="pcard-cat">{collection?.name} · {product.category}</p>
          <h1 className="h1">{product.name}</h1>
          <div className="pdp-price">
            <span className={product.oldPrice ? 'price-sale' : ''}>{formatPrice(product.price)}</span>
            {product.oldPrice && <s className="price-old">{formatPrice(product.oldPrice)}</s>}
          </div>
          <p className="muted">{product.fabric}.</p>

          <div className="pdp-field">
            <p className="pdp-label">Couleur : <strong>{color}</strong></p>
            <div className="pdp-colors">
              {product.colors.map((c) => (
                <button key={c.name} className="color-btn" aria-pressed={color === c.name} aria-label={c.name} style={{ background: c.hex }} onClick={() => setColor(c.name)} />
              ))}
            </div>
          </div>

          <div className="pdp-field">
            <p className="pdp-label">
              Taille : <strong>{size ?? 'choisir'}</strong>
              <a href="#produit-grand-boubou-laterite" className="pdp-guide">Guide des tailles</a>
            </p>
            <div className="size-grid">
              {product.sizes.map((s) => (
                <button key={s} className="size-btn" aria-pressed={size === s} onClick={() => { setSize(s); setError(false) }}>
                  {s}
                </button>
              ))}
            </div>
            {error && <p className="field-error" role="alert">Choisissez une taille pour ajouter la pièce au panier.</p>}
          </div>

          <div className="pdp-buy">
            <div className="qty qty-lg" aria-label="Quantité">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Retirer un"><Icon name="minus" size={16} /></button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))} aria-label="Ajouter un"><Icon name="plus" size={16} /></button>
            </div>
            <button className="btn btn-dark pdp-add" disabled={soldOut} onClick={add}>
              {soldOut ? 'Épuisé' : 'Ajouter au panier'}
            </button>
            <button className="icon-btn icon-btn-box" aria-pressed={wished} aria-label={wished ? 'Retirer des favoris' : 'Ajouter aux favoris'} onClick={() => cart.toggleWish(product.slug)}>
              <Icon name="heart" />
            </button>
          </div>
          <button className="btn btn-outline btn-block">
            <Icon name="whatsapp" /> Commander directement sur WhatsApp
          </button>

          <p className={product.stock > 0 && product.stock <= 2 ? 'stock stock-low' : 'stock'}>
            <span className="stock-dot" />
            {soldOut ? 'Rupture de stock. Disponible en sur mesure sous 3 semaines.' : product.stock <= 2 ? `Plus que ${product.stock} en stock` : 'En stock, expédié sous 48 h'}
          </p>

          <ul className="pdp-perks">
            <li><Icon name="truck" /> Livraison offerte à Dakar dès 50 000 FCFA</li>
            <li><Icon name="refresh" /> Échange sous 14 jours</li>
            <li><Icon name="wallet" /> Wave, Orange Money ou paiement à la livraison</li>
          </ul>

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

      <section className="section section-tight">
        <div className="container">
          <div className="section-head section-head-center">
            <h2 className="h2">Vous aimerez aussi</h2>
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
