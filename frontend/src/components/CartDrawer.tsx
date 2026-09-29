import { useEffect, useState } from 'react'
import { api, ApiError } from '../api/client'
import { formatPrice, type CustomerRequest } from '../api/types'
import { useCart } from '../lib/cartContext'
import { useCatalog } from '../lib/catalogContext'
import { whatsappLink } from '../lib/format'
import Icon from './Icon'
import Visual from './Visual'

type Step = 'cart' | 'details' | 'done'

export default function CartDrawer() {
  const cart = useCart()
  const { settings } = useCatalog()
  const { open, setOpen } = cart
  const [step, setStep] = useState<Step>('cart')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<CustomerRequest | null>(null)
  const threshold = settings?.freeShippingThreshold ?? 50000

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  const close = () => {
    setOpen(false)
    if (step === 'done') setStep('cart')
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      const created = await api.createRequest({
        type: 'ORDER',
        customerName: name,
        phone,
        message: message || undefined,
        items: cart.lines.map((l) => ({ slug: l.slug, size: l.size, color: l.color, qty: l.qty })),
      })
      setOrder(created)
      cart.clear()
      setStep('done')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'La commande n’a pas pu être envoyée.')
    } finally {
      setSending(false)
    }
  }

  const remaining = Math.max(0, threshold - cart.total)
  const orderText = order
    ? `Bonjour KAOM, je viens de passer la commande n° ${order.id} sur le site :\n${order.items ?? ''}\nTotal : ${formatPrice(order.total)}\nNom : ${order.customerName}`
    : ''

  return (
    <div className="drawer-root" data-open={open} aria-hidden={!open}>
      <div className="drawer-scrim" onClick={close} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Panier">
        <header className="drawer-head">
          <h2>{step === 'details' ? 'Vos coordonnées' : step === 'done' ? 'Commande envoyée' : `Panier (${cart.count})`}</h2>
          <button className="icon-btn" onClick={close} aria-label="Fermer le panier">
            <Icon name="close" />
          </button>
        </header>

        {step === 'done' && order && (
          <div className="drawer-done">
            <p className="drawer-done-title">Merci {order.customerName} !</p>
            <p>
              Votre commande n° {order.id} ({formatPrice(order.total)}) est bien enregistrée. La créatrice vous contacte au{' '}
              {order.phone} pour confirmer la taille, la livraison et le paiement.
            </p>
            <a className="btn btn-dark btn-block" href={whatsappLink(settings?.whatsapp, orderText)} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" /> Écrire sur WhatsApp
            </a>
            <button className="btn btn-outline btn-block" onClick={close}>
              Continuer mes achats
            </button>
          </div>
        )}

        {step !== 'done' && (
          <div className="drawer-ship">
            <p>{remaining > 0 ? `Plus que ${formatPrice(remaining)} pour la livraison offerte à Dakar.` : 'Livraison offerte à Dakar.'}</p>
            <div className="drawer-bar">
              <span style={{ width: `${Math.min(100, (cart.total / threshold) * 100)}%` }} />
            </div>
          </div>
        )}

        {step === 'cart' && cart.lines.length === 0 && (
          <div className="drawer-empty">
            <p>Votre panier est vide.</p>
            <a className="btn btn-dark" href="#collections" onClick={close}>
              Voir la boutique
            </a>
          </div>
        )}

        {step === 'cart' && cart.lines.length > 0 && (
          <ul className="drawer-lines">
            {cart.lines.map((l, i) => (
              <li key={`${l.slug}-${l.size}-${l.color}`} className="drawer-line">
                <a href={`#produit-${l.slug}`} className="drawer-thumb" onClick={close}>
                  <Visual src={l.product.images[0]?.url} motif={l.product.motif} tone={l.product.tone} category={l.product.category} ratio="3 / 4" />
                </a>
                <div className="drawer-line-body">
                  <a href={`#produit-${l.slug}`} className="drawer-name" onClick={close}>
                    {l.product.name}
                  </a>
                  <span className="drawer-meta">
                    {[l.color, l.size].filter(Boolean).join(' · ')}
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

        {step === 'details' && (
          <form id="checkout" className="drawer-form" onSubmit={submit}>
            <p className="muted">La créatrice vous rappelle pour confirmer la commande. Aucun paiement n’est demandé en ligne.</p>
            <label className="field">
              <span>Nom complet</span>
              <input id="co-name" required maxLength={120} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="field">
              <span>Téléphone (WhatsApp)</span>
              <input id="co-phone" required maxLength={40} type="tel" autoComplete="tel" placeholder="+221 77 000 00 00" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label className="field">
              <span>Adresse de livraison, précisions (facultatif)</span>
              <textarea id="co-message" rows={3} maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)} />
            </label>
            {error && <p className="form-note form-error" role="alert">{error}</p>}
          </form>
        )}

        {step !== 'done' && cart.lines.length > 0 && (
          <footer className="drawer-foot">
            <div className="drawer-total">
              <span>Sous-total</span>
              <span className="price">{formatPrice(cart.total)}</span>
            </div>
            <p className="drawer-note">Paiement à la livraison, Wave ou Orange Money. Frais de livraison confirmés par la créatrice.</p>
            {step === 'cart' ? (
              <button className="btn btn-dark btn-block" onClick={() => setStep('details')}>
                Commander
              </button>
            ) : (
              <>
                <button className="btn btn-dark btn-block" type="submit" form="checkout" disabled={sending}>
                  {sending ? 'Envoi…' : 'Envoyer ma commande'}
                </button>
                <button className="btn btn-outline btn-block" onClick={() => setStep('cart')}>
                  Retour au panier
                </button>
              </>
            )}
          </footer>
        )}
      </aside>
    </div>
  )
}
