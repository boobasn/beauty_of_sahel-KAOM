import { useState } from 'react'
import { formatPrice, type Product } from '../data/catalog'
import { useCart } from '../lib/cartContext'
import Icon from './Icon'
import Visual from './Visual'

export default function ProductCard({ product }: { product: Product }) {
  const cart = useCart()
  const [picking, setPicking] = useState(false)
  const soldOut = product.stock === 0
  const wished = cart.wishlist.includes(product.slug)
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0

  return (
    <article className="pcard" data-soldout={soldOut} onMouseLeave={() => setPicking(false)}>
      <div className="pcard-media">
        <a href={`#produit-${product.slug}`} className="pcard-img" aria-label={product.name}>
          <Visual motif={product.motif} tone={product.tone} category={product.category} ratio="3 / 4" />
          {/* Seconde vue au survol (détail du tissu) */}
          <Visual motif={product.motif} tone={product.tone} ratio="3 / 4" className="pcard-alt" />
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
        {!soldOut && (
          <div className="pcard-quick" data-open={picking}>
            {picking ? (
              <div className="pcard-sizes" role="group" aria-label="Choisir une taille">
                {product.sizes
                  .filter((s) => s !== 'Sur mesure')
                  .map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        cart.add({ slug: product.slug, size: s, color: product.colors[0].name })
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
        <span className="pcard-cat">{product.category}</span>
        <h3 className="pcard-name">
          <a href={`#produit-${product.slug}`}>{product.name}</a>
        </h3>
        <div className="pcard-price">
          <span className={product.oldPrice ? 'price price-sale' : 'price'}>{formatPrice(product.price)}</span>
          {product.oldPrice && <s className="price price-old">{formatPrice(product.oldPrice)}</s>}
        </div>
        <span className="swatches" aria-label={`Couleurs : ${product.colors.map((c) => c.name).join(', ')}`}>
          {product.colors.map((c) => (
            <span key={c.name} className="swatch" style={{ background: c.hex }} title={c.name} />
          ))}
        </span>
      </div>
    </article>
  )
}
