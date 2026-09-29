import { useEffect, useState } from 'react'
import { Services } from '../components/Footer'
import Icon from '../components/Icon'
import ProductCard from '../components/ProductCard'
import SahelScene from '../components/SahelScene'
import { Quote, StoryOpening, Ticker } from '../components/Story'
import Visual from '../components/Visual'
import { findProduct, formatPrice, products, type Motif, type Tone } from '../data/catalog'

const slides: { eyebrow: string; title: string; text: string; cta: string; href: string; motif: Motif; tone: Tone }[] = [
  {
    eyebrow: 'Nouvelle collection · Automne-Hiver 2026',
    title: 'Harmattan',
    text: 'Bazin riche et coton tissé main, des volumes amples aux couleurs de latérite.',
    cta: 'Découvrir la collection',
    href: '#collection-harmattan',
    motif: 'bazin',
    tone: 'henne',
  },
  {
    eyebrow: 'Printemps-Été 2026',
    title: 'Fleuve',
    text: 'Lin léger et bleu indigo, des lignes fluides pensées pour la chaleur.',
    cta: 'Acheter Fleuve',
    href: '#collection-fleuve',
    motif: 'indigo',
    tone: 'indigo',
  },
  {
    eyebrow: 'Capsule Tabaski · jusqu’à -20 %',
    title: 'Cérémonie',
    text: 'Grands boubous et kaftans brodés main pour les jours de fête.',
    cta: 'Voir les promotions',
    href: '#collection-ceremonie',
    motif: 'bogolan',
    tone: 'nuit',
  },
]

const categoryTiles = [
  { name: 'Femme', count: 42, motif: 'tissage', tone: 'sable', category: 'Robes' },
  { name: 'Homme', count: 23, motif: 'bogolan', tone: 'nuit', category: 'Kaftans' },
  { name: 'Accessoires', count: 21, motif: 'wax', tone: 'henne', category: 'Accessoires' },
  { name: 'Ensembles', count: 12, motif: 'indigo', tone: 'indigo', category: 'Ensembles' },
] as const

const tabs = [
  { key: 'new', label: 'Nouveautés' },
  { key: 'best', label: 'Meilleures ventes' },
  { key: 'sale', label: 'Promotions' },
] as const

const journal = [
  { tag: 'Style', title: 'Trois façons de porter le boubou au quotidien', motif: 'indigo', tone: 'indigo' },
  { tag: 'Guide', title: 'Comment entretenir un boubou en bazin riche', motif: 'bazin', tone: 'sable' },
  { tag: 'Coulisses', title: 'Dans les coulisses du shooting Harmattan', motif: 'tissage', tone: 'mil' },
] as const

// Points posés sur la photo du look (en % de l'image).
const lookSpots = [
  { slug: 'grand-boubou-laterite', x: 48, y: 42 },
  { slug: 'sac-tanneur', x: 74, y: 70 },
]

function HeroSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (paused || reduce) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), 6000)
    return () => window.clearTimeout(t)
  }, [index, paused])

  const go = (i: number) => setIndex((i + slides.length) % slides.length)

  return (
    <section
      className="hero"
      aria-roledescription="carrousel"
      aria-label="Collections à la une"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={s.title}
          className="hero-slide"
          data-active={i === index}
          aria-hidden={i !== index}
          aria-roledescription="diapositive"
          aria-label={`${i + 1} sur ${slides.length}`}
        >
          <div className="hero-media">
            <Visual motif={s.motif} tone={s.tone} category={i === 1 ? 'Ensembles' : 'Boubous'} ratio="auto" className="hero-visual" />
          </div>
          <div className="container hero-content">
            <div className="hero-text">
              <p className="eyebrow">{s.eyebrow}</p>
              <h2 className="hero-title">{s.title}</h2>
              <p className="hero-lead">{s.text}</p>
              <a className="btn btn-dark" href={s.href} tabIndex={i === index ? 0 : -1}>
                {s.cta}
              </a>
            </div>
          </div>
        </div>
      ))}
      <div className="container hero-controls">
        <div className="hero-dots">
          {slides.map((s, i) => (
            <button key={s.title} aria-label={`Afficher ${s.title}`} aria-current={i === index} onClick={() => go(i)}>
              <span className="hero-dot-n">0{i + 1}</span>
              <span className="hero-dot-bar" />
            </button>
          ))}
        </div>
        <div className="hero-arrows">
          <button className="round-btn" onClick={() => go(index - 1)} aria-label="Diapositive précédente">
            <Icon name="chevronL" />
          </button>
          <button className="round-btn" onClick={() => go(index + 1)} aria-label="Diapositive suivante">
            <Icon name="chevronR" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [tab, setTab] = useState<(typeof tabs)[number]['key']>('new')
  const [spot, setSpot] = useState(lookSpots[0].slug)
  const visible = products.filter((p) => p.status !== 'Brouillon')
  const list =
    tab === 'best'
      ? visible.filter((p) => p.bestseller)
      : tab === 'sale'
        ? visible.filter((p) => p.oldPrice)
        : visible.slice(0, 8)
  const spotProduct = findProduct(spot)!

  return (
    <main>
      <StoryOpening />
      <Ticker />
      <SahelScene quote="Une élégance née au Sahel, faite pour être remarquée partout." author="KAOM · Beauty of Sahel" />

      {/* LA SAISON */}
      <section className="season">
        <div className="container section-head">
          <div>
            <p className="eyebrow">La saison</p>
            <h2 className="h2">Trois collections, trois paysages</h2>
          </div>
          <a className="link-underline" href="#collections">Toute la boutique</a>
        </div>
        <HeroSlider />
      </section>
      <Services />

      {/* CATÉGORIES */}
      <section className="section">
        <div className="container">
          <div className="section-head section-head-center">
            <p className="eyebrow">Acheter par catégorie</p>
            <h2 className="h2">Trouvez votre silhouette</h2>
          </div>
          <div className="cat-grid">
            {categoryTiles.map((c) => (
              <a key={c.name} href="#collections" className="cat-tile">
                <Visual motif={c.motif} tone={c.tone} category={c.category} ratio="3 / 4" />
                <span className="cat-tile-label">
                  <span className="cat-tile-name">{c.name}</span>
                  <span className="cat-tile-count">{c.count} pièces</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUITS PAR ONGLETS */}
      <section className="section section-tight">
        <div className="container">
          <div className="section-head section-head-center">
            <h2 className="h2">La boutique</h2>
            <div className="tabs" role="tablist" aria-label="Sélection de produits">
              {tabs.map((t) => (
                <button key={t.key} role="tab" aria-selected={tab === t.key} className="tab" onClick={() => setTab(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="product-grid">
            {list.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="center">
            <a className="btn btn-outline" href="#collections">
              Voir toute la boutique
            </a>
          </div>
        </div>
      </section>

      {/* BANNIÈRES PROMO */}
      <section className="section section-tight">
        <div className="container promo-grid">
          <a href="#collection-ceremonie" className="promo promo-dark">
            <Visual motif="bogolan" tone="nuit" category="Kaftans" ratio="auto" className="promo-visual" />
            <span className="promo-text">
              <span className="eyebrow">Capsule Tabaski</span>
              <span className="promo-title">Jusqu’à -20 % sur la Cérémonie</span>
              <span className="link-underline">J’en profite</span>
            </span>
          </a>
          <a href="#sur-mesure" className="promo">
            <Visual motif="tissage" tone="sable" category="Robes" ratio="auto" className="promo-visual" />
            <span className="promo-text">
              <span className="eyebrow">Atelier de Dakar</span>
              <span className="promo-title">Votre pièce sur mesure dès 65 000 FCFA</span>
              <span className="link-underline">Prendre rendez-vous</span>
            </span>
          </a>
        </div>
      </section>

      <Quote text="Les modes passent, le style est éternel." author="Yves Saint Laurent" variant="soft" />

      {/* SHOP THE LOOK */}
      <section className="section section-soft" id="lookbook">
        <div className="container look">
          <div className="look-media">
            <Visual motif="bazin" tone="henne" category="Boubous" ratio="4 / 5" label="Look 01 · Harmattan" />
            {lookSpots.map((s) => (
              <button
                key={s.slug}
                className="spot"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                aria-pressed={spot === s.slug}
                aria-label={`Voir ${findProduct(s.slug)?.name}`}
                onClick={() => setSpot(s.slug)}
              >
                <span />
              </button>
            ))}
          </div>
          <div className="look-body">
            <p className="eyebrow">Shop the look</p>
            <h2 className="h2">Look 01, Harmattan</h2>
            <p className="muted">Grand boubou en bazin latérite porté avec le sac Tanneur en cuir tanné végétal.</p>
            <div className="look-card">
              <Visual motif={spotProduct.motif} tone={spotProduct.tone} category={spotProduct.category} ratio="3 / 4" />
              <div>
                <p className="pcard-cat">{spotProduct.category}</p>
                <p className="look-card-name">{spotProduct.name}</p>
                <p className="price">{formatPrice(spotProduct.price)}</p>
                <a className="link-underline" href={`#produit-${spotProduct.slug}`}>
                  Voir la pièce
                </a>
              </div>
            </div>
            <p className="look-total">
              Le look complet :{' '}
              <strong>{formatPrice(lookSpots.reduce((n, s) => n + (findProduct(s.slug)?.price ?? 0), 0))}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* SUR MESURE */}
      <section className="section" id="sur-mesure">
        <div className="container bespoke">
          <div className="bespoke-head">
            <p className="eyebrow">Sur mesure</p>
            <h2 className="h2">Une pièce coupée pour vous, en quatre étapes</h2>
            <p className="muted">Mariage, baptême, Tabaski : on prend vos mesures à l’atelier ou en visio.</p>
            <a className="btn btn-dark" href="#sur-mesure">Prendre rendez-vous</a>
          </div>
          <ol className="steps">
            {[
              ['Rendez-vous', 'Prise de mesures à Sacré-Cœur ou en visio.'],
              ['Choix du tissu', 'Bazin, lin indigo, bogolan ou votre propre tissu.'],
              ['Essayage', 'Ajustement des volumes à mi-parcours.'],
              ['Livraison', 'Retrait à Dakar ou envoi suivi, en 3 semaines.'],
            ].map(([t, d], i) => (
              <li key={t} className="step">
                <span className="step-n">{i + 1}</span>
                <p className="step-title">{t}</p>
                <p className="muted">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CLÔTURE DU RÉCIT */}
      <section className="closing">
        <div className="container closing-inner">
          <p className="closing-title">
            « La mode se démode,
            <br />
            <em>le style jamais.</em> »
          </p>
          <p className="closing-author">Coco Chanel</p>
          <div className="opening-ctas">
            <a className="btn btn-light" href="#collection-harmattan">Acheter Harmattan</a>
            <a className="btn btn-outline-light" href="#sur-mesure">Créer ma pièce sur mesure</a>
          </div>
        </div>
      </section>

      {/* JOURNAL */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Le journal</p>
              <h2 className="h2">Histoires d’atelier</h2>
            </div>
            <a className="link-underline" href="#atelier">Tous les articles</a>
          </div>
          <div className="journal-grid" id="atelier">
            {journal.map((j) => (
              <article key={j.title} className="post">
                <Visual motif={j.motif} tone={j.tone} ratio="16 / 10" />
                <p className="post-tag">{j.tag}</p>
                <h3 className="post-title">{j.title}</h3>
                <span className="link-underline">Lire l’article</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="section section-tight">
        <div className="section-head section-head-center container">
          <p className="eyebrow">Suivez-nous</p>
          <h2 className="h2">
            <a href="https://www.instagram.com/beauty_of_sahel" target="_blank" rel="noreferrer">@beauty_of_sahel</a>
          </h2>
        </div>
        <div className="insta-grid">
          {(['bazin', 'indigo', 'bogolan', 'wax', 'tissage', 'bazin'] as const).map((m, i) => (
            <a key={i} href="https://www.instagram.com/beauty_of_sahel" target="_blank" rel="noreferrer" className="insta" aria-label="Voir sur Instagram">
              <Visual motif={m} tone={(['henne', 'indigo', 'nuit', 'mil', 'sable', 'indigo'] as const)[i]} ratio="1 / 1" />
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
