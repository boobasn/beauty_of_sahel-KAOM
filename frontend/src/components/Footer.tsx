import { useState } from 'react'
import Wordmark from './Wordmark'

export default function Footer() {
  const [sent, setSent] = useState(false)
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-news">
          <p className="eyebrow">La lettre de l'atelier</p>
          <h2 className="h2">Les nouvelles pièces, avant tout le monde.</h2>
          <form
            className="news-form"
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
          >
            <label htmlFor="news-email" className="sr-only">
              Adresse e-mail
            </label>
            <input id="news-email" type="email" required placeholder="votre@email.com" />
            <button className="btn btn-ink" type="submit">
              S'inscrire
            </button>
          </form>
          {sent && <p className="form-note">Inscription enregistrée. Merci.</p>}
        </div>
        <div className="footer-cols">
          <div>
            <h3 className="footer-h">Boutique</h3>
            <a href="#collections">Toutes les pièces</a>
            <a href="#collection-harmattan">Harmattan AH26</a>
            <a href="#collection-fleuve">Fleuve PE26</a>
            <a href="#collection-ceremonie">Capsule Cérémonie</a>
          </div>
          <div>
            <h3 className="footer-h">Maison</h3>
            <a href="#atelier">L'atelier</a>
            <a href="#sur-mesure">Sur mesure</a>
            <a href="#lookbook">Lookbook</a>
            <a href="#backoffice">Espace créatrice</a>
          </div>
          <div>
            <h3 className="footer-h">Contact</h3>
            <span className="selectable">+221 77 000 00 00</span>
            <span className="selectable">Sacré-Cœur 3, Dakar</span>
            <a href="https://www.instagram.com/beauty_of_sahel" target="_blank" rel="noreferrer">
              Instagram @beauty_of_sahel
            </a>
          </div>
        </div>
      </div>
      <div className="footer-mark" aria-hidden="true">
        <Wordmark size="xl" />
      </div>
      <div className="container footer-bottom">
        <span>© 2026 KAOM · Beauty of Sahel</span>
        <span>Conçu et cousu à Dakar</span>
      </div>
    </footer>
  )
}
