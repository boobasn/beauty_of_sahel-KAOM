import { useState } from 'react'
import { categoryLabels, formatPrice, type Product } from '../api/types'
import { useCart } from '../lib/cartContext'
import Icon from './Icon'
import Visual from './Visual'

export default function ProductCard({ product }: { product: Product }) {
  const cart = useCart()
  const [picking, setPicking] = useState(false)
  const soldOut = product.stock === 0
  const wished = cart.wishlist.includes(product.slug)
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  const [first, second] = product.images
  const sizes = product.sizes.filter((s) => s !== 'Sur mesure')

  return (
    <article className="pcard" data-soldout={soldOut} onMouseLeave={() => setPicking(false)}>
      <div className="pcard-media">
        <a href={`#produit-${product.slug}`} className="pcard-img" aria-label={product.name}>
          <Visual src={first?.url} alt={product.name} motif={product.motif} tone={product.tone} category={product.category} ratio="3 / 4" />
          {/* Seconde vue au survol : deuxième photo, ou détail du tissu */}
          <Visual src={second?.url} motif={product.motif} tone={product.tone} ratio="3 / 4" className="pcard-alt" />
        </a>
        <div className="pcard-badges">
          {discount > 0 && <span className="tag tag-sale">-{discount}%</span>}
          {product.badge && <span className="tag">{product.badge}</span>}
          {soldOut && <span className="tag tag-dark">Épuisé</span>}
        </div>
        <button
          className="pcard-wish"
          aria-pressed={wished}
          aria-label={wished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          onClick={() => cart.toggleWish(product.slug)}
        >
          <Icon name="heart" size={18} />
        </button>
        {!soldOut && sizes.length > 0 && (
          <div className="pcard-quick" data-open={picking}>
            {picking ? (
              <div className="pcard-sizes" role="group" aria-label="Choisir une taille">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      cart.add({ slug: product.slug, size: s, color: product.colors[0]?.name ?? '' })
                      setPicking(false)
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <button className="pcard-add" onClick={() => setPicking(true)}>
                Ajout rapide
              </button>
            )}
          </div>
        )}
      </div>
      <div className="pcard-body">
        <span className="pcard-cat">{categoryLabels[product.category]}</span>
        <h3 className="pcard-name">
          <a href={`#produit-${product.slug}`}>{product.name}</a>
        </h3>
        <div className="pcard-price">
          <span className={product.oldPrice ? 'price price-sale' : 'price'}>{formatPrice(product.price)}</span>
          {product.oldPrice && <s className="price price-old">{formatPrice(product.oldPrice)}</s>}
        </div>
        {product.colors.length > 0 && (
          <span className="swatches" aria-label={`Couleurs : ${product.colors.map((c) => c.name).join(', ')}`}>
            {product.colors.map((c) => (
              <span key={c.name} className="swatch" style={{ background: c.hex }} title={c.name} />
            ))}
          </span>
        )}
      </div>
    </article>
  )
}
