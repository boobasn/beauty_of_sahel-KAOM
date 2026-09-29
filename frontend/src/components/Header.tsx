import { useState } from 'react'
import Wordmark from './Wordmark'

const nav = [
  { href: '#collections', label: 'Boutique' },
  { href: '#collection-harmattan', label: 'Harmattan AH26' },
  { href: '#lookbook', label: 'Lookbook' },
  { href: '#sur-mesure', label: 'Sur mesure' },
  { href: '#atelier', label: "L'atelier" },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="announce">
        <span>Livraison à Dakar sous 24 h</span>
        <span className="announce-sep" aria-hidden="true">·</span>
        <span>Expédition Europe et Amérique du Nord</span>
        <span className="announce-sep hide-sm" aria-hidden="true">·</span>
        <span className="hide-sm">Sur mesure en 3 semaines</span>
      </div>
      <header className="site-header">
        <div className="site-header-inner">
          <button
            className="icon-btn menu-btn"
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="burger" data-open={open} />
          </button>
          <a href="#" className="brand" aria-label="Accueil KAOM Beauty of Sahel">
            <Wordmark />
            <span className="brand-sub">Beauty of Sahel</span>
          </a>
          <nav id="main-nav" className="main-nav" data-open={open} onClick={() => setOpen(false)}>
            {nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a className="icon-btn" href="#collections" aria-label="Rechercher">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M16 16 L21 21" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </a>
            <a className="icon-btn" href="#collections" aria-label="Favoris (2)">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  d="M12 20 C4 14 3 10 3 8 A4.5 4.5 0 0 1 12 6 A4.5 4.5 0 0 1 21 8 C21 10 20 14 12 20 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
              <span className="icon-count">2</span>
            </a>
            <a className="btn btn-ink btn-sm hide-sm" href="#sur-mesure">
              Prendre rendez-vous
            </a>
          </div>
        </div>
      </header>
    </>
  )
}
