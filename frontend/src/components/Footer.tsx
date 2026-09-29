import { useState } from 'react'
import Icon, { type IconName } from './Icon'
import Wordmark from './Wordmark'

const services: { icon: IconName; title: string; text: string }[] = [
  { icon: 'truck', title: 'Livraison 24 h à Dakar', text: 'Expédition suivie vers la sous-région, l’Europe et l’Amérique du Nord' },
  { icon: 'wallet', title: 'Paiement simple', text: 'Wave, Orange Money, carte ou paiement à la livraison' },
  { icon: 'refresh', title: 'Échange sous 14 jours', text: 'Sur toutes les pièces du prêt-à-porter' },
  { icon: 'scissors', title: 'Sur mesure', text: 'Vos mesures, votre tissu, livré en 3 semaines' },
]

export function Services() {
  return (
    <section className="services" aria-label="Nos services">
      <div className="container services-inner">
        {services.map((s) => (
          <div key={s.title} className="service">
            <Icon name={s.icon} size={28} />
            <div>
              <p className="service-title">{s.title}</p>
              <p className="service-text">{s.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Footer() {
  const [sent, setSent] = useState(false)
  return (
    <footer className="site-footer">
      <section className="newsletter">
        <div className="container newsletter-inner">
          <div>
            <h2 className="h2">Rejoignez la maison KAOM</h2>
            <p>Nouvelles collections, ventes privées et dates d’essayage, une fois par mois.</p>
          </div>
          <form
            className="news-form"
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
          >
            <label htmlFor="news-email" className="sr-only">Adresse e-mail</label>
            <input id="news-email" type="email" required placeholder="Votre adresse e-mail" />
            <button className="btn btn-dark" type="submit">S’inscrire</button>
            {sent && <p className="form-note" role="status">Inscription enregistrée. Merci.</p>}
          </form>
        </div>
      </section>

      <div className="container footer-grid">
        <div className="footer-brand">
          <Wordmark />
          <p>Prêt-à-porter afro-moderne et sur mesure, conçu et cousu à Dakar dans les tissus du Sahel.</p>
          <a href="https://www.instagram.com/beauty_of_sahel" target="_blank" rel="noreferrer" className="footer-social">
            Instagram @beauty_of_sahel
          </a>
        </div>
        <div className="footer-col">
          <h3>Boutique</h3>
          <a href="#collections">Nouveautés</a>
          <a href="#collection-harmattan">Harmattan AH26</a>
          <a href="#collection-fleuve">Fleuve PE26</a>
          <a href="#collection-ceremonie">Capsule Cérémonie</a>
        </div>
        <div className="footer-col">
          <h3>Aide</h3>
          <a href="#produit-grand-boubou-laterite">Guide des tailles</a>
          <a href="#sur-mesure">Livraison et retours</a>
          <a href="#sur-mesure">Commande sur mesure</a>
          <a href="#backoffice">Espace créatrice</a>
        </div>
        <div className="footer-col">
          <h3>Atelier</h3>
          <span className="selectable">Sacré-Cœur 3, Dakar</span>
          <span>Lun–Sam, 10 h – 19 h</span>
          <span className="selectable">+221 77 000 00 00</span>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 KAOM · Beauty of Sahel</span>
        <span className="pay">
          {['Wave', 'Orange Money', 'Visa', 'Mastercard'].map((p) => (
            <span key={p} className="pay-chip">{p}</span>
          ))}
        </span>
      </div>
    </footer>
  )
}
