import { useEffect, useMemo, useState } from 'react'
import { api, ApiError } from '../api/client'
import { categoryLabels, formatPrice, type Category, type Collection, type Product } from '../api/types'
import { Services } from '../components/Footer'
import Icon from '../components/Icon'
import ProductCard from '../components/ProductCard'
import SahelScene from '../components/SahelScene'
import { Quote, StoryOpening, Ticker } from '../components/Story'
import Visual from '../components/Visual'
import { useCatalog } from '../lib/catalogContext'

const tabs = [
  { key: 'new', label: 'Nouveautés' },
  { key: 'best', label: 'Meilleures ventes' },
  { key: 'sale', label: 'Promotions' },
] as const

// Points posés sur la photo du look (en % de l'image), un par article du look.
const spotPositions = [
  { x: 48, y: 42 },
  { x: 74, y: 70 },
]

function HeroSlider({ collections }: { collections: Collection[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = collections.length

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (paused || reduce || count < 2) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % count), 6000)
    return () => window.clearTimeout(t)
  }, [index, paused, count])

  if (count === 0) return null
  const go = (i: number) => setIndex((i + count) % count)

  return (
    <section
      className="hero"
      aria-roledescription="carrousel"
      aria-label="Collections à la une"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {collections.map((c, i) => (
        <div
          key={c.slug}
          className="hero-slide"
          data-active={i === index}
          aria-hidden={i !== index}
          aria-roledescription="diapositive"
          aria-label={`${i + 1} sur ${count}`}
        >
          <div className="hero-media">
            <Visual src={c.coverUrl} motif={c.motif} tone={c.tone} category={i % 2 ? 'ENSEMBLES' : 'BOUBOUS'} ratio="auto" className="hero-visual" />
          </div>
          <div className="container hero-content">
            <div className="hero-text">
              {c.season && <p className="eyebrow">{c.season}</p>}
              <h2 className="hero-title">{c.name}</h2>
              {c.tagline && <p className="hero-lead">{c.tagline}</p>}
              <a className="btn btn-dark" href={`#collection-${c.slug}`} tabIndex={i === index ? 0 : -1}>
                Découvrir la collection
              </a>
            </div>
          </div>
        </div>
      ))}
      {count > 1 && (
        <div className="container hero-controls">
          <div className="hero-dots">
            {collections.map((c, i) => (
              <button key={c.slug} aria-label={`Afficher ${c.name}`} aria-current={i === index} onClick={() => go(i)}>
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
      )}
    </section>
  )
}

function ShopTheLook({ collection, items }: { collection: Collection; items: Product[] }) {
  const [spot, setSpot] = useState(items[0].slug)
  const current = items.find((p) => p.slug === spot) ?? items[0]
  const main = items[0]
  return (
    <section className="section section-soft" id="lookbook">
      <div className="container look">
        <div className="look-media">
          <Visual src={main.images[0]?.url} alt={main.name} motif={main.motif} tone={main.tone} category={main.category} ratio="4 / 5" label={`Look · ${collection.name}`} />
          {items.map((p, i) => (
            <button
              key={p.slug}
              className="spot"
              style={{ left: `${spotPositions[i].x}%`, top: `${spotPositions[i].y}%` }}
              aria-pressed={spot === p.slug}
              aria-label={`Voir ${p.name}`}
              onClick={() => setSpot(p.slug)}
            >
              <span />
            </button>
          ))}
        </div>
        <div className="look-body">
          <p className="eyebrow">Shop the look</p>
          <h2 className="h2">Le look {collection.name}</h2>
          <p className="muted">{items.map((p) => p.name).join(', porté avec ')}.</p>
          <div className="look-card">
            <Visual src={current.images[0]?.url} motif={current.motif} tone={current.tone} category={current.category} ratio="3 / 4" />
            <div>
              <p className="pcard-cat">{categoryLabels[current.category]}</p>
              <p className="look-card-name">{current.name}</p>
              <p className="price">{formatPrice(current.price)}</p>
              <a className="link-underline" href={`#produit-${current.slug}`}>
                Voir la pièce
              </a>
            </div>
          </div>
          <p className="look-total">
            Le look complet : <strong>{formatPrice(items.reduce((n, p) => n + p.price, 0))}</strong>
          </p>
        </div>
      </div>
    </section>
  )
}

function BespokeForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState<string | null>(null)

  if (state === 'sent') {
    return (
      <p className="form-note" role="status">
        Demande envoyée. La créatrice vous rappelle au {phone} pour fixer le rendez-vous.
      </p>
    )
  }
  return (
    <form
      className="bespoke-form"
      onSubmit={(e) => {
        e.preventDefault()
        setState('sending')
        setError(null)
        api
          .createRequest({ type: 'BESPOKE', customerName: name, phone, message })
          .then(() => setState('sent'))
          .catch((err) => {
            setError(err instanceof ApiError ? err.message : 'La demande n’a pas pu être envoyée.')
            setState('idle')
          })
      }}
    >
      <div className="field-row">
        <label className="field">
          <span>Nom complet</span>
          <input id="bs-name" required maxLength={120} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="field">
          <span>Téléphone (WhatsApp)</span>
          <input id="bs-phone" required maxLength={40} type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
      </div>
      <label className="field">
        <span>Votre projet : occasion, pièce souhaitée, date</span>
        <textarea id="bs-message" rows={3} maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      {error && (
        <p className="form-note form-error" role="alert">
          {error}
        </p>
      )}
      <button className="btn btn-dark" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Envoi…' : 'Demander un rendez-vous'}
      </button>
    </form>
  )
}

export default function Home() {
  const { collections, products, settings, status } = useCatalog()
  const [tab, setTab] = useState<(typeof tabs)[number]['key']>('new')

  const list =
    tab === 'best' ? products.filter((p) => p.bestseller) : tab === 'sale' ? products.filter((p) => p.oldPrice) : products.slice(0, 8)

  const categoryTiles = useMemo(() => {
    const byCategory = new Map<Category, Product[]>()
    products.forEach((p) => byCategory.set(p.category, [...(byCategory.get(p.category) ?? []), p]))
    return [...byCategory.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 4)
  }, [products])

  const featured = collections.find((c) => c.featured) ?? collections[0]
  const lookItems = featured ? products.filter((p) => p.collection === featured.slug).slice(0, 2) : []
  const instagram = settings?.instagram ?? 'beauty_of_sahel'

  return (
    <main>
      <StoryOpening />
      <Ticker />
      <SahelScene quote="Une élégance née au Sahel, faite pour être remarquée partout." author="KAOM · Beauty of Sahel" />

      {collections.length > 0 && (
        <section className="season">
          <div className="container section-head">
            <div>
              <p className="eyebrow">La saison</p>
              <h2 className="h2">Nos collections</h2>
            </div>
            <a className="link-underline" href="#collections">
              Toute la boutique
            </a>
          </div>
          <HeroSlider collections={collections} />
        </section>
      )}
      <Services />

      {categoryTiles.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head section-head-center">
              <p className="eyebrow">Acheter par catégorie</p>
              <h2 className="h2">Trouvez votre silhouette</h2>
            </div>
            <div className="cat-grid">
              {categoryTiles.map(([category, items]) => (
                <a key={category} href={`#categorie-${category.toLowerCase()}`} className="cat-tile">
                  <Visual src={items[0].images[0]?.url} motif={items[0].motif} tone={items[0].tone} category={category} ratio="3 / 4" />
                  <span className="cat-tile-label">
                    <span className="cat-tile-name">{categoryLabels[category]}</span>
                    <span className="cat-tile-count">
                      {items.length} pièce{items.length > 1 ? 's' : ''}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

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
          {status === 'loading' && <p className="muted center">Chargement des pièces…</p>}
          {status === 'ready' && list.length === 0 && <p className="muted center">Aucune pièce dans cette sélection pour le moment.</p>}
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

      <section className="section section-tight">
        <div className="container promo-grid">
          <a href="#promotions" className="promo promo-dark">
            <Visual motif="bogolan" tone="nuit" category="KAFTANS" ratio="auto" className="promo-visual" />
            <span className="promo-text">
              <span className="eyebrow">Sélection</span>
              <span className="promo-title">Les pièces en promotion</span>
              <span className="link-underline">J’en profite</span>
            </span>
          </a>
          <a href="#sur-mesure" className="promo">
            <Visual motif="tissage" tone="sable" category="ROBES" ratio="auto" className="promo-visual" />
            <span className="promo-text">
              <span className="eyebrow">Atelier de Dakar</span>
              <span className="promo-title">Votre pièce sur mesure</span>
              <span className="link-underline">Prendre rendez-vous</span>
            </span>
          </a>
        </div>
      </section>

      <Quote text="Les modes passent, le style est éternel." author="Yves Saint Laurent" variant="soft" />

      {featured && lookItems.length > 0 && <ShopTheLook collection={featured} items={lookItems} />}

      <section className="section" id="sur-mesure">
        <div className="container bespoke">
          <div className="bespoke-head">
            <p className="eyebrow">Sur mesure</p>
            <h2 className="h2">Une pièce coupée pour vous, en quatre étapes</h2>
            <ol className="steps steps-compact">
              {[
                ['Rendez-vous', 'Prise de mesures à l’atelier ou en visio.'],
                ['Choix du tissu', 'Bazin, lin, bogolan ou votre propre tissu.'],
                ['Essayage', 'Ajustement des volumes à mi-parcours.'],
                ['Livraison', 'Retrait à Dakar ou envoi suivi.'],
              ].map(([t, d], i) => (
                <li key={t} className="step">
                  <span className="step-n">{i + 1}</span>
                  <p className="step-title">{t}</p>
                  <p className="muted">{d}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="bespoke-card">
            <h3 className="bespoke-card-title">Demander un rendez-vous</h3>
            <BespokeForm />
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="container closing-inner">
          <p className="closing-title">
            « La mode se démode,
            <br />
            <em>le style jamais.</em> »
          </p>
          <p className="closing-author">Coco Chanel</p>
          <div className="opening-ctas">
            <a className="btn btn-light" href="#collections">
              Découvrir la boutique
            </a>
            <a className="btn btn-outline-light" href="#sur-mesure">
              Créer ma pièce sur mesure
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head section-head-center container">
          <p className="eyebrow">Suivez-nous</p>
          <h2 className="h2">
            <a href={`https://www.instagram.com/${instagram}`} target="_blank" rel="noreferrer">
              @{instagram}
            </a>
          </h2>
        </div>
        <div className="insta-grid">
          {(['bazin', 'indigo', 'bogolan', 'wax', 'tissage', 'bazin'] as const).map((m, i) => (
            <a key={i} href={`https://www.instagram.com/${instagram}`} target="_blank" rel="noreferrer" className="insta" aria-label="Voir sur Instagram">
              <Visual motif={m} tone={(['henne', 'indigo', 'nuit', 'mil', 'sable', 'indigo'] as const)[i]} ratio="1 / 1" />
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
