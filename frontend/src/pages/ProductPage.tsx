import { useState } from 'react'
import { categoryLabels, formatPrice } from '../api/types'
import Icon from '../components/Icon'
import ProductCard from '../components/ProductCard'
import Visual from '../components/Visual'
import { useCart } from '../lib/cartContext'
import { useCatalog } from '../lib/catalogContext'
import { whatsappLink } from '../lib/format'

export default function ProductPage({ slug }: { slug: string }) {
  const { findProduct, findCollection, products, settings, status } = useCatalog()
  const cart = useCart()
  const product = findProduct(slug)
  const [size, setSize] = useState<string | null>(null)
  const [color, setColor] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [error, setError] = useState(false)

  if (status === 'loading') {
    return (
      <main className="container page-message">
        <p className="muted">Chargement…</p>
      </main>
    )
  }
  if (!product) {
    return (
      <main className="container page-message">
        <h1 className="h1">Cette pièce n’est plus disponible</h1>
        <p className="muted">Elle a peut-être été vendue ou retirée de la boutique.</p>
        <a className="btn btn-dark" href="#collections">
          Voir la boutique
        </a>
      </main>
    )
  }

  const collection = product.collection ? findCollection(product.collection) : undefined
  const soldOut = product.stock === 0
  const wished = cart.wishlist.includes(product.slug)
  const chosenColor = color ?? product.colors[0]?.name ?? ''
  const related = products.filter((p) => p.slug !== product.slug && p.collection === product.collection).slice(0, 4)
  const fill = related.length < 4 ? products.filter((p) => p.slug !== product.slug && !related.includes(p)).slice(0, 4 - related.length) : []
  const views = product.images.length > 0 ? product.images.map((i) => ({ src: i.url, label: undefined as string | undefined })) : [
    { src: undefined, label: 'Face' },
    { src: undefined, label: 'Dos' },
    { src: undefined, label: 'Détail du tissu' },
    { src: undefined, label: 'Porté' },
  ]

  const add = () => {
    if (!size) return setError(true)
    cart.add({ slug: product.slug, size, color: chosenColor }, qty)
  }

  const waText = `Bonjour KAOM, je suis intéressée par « ${product.name} » (${formatPrice(product.price)})${size ? `, taille ${size}` : ''}${chosenColor ? `, couleur ${chosenColor}` : ''}.`

  return (
    <main>
      <div className="container">
        <nav className="crumbs" aria-label="Fil d’Ariane">
          <a href="#">Accueil</a>
          <span aria-hidden="true">/</span>
          {collection ? <a href={`#collection-${collection.slug}`}>{collection.name}</a> : <a href="#collections">Boutique</a>}
          <span aria-hidden="true">/</span>
          <span>{product.name}</span>
        </nav>
      </div>

      <section className="container pdp">
        <div className="pdp-gallery">
          {views.map((v, i) => (
            <Visual
              key={i}
              src={v.src}
              alt={`${product.name}, photo ${i + 1}`}
              motif={product.motif}
              tone={product.tone}
              category={v.label === 'Détail du tissu' ? undefined : product.category}
              ratio="3 / 4"
              label={v.label}
            />
          ))}
        </div>

        <div className="pdp-info">
          <p className="pcard-cat">
            {[collection?.name, categoryLabels[product.category]].filter(Boolean).join(' · ')}
          </p>
          <h1 className="h1">{product.name}</h1>
          <div className="pdp-price">
            <span className={product.oldPrice ? 'price-sale' : ''}>{formatPrice(product.price)}</span>
            {product.oldPrice && <s className="price-old">{formatPrice(product.oldPrice)}</s>}
          </div>
          {product.fabric && <p className="muted">{product.fabric}.</p>}

          {product.colors.length > 0 && (
            <div className="pdp-field">
              <p className="pdp-label">
                Couleur : <strong>{chosenColor}</strong>
              </p>
              <div className="pdp-colors">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    className="color-btn"
                    aria-pressed={chosenColor === c.name}
                    aria-label={c.name}
                    style={{ background: c.hex }}
                    onClick={() => setColor(c.name)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pdp-field">
            <p className="pdp-label">
              Taille : <strong>{size ?? 'choisir'}</strong>
            </p>
            <div className="size-grid">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className="size-btn"
                  aria-pressed={size === s}
                  onClick={() => {
                    setSize(s)
                    setError(false)
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            {error && (
              <p className="field-error" role="alert">
                Choisissez une taille pour ajouter la pièce au panier.
              </p>
            )}
          </div>

          <div className="pdp-buy">
            <div className="qty qty-lg" aria-label="Quantité">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Retirer un">
                <Icon name="minus" size={16} />
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(Math.max(product.stock, 1), q + 1))} aria-label="Ajouter un">
                <Icon name="plus" size={16} />
              </button>
            </div>
            <button className="btn btn-dark pdp-add" disabled={soldOut} onClick={add}>
              {soldOut ? 'Épuisé' : 'Ajouter au panier'}
            </button>
            <button
              className="icon-btn icon-btn-box"
              aria-pressed={wished}
              aria-label={wished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              onClick={() => cart.toggleWish(product.slug)}
            >
              <Icon name="heart" />
            </button>
          </div>
          <a className="btn btn-outline btn-block" href={whatsappLink(settings?.whatsapp, waText)} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" /> Poser une question sur WhatsApp
          </a>

          <p className={product.stock > 0 && product.stock <= 2 ? 'stock stock-low' : 'stock'}>
            <span className="stock-dot" />
            {soldOut
              ? 'Rupture de stock. Disponible en sur mesure sur demande.'
              : product.stock <= 2
                ? `Plus que ${product.stock} en stock`
                : 'En stock, expédié sous 48 h'}
          </p>

          <ul className="pdp-perks">
            <li>
              <Icon name="truck" /> Livraison offerte à Dakar dès {formatPrice(settings?.freeShippingThreshold ?? 50000)}
            </li>
            <li>
              <Icon name="refresh" /> Échange sous 14 jours
            </li>
            <li>
              <Icon name="wallet" /> Wave, Orange Money ou paiement à la livraison
            </li>
          </ul>

          <div className="accordion">
            {product.description && (
              <details open>
                <summary>Description</summary>
                <p>{product.description}</p>
              </details>
            )}
            <details open={!product.description}>
              <summary>Tissu et entretien</summary>
              <p>{product.fabric ? `${product.fabric}. ` : ''}Lavage à la main à l’eau froide, séchage à l’ombre.</p>
            </details>
            <details>
              <summary>Livraison et retours</summary>
              <p>Dakar : 24 h. Afrique de l’Ouest : 3 à 5 jours. International : 5 à 8 jours. Échange sous 14 jours, hors sur mesure.</p>
            </details>
          </div>
        </div>
      </section>

      {related.length + fill.length > 0 && (
        <section className="section section-tight">
          <div className="container">
            <div className="section-head section-head-center">
              <h2 className="h2">Vous aimerez aussi</h2>
            </div>
            <div className="product-grid">
              {[...related, ...fill].map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
