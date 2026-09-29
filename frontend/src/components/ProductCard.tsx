import { formatPrice, type Product } from '../data/catalog'
import Visual from './Visual'

export default function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock === 0
  return (
    <a href={`#produit-${product.slug}`} className="product-card" data-soldout={soldOut}>
      <div className="product-card-media">
        <Visual motif={product.motif} tone={product.tone} category={product.category} />
        {product.badge && <span className="badge">{product.badge}</span>}
        {soldOut && <span className="badge badge-muted">Épuisé</span>}
        <span className="product-card-quick">Voir la pièce</span>
      </div>
      <div className="product-card-body">
        <div className="product-card-row">
          <h3 className="product-card-name">{product.name}</h3>
          <span className="price">{formatPrice(product.price)}</span>
        </div>
        <div className="product-card-row product-card-meta">
          <span>{product.fabric.split(',')[0]}</span>
          <span className="swatches" aria-label={product.colors.map((c) => c.name).join(', ')}>
            {product.colors.map((c) => (
              <span key={c.name} className="swatch" style={{ background: c.hex }} />
            ))}
          </span>
        </div>
      </div>
    </a>
  )
}
