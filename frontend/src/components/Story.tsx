import Visual from './Visual'
import type { Category, Motif, Tone } from '../data/catalog'

// Récit de marque de la page d'accueil.
// Textes proposés à valider avec la créatrice : ils décrivent la démarche de la maison,
// pas sa biographie, qui reste à écrire avec elle.

export function StoryOpening() {
  return (
    <section className="opening">
      <div className="container opening-grid">
        <div className="opening-copy">
          <p className="eyebrow">Maison KAOM · Beauty of Sahel · Dakar</p>
          <h1 className="opening-title">
            Le Sahel,
            <br />
            <em>cousu main.</em>
          </h1>
          <p className="opening-lead">
            Des tissus qui ont traversé le fleuve, le désert et des générations de mains. Nous les
            coupons à Dakar pour celles et ceux qui portent leur héritage avec fierté, tous les jours.
          </p>
          <div className="opening-ctas">
            <a className="btn btn-dark" href="#histoire">
              Découvrir notre histoire
            </a>
            <a className="btn btn-outline" href="#collection-harmattan">
              Voir la collection
            </a>
          </div>
        </div>

        <div className="opening-collage" aria-hidden="true">
          <div className="collage-main">
            <Visual motif="bazin" tone="henne" category="Boubous" ratio="3 / 4" />
          </div>
          <div className="collage-swatch">
            <Visual motif="indigo" tone="indigo" ratio="1 / 1" />
          </div>
          <div className="collage-small">
            <Visual motif="bogolan" tone="mil" category="Vestes" ratio="4 / 5" />
          </div>
          <span className="collage-caption">Bazin latérite, indigo de Kaédi, bogolan de Ségou</span>
        </div>
      </div>

      <div className="container opening-meta">
        <span>Tissus du Sénégal, du Mali et de Mauritanie</span>
        <span>Coupé et cousu à Dakar</span>
        <span>Prêt-à-porter et sur mesure</span>
      </div>
    </section>
  )
}

const words = ['Bazin riche', 'Bogolan', 'Indigo', 'Thioup', 'Wax', 'Broderie main', 'Dakar', 'Ségou', 'Kaédi', 'Bamako']

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

export function Manifesto() {
  return (
    <section className="manifesto" id="histoire">
      <div className="container manifesto-inner">
        <p className="eyebrow">Notre histoire</p>
        <p className="manifesto-text">
          Chaque vêtement KAOM commence par un tissu qui a <em>déjà une histoire</em>&nbsp;: celle d’une
          teinturière penchée sur sa cuve d’indigo, d’un tisserand qui compte ses fils, d’un brodeur
          de la Médina. Notre métier, c’est de la faire <em>continuer sur vous</em>.
        </p>
        <p className="manifesto-sub">
          Beauty of Sahel est née d’une idée simple&nbsp;: les tissus de chez nous méritent les coupes
          d’aujourd’hui. Pas de costume, pas de folklore. Des pièces que l’on porte au bureau, à un
          mariage, à Paris ou à Saint-Louis, et qui disent d’où l’on vient.
        </p>
      </div>
    </section>
  )
}

const chapters: {
  n: string
  place: string
  title: string
  text: string
  motif: Motif
  tone: Tone
  category?: Category
  caption: string
}[] = [
  {
    n: 'I',
    place: 'Kaédi, vallée du fleuve',
    title: 'Tout commence au bord de l’eau',
    text: 'Les artisanes plongent le coton dans l’indigo, le sortent, le laissent s’oxyder à l’air, puis recommencent. Il faut jusqu’à huit bains pour obtenir le bleu nuit de la collection Fleuve.',
    motif: 'indigo',
    tone: 'indigo',
    caption: 'Le bain d’indigo',
  },
  {
    n: 'II',
    place: 'Ségou et Bamako',
    title: 'Des mains qui savent',
    text: 'À Ségou, le bogolan est peint à la boue fermentée, motif après motif. À Bamako, le bazin est teint puis battu au maillet jusqu’à prendre ce brillant qu’aucune machine n’imite.',
    motif: 'bogolan',
    tone: 'mil',
    caption: 'Le bogolan sèche au soleil',
  },
  {
    n: 'III',
    place: 'L’atelier, Dakar',
    title: 'La coupe d’aujourd’hui',
    text: 'À l’atelier, on dessine des volumes qui respirent et des lignes nettes. Chaque pièce est coupée, cousue et finie à la main, en petites séries, pour que rien ne se perde.',
    motif: 'bazin',
    tone: 'henne',
    category: 'Boubous',
    caption: 'Le boubou Latérite en finition',
  },
  {
    n: 'IV',
    place: 'Partout où vous allez',
    title: 'La dernière main, c’est la vôtre',
    text: 'Un vêtement KAOM n’est terminé que lorsqu’il est porté. Au bureau, pour la Tabaski, un mariage ou un dimanche à la plage de Ngor, il continue l’histoire du Sahel avec vous.',
    motif: 'tissage',
    tone: 'sable',
    category: 'Robes',
    caption: 'La robe Tiaya, portée',
  },
]

export function Chapters() {
  return (
    <section className="chapters">
      <div className="container">
        <div className="section-head section-head-center">
          <p className="eyebrow">Du fil à la pièce</p>
          <h2 className="h2">Le voyage d’un vêtement KAOM</h2>
        </div>
        <ol className="chapter-list">
          {chapters.map((c, i) => (
            <li key={c.n} className="chapter" data-flip={i % 2 === 1}>
              <div className="chapter-visual">
                <Visual motif={c.motif} tone={c.tone} category={c.category} ratio="4 / 5" label={c.caption} />
              </div>
              <div className="chapter-body">
                <span className="chapter-n">{c.n}</span>
                <p className="chapter-place">{c.place}</p>
                <h3 className="chapter-title">{c.title}</h3>
                <p className="chapter-text">{c.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

// Chiffres à confirmer avec la créatrice avant la mise en ligne.
const figures = [
  { value: '8', unit: 'bains', label: 'd’indigo pour le bleu nuit de Fleuve' },
  { value: '3', unit: 'semaines', label: 'pour une pièce sur mesure' },
  { value: '100', unit: '%', label: 'des pièces coupées et cousues à Dakar' },
  { value: '3', unit: 'pays', label: 'd’où viennent nos tissus' },
]

export function Figures() {
  return (
    <section className="figures" aria-label="KAOM en chiffres">
      <div className="container figures-inner">
        {figures.map((f) => (
          <div key={f.label} className="figure">
            <p className="figure-value">
              {f.value}
              <span>{f.unit}</span>
            </p>
            <p className="figure-label">{f.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
