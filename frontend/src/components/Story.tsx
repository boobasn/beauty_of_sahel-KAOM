import Visual from './Visual'

// Blocs éditoriaux de la page d'accueil : ouverture, bandeau et citations.

export function StoryOpening() {
  return (
    <section className="opening">
      <div className="container opening-grid">
        <div className="opening-copy">
          <p className="eyebrow">Maison KAOM · Beauty of Sahel · Dakar</p>
          <h1 className="opening-title">
            L’élégance
            <br />
            <em>afro-moderne.</em>
          </h1>
          <p className="opening-lead">
            Prêt-à-porter et sur mesure conçus à Dakar. Des pièces fortes pour tous les jours et pour
            les grandes occasions.
          </p>
          <div className="opening-ctas">
            <a className="btn btn-dark" href="#collection-harmattan">
              Acheter la collection
            </a>
            <a className="btn btn-outline" href="#sur-mesure">
              Créer ma pièce sur mesure
            </a>
          </div>
        </div>

        <div className="opening-collage" aria-hidden="true">
          <div className="collage-main">
            <Visual motif="bazin" tone="henne" category="BOUBOUS" ratio="3 / 4" />
          </div>
          <div className="collage-swatch">
            <Visual motif="indigo" tone="indigo" ratio="1 / 1" />
          </div>
          <div className="collage-small">
            <Visual motif="bogolan" tone="mil" category="VESTES" ratio="4 / 5" />
          </div>
          <span className="collage-caption">Collection Harmattan, automne-hiver 2026</span>
        </div>
      </div>

      <div className="container opening-meta">
        <span>Livraison 24 h à Dakar</span>
        <span>Pièces en petites séries</span>
        <span>Prêt-à-porter et sur mesure</span>
      </div>
    </section>
  )
}

const words = ['Élégance', 'Bazin riche', 'Sur mesure', 'Bogolan', 'Afro-moderne', 'Indigo', 'Broderie main', 'Wax']

export function Ticker() {
  const row = [...words, ...words]
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {row.map((w, i) => (
          <span key={i}>
            {w}
            <span className="ticker-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

interface QuoteProps {
  text: string
  author: string
  variant?: 'plain' | 'soft'
}

export function Quote({ text, author, variant = 'plain' }: QuoteProps) {
  return (
    <section className={`quote quote-${variant}`}>
      <figure className="container quote-inner">
        <span className="quote-mark" aria-hidden="true">
          “
        </span>
        <blockquote className="quote-text">{text}</blockquote>
        <figcaption className="quote-author">{author}</figcaption>
      </figure>
    </section>
  )
}
