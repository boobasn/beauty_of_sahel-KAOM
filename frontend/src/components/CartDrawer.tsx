import { useEffect } from 'react'
import { formatPrice } from '../data/catalog'
import { useCart } from '../lib/cartContext'
import Icon from './Icon'
import Visual from './Visual'

const FREE_SHIPPING = 50000

export default function CartDrawer() {
  const cart = useCart()
  const { open, setOpen } = cart

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  const remaining = Math.max(0, FREE_SHIPPING - cart.total)

  return (
    <div className="drawer-root" data-open={open} aria-hidden={!open}>
      <div className="drawer-scrim" onClick={() => setOpen(false)} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Panier">
        <header className="drawer-head">
          <h2>Panier ({cart.count})</h2>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Fermer le panier">
            <Icon name="close" />
          </button>
        </header>

        <div className="drawer-ship">
          <p>
            {remaining > 0
              ? `Plus que ${formatPrice(remaining)} pour la livraison offerte à Dakar.`
              : 'Livraison offerte à Dakar.'}
          </p>
          <div className="drawer-bar">
            <span style={{ width: `${Math.min(100, (cart.total / FREE_SHIPPING) * 100)}%` }} />
          </div>
        </div>

        {cart.lines.length === 0 ? (
          <div className="drawer-empty">
            <p>Votre panier est vide.</p>
            <a className="btn btn-dark" href="#collections" onClick={() => setOpen(false)}>
              Voir la boutique
            </a>
          </div>
        ) : (
          <ul className="drawer-lines">
            {cart.lines.map((l, i) => (
              <li key={`${l.slug}-${l.size}-${l.color}`} className="drawer-line">
                <a href={`#produit-${l.slug}`} className="drawer-thumb" onClick={() => setOpen(false)}>
                  <Visual motif={l.product.motif} tone={l.product.tone} category={l.product.category} ratio="3 / 4" />
                </a>
                <div className="drawer-line-body">
                  <a href={`#produit-${l.slug}`} className="drawer-name" onClick={() => setOpen(false)}>
                    {l.product.name}
                  </a>
                  <span className="drawer-meta">
                    {l.color} · {l.size}
                  </span>
                  <div className="drawer-line-foot">
                    <div className="qty" aria-label="Quantité">
                      <button onClick={() => cart.setQty(i, l.qty - 1)} aria-label="Retirer un">
                        <Icon name="minus" size={14} />
                      </button>
                      <span>{l.qty}</span>
                      <button onClick={() => cart.setQty(i, l.qty + 1)} aria-label="Ajouter un">
                        <Icon name="plus" size={14} />
                      </button>
                    </div>
                    <span className="price">{formatPrice(l.qty * l.product.price)}</span>
                  </div>
                  <button className="drawer-remove" onClick={() => cart.remove(i)}>
                    Retirer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {cart.lines.length > 0 && (
          <footer className="drawer-foot">
            <div className="drawer-total">
              <span>Sous-total</span>
              <span className="price">{formatPrice(cart.total)}</span>
            </div>
            <p className="drawer-note">Paiement à la livraison, Wave ou Orange Money. Frais de livraison calculés à la commande.</p>
            <button className="btn btn-dark btn-block">
              <Icon name="whatsapp" /> Commander sur WhatsApp
            </button>
            <button className="btn btn-outline btn-block" onClick={() => setOpen(false)}>
              Continuer mes achats
            </button>
          </footer>
        )}
      </aside>
    </div>
  )
}
