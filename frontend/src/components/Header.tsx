import { useState } from 'react'
import { useCart } from '../lib/cartContext'
import { useCatalog } from '../lib/catalogContext'
import { formatPhone } from '../lib/format'
import { formatPrice } from '../api/types'
import Icon from './Icon'
import Visual from './Visual'
import Wordmark from './Wordmark'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mega, setMega] = useState(false)
  const cart = useCart()
  const { collections, products, settings } = useCatalog()
  const close = () => {
    setMenuOpen(false)
    setMega(false)
  }

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <span>Livraison offerte à Dakar dès {formatPrice(settings?.freeShippingThreshold ?? 50000)}</span>
          <span className="topbar-right">
            <span className="selectable">WhatsApp {formatPhone(settings?.whatsapp)}</span>
            <span className="topbar-sep" aria-hidden="true" />
            <span>FR · FCFA</span>
          </span>
        </div>
      </div>

      <header className="site-header" onMouseLeave={() => setMega(false)}>
        <div className="container header-inner">
          <button className="icon-btn menu-btn" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen((v) => !v)}>
            <Icon name={menuOpen ? 'close' : 'menu'} />
            <span className="sr-only">Menu</span>
          </button>

          <nav id="main-nav" className="main-nav" data-open={menuOpen}>
            <a href="#collections" onClick={close}>Nouveautés</a>
            <button className="nav-mega-trigger" aria-expanded={mega} onMouseEnter={() => setMega(true)} onClick={() => setMega((v) => !v)}>
              Boutique
            </button>
            <a href={collections[0] ? `#collection-${collections[0].slug}` : '#collections'} onClick={close}>Collections</a>
            <a href="#sur-mesure" onClick={close}>Sur mesure</a>
            <a href="#promotions" className="nav-sale" onClick={close}>Promotions</a>
          </nav>

          <a href="#" className="brand" aria-label="KAOM Beauty of Sahel, accueil">
            <Wordmark />
            <span className="brand-sub">Beauty of Sahel</span>
          </a>

          <div className="header-actions">
            <a className="icon-btn" href="#collections" aria-label="Rechercher">
              <Icon name="search" />
            </a>
            <a className="icon-btn hide-sm" href="#admin" aria-label="Espace créatrice">
              <Icon name="user" />
            </a>
            <a className="icon-btn hide-sm" href="#collections" aria-label={`Favoris (${cart.wishlist.length})`}>
              <Icon name="heart" />
              {cart.wishlist.length > 0 && <span className="icon-count">{cart.wishlist.length}</span>}
            </a>
            <button className="icon-btn" aria-label={`Panier (${cart.count})`} onClick={() => cart.setOpen(true)}>
              <Icon name="bag" />
              {cart.count > 0 && <span className="icon-count">{cart.count}</span>}
            </button>
          </div>
        </div>

        {mega && (
          <div className="mega">
            <div className="container mega-inner">
              <div className="mega-col">
                <p className="mega-h">Femme</p>
                {['Robes', 'Boubous', 'Ensembles', 'Kaftans'].map((c) => (
                  <a key={c} href="#collections" onClick={close}>{c}</a>
                ))}
              </div>
              <div className="mega-col">
                <p className="mega-h">Homme</p>
                {['Boubous', 'Kaftans', 'Vestes', 'Ensembles'].map((c) => (
                  <a key={c} href="#collections" onClick={close}>{c}</a>
                ))}
              </div>
              <div className="mega-col">
                <p className="mega-h">Accessoires</p>
                {['Sacs', 'Foulards', 'Bijoux'].map((c) => (
                  <a key={c} href="#collections" onClick={close}>{c}</a>
                ))}
                <a href="#collections" className="mega-all" onClick={close}>
                  Tout voir ({products.length} pièces)
                </a>
              </div>
              {collections.slice(0, 2).map((c) => (
                <a key={c.slug} href={`#collection-${c.slug}`} className="mega-tile" onClick={close}>
                  <Visual src={c.coverUrl} alt="" motif={c.motif} tone={c.tone} ratio="4 / 3" />
                  <span className="mega-tile-name">{c.name}</span>
                  <span className="mega-tile-sub">{c.season}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
