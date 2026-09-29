import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import Visual from '../components/Visual'
import Wordmark from '../components/Wordmark'
import { categories, collections, fabrics, products, type Product } from '../data/catalog'

const tabs: { key: Product['gender'] | 'Tout'; label: string }[] = [
  { key: 'Tout', label: 'Tout' },
  { key: 'Femme', label: 'Femme' },
  { key: 'Homme', label: 'Homme' },
  { key: 'Mixte', label: 'Mixte' },
]

const looks = [
  { n: '01', title: 'Boubou Latérite, sac Tanneur', motif: 'bazin', tone: 'henne' },
  { n: '02', title: 'Kaftan Nuit de Dakar', motif: 'bogolan', tone: 'nuit' },
  { n: '03', title: 'Ensemble Fleuve', motif: 'indigo', tone: 'indigo' },
  { n: '04', title: 'Robe Tiaya, voile sable', motif: 'tissage', tone: 'sable' },
  { n: '05', title: 'Veste Bogolan portée ouverte', motif: 'bogolan', tone: 'mil' },
  { n: '06', title: 'Robe wax plissée', motif: 'wax', tone: 'mil' },
] as const

const steps = [
  { title: 'Rendez-vous', text: "À l'atelier de Sacré-Cœur ou en visio. On prend vos mesures et on parle de l'occasion." },
  { title: 'Choix du tissu', text: 'Bazin, lin indigo, bogolan ou votre propre tissu. Vous validez un croquis.' },
  { title: 'Essayage', text: 'Un essayage à mi-parcours pour ajuster les volumes et les longueurs.' },
  { title: 'Livraison', text: 'Retrait à Dakar ou expédition suivie. Compter trois semaines en moyenne.' },
]

export default function Home() {
  const [tab, setTab] = useState<(typeof tabs)[number]['key']>('Tout')
  const featured = collections[0]
  const featuredProducts = products.filter((p) => p.collection === featured.slug)
  const newIn = products
    .filter((p) => p.status !== 'Brouillon')
    .filter((p) => tab === 'Tout' || p.gender === tab)

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Prêt-à-porter afro-moderne · Dakar</p>
            <h1 className="hero-mark">
              <Wordmark size="xl" />
            </h1>
            <p className="hero-lead">
              Des vêtements taillés dans les tissus du Sahel, bazin, bogolan, indigo, et coupés pour
              aujourd'hui. Chaque pièce est cousue dans notre atelier de Dakar.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-ink" href="#collection-harmattan">
                Découvrir Harmattan
              </a>
              <a className="btn btn-ghost" href="#sur-mesure">
                Commander sur mesure
              </a>
            </div>
          </div>
          <div className="hero-looks">
            <a href="#produit-grand-boubou-laterite" className="hero-look hero-look-1">
              <Visual motif="bazin" tone="henne" category="Boubous" ratio="3 / 4" />
              <span className="look-tag">Look 01 · Harmattan</span>
            </a>
            <a href="#produit-ensemble-fleuve" className="hero-look hero-look-2">
              <Visual motif="indigo" tone="indigo" category="Ensembles" ratio="3 / 4" />
              <span className="look-tag">Look 03 · Fleuve</span>
            </a>
          </div>
        </div>
      </section>

      {/* CATÉGORIES */}
      <section className="cat-strip" aria-label="Catégories">
        <div className="container cat-strip-inner">
          {categories.map((c) => (
            <a key={c.name} href="#collections" className="cat-link">
              <span className="cat-name">{c.name}</span>
              <span className="cat-count">{c.count}</span>
            </a>
          ))}
        </div>
      </section>

      {/* COLLECTION EN VEDETTE */}
      <section className="section">
        <div className="container featured">
          <div className="featured-visual">
            <Visual motif={featured.motif} tone={featured.tone} ratio="4 / 5" label="Campagne Harmattan, Lompoul" />
          </div>
          <div className="featured-body">
            <p className="eyebrow">Nouvelle collection · {featured.season}</p>
            <h2 className="display">{featured.name}</h2>
            <p className="featured-tagline">{featured.tagline}</p>
            <p className="measure">{featured.description}</p>
            <div className="featured-grid">
              {featuredProducts.slice(0, 2).map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
            <a className="link-arrow" href="#collection-harmattan">
              Voir les {featured.pieces} pièces de la collection
            </a>
          </div>
        </div>
      </section>

      {/* NOUVEAUTÉS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Arrivages de la semaine</p>
              <h2 className="h2">Nouveautés</h2>
            </div>
            <div className="tabs" role="tablist" aria-label="Filtrer les nouveautés">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={tab === t.key}
                  className="tab"
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="product-grid">
            {newIn.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="section" id="lookbook">
        <div className="container section-head">
          <div>
            <p className="eyebrow">Lookbook AH26</p>
            <h2 className="h2">Six silhouettes, un vent de saison</h2>
          </div>
          <a className="link-arrow" href="#collection-harmattan">
            Acheter les looks
          </a>
        </div>
        <div className="lookbook" tabIndex={0} aria-label="Lookbook, faire défiler horizontalement">
          {looks.map((l) => (
            <figure key={l.n} className="look">
              <Visual motif={l.motif} tone={l.tone} ratio="2 / 3" />
              <figcaption>
                <span className="look-n">Look {l.n}</span>
                <span>{l.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ATELIER */}
      <section className="section section-ink" id="atelier">
        <div className="container atelier">
          <div className="atelier-intro">
            <p className="eyebrow">L'atelier</p>
            <h2 className="h2">Des tissus qui ont une adresse.</h2>
            <p className="measure">
              KAOM travaille avec des teinturières, tisserands et brodeurs du Sénégal et du Mali.
              Nous achetons les tissus à la pièce, directement, et nous les coupons à Dakar.
            </p>
          </div>
          <dl className="fabrics">
            {fabrics.map((f) => (
              <div key={f.name} className="fabric">
                <dt>
                  <span className="fabric-name">{f.name}</span>
                  <span className="fabric-origin">{f.origin}</span>
                </dt>
                <dd>{f.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* SUR MESURE */}
      <section className="section" id="sur-mesure">
        <div className="container bespoke">
          <div className="bespoke-head">
            <p className="eyebrow">Sur mesure</p>
            <h2 className="h2">Une pièce coupée pour vous, en quatre étapes.</h2>
            <p className="measure">
              Mariage, baptême, Tabaski ou simplement l'envie d'un boubou à vos mesures. À partir de
              65 000 FCFA, tissu compris.
            </p>
            <a className="btn btn-ink" href="#sur-mesure">
              Prendre rendez-vous
            </a>
          </div>
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.title} className="step">
                <span className="step-n">{i + 1}</span>
                <h3 className="step-title">{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="section section-alt">
        <div className="container section-head">
          <div>
            <p className="eyebrow">Sur Instagram</p>
            <h2 className="h2">@beauty_of_sahel</h2>
          </div>
          <a className="link-arrow" href="https://www.instagram.com/beauty_of_sahel" target="_blank" rel="noreferrer">
            Suivre la maison
          </a>
        </div>
        <div className="container insta-grid">
          {(['bazin', 'indigo', 'bogolan', 'wax', 'tissage', 'bazin'] as const).map((m, i) => (
            <Visual
              key={i}
              motif={m}
              tone={(['henne', 'indigo', 'nuit', 'mil', 'sable', 'indigo'] as const)[i]}
              ratio="1 / 1"
            />
          ))}
        </div>
      </section>
    </main>
  )
}
