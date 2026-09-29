import { useState } from 'react'
import Visual from '../components/Visual'
import Wordmark from '../components/Wordmark'
import { collections, formatPrice, products, type Product } from '../data/catalog'

// Aperçu du backoffice de la créatrice (maquette, données d'exemple).

const menu = ['Tableau de bord', 'Articles', 'Collections', 'Demandes', 'Lookbook', 'Paramètres'] as const

const requests = [
  { who: 'Aïssatou D.', what: 'Grand boubou Latérite · M', when: 'il y a 12 min', state: 'Nouvelle' },
  { who: 'Moussa K.', what: 'Sur mesure · Kaftan mariage', when: 'il y a 2 h', state: 'Rendez-vous fixé' },
  { who: 'Fatou S.', what: 'Ensemble Fleuve · S', when: 'hier', state: 'Payée' },
]

const statusClass: Record<Product['status'], string> = {
  'En ligne': 'pill-ok',
  Brouillon: 'pill-draft',
  Rupture: 'pill-warn',
}

export default function Backoffice() {
  const [active, setActive] = useState<(typeof menu)[number]>('Articles')
  const [editing, setEditing] = useState<Product>(products[0])
  const [saved, setSaved] = useState(false)
  const [query, setQuery] = useState('')

  const rows = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
  const online = products.filter((p) => p.status === 'En ligne').length

  return (
    <div className="bo">
      <aside className="bo-side">
        <div className="bo-brand">
          <Wordmark />
          <span>Espace créatrice</span>
        </div>
        <nav className="bo-nav">
          {menu.map((m) => (
            <button key={m} aria-current={active === m ? 'page' : undefined} onClick={() => setActive(m)}>
              {m}
              {m === 'Demandes' && <span className="bo-dot">3</span>}
            </button>
          ))}
        </nav>
        <a className="bo-back" href="#">
          Voir le site
        </a>
      </aside>

      <main className="bo-main">
        <header className="bo-top">
          <div>
            <p className="eyebrow">Espace créatrice</p>
            <h1 className="h2">Articles</h1>
          </div>
          <button className="btn btn-ink" onClick={() => setEditing({ ...products[0], slug: 'nouveau', name: '', price: 0, status: 'Brouillon', stock: 0 })}>
            Ajouter un article
          </button>
        </header>

        <div className="bo-stats">
          <div className="bo-stat">
            <span className="bo-stat-label">Articles en ligne</span>
            <span className="bo-stat-value">{online}</span>
            <span className="bo-stat-foot">sur {products.length} au catalogue</span>
          </div>
          <div className="bo-stat">
            <span className="bo-stat-label">Demandes cette semaine</span>
            <span className="bo-stat-value">17</span>
            <span className="bo-stat-foot">3 à traiter</span>
          </div>
          <div className="bo-stat">
            <span className="bo-stat-label">Collections publiées</span>
            <span className="bo-stat-value">{collections.length}</span>
            <span className="bo-stat-foot">Harmattan en vedette</span>
          </div>
          <div className="bo-stat">
            <span className="bo-stat-label">Stock faible</span>
            <span className="bo-stat-value bo-warn">{products.filter((p) => p.stock <= 2).length}</span>
            <span className="bo-stat-foot">pièces à 2 ou moins</span>
          </div>
        </div>

        <div className="bo-content">
          <section className="bo-panel bo-table-panel">
            <div className="bo-panel-head">
              <h2 className="bo-h">Catalogue</h2>
              <label className="bo-search">
                <span className="sr-only">Rechercher un article</span>
                <input id="bo-search" placeholder="Rechercher un article" value={query} onChange={(e) => setQuery(e.target.value)} />
              </label>
            </div>
            <div className="bo-table-wrap">
              <table className="bo-table">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Collection</th>
                    <th className="num">Prix</th>
                    <th className="num">Stock</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p.slug} aria-selected={editing.slug === p.slug} onClick={() => { setEditing(p); setSaved(false) }}>
                      <td>
                        <span className="bo-item">
                          <span className="bo-thumb">
                            <Visual motif={p.motif} tone={p.tone} category={p.category} ratio="1 / 1" />
                          </span>
                          <span>
                            <strong>{p.name}</strong>
                            <small>{p.category}</small>
                          </span>
                        </span>
                      </td>
                      <td>{collections.find((c) => c.slug === p.collection)?.name}</td>
                      <td className="num">{formatPrice(p.price)}</td>
                      <td className="num">{p.stock}</td>
                      <td>
                        <span className={`pill ${statusClass[p.status]}`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bo-panel bo-form-panel">
            <div className="bo-panel-head">
              <h2 className="bo-h">{editing.name ? 'Modifier l’article' : 'Nouvel article'}</h2>
            </div>
            <form
              className="bo-form"
              onSubmit={(e) => {
                e.preventDefault()
                setSaved(true)
              }}
            >
              <div className="bo-upload">
                <Visual motif={editing.motif} tone={editing.tone} category={editing.category} ratio="1 / 1" />
                <div className="bo-upload-drop">
                  <strong>Photos</strong>
                  <span>Glissez jusqu’à 8 photos, JPG ou PNG, 2 000 px conseillés.</span>
                </div>
              </div>
              <label className="field">
                <span>Nom</span>
                <input id="bo-name" key={`n-${editing.slug}`} defaultValue={editing.name} required />
              </label>
              <div className="field-row">
                <label className="field">
                  <span>Prix (FCFA)</span>
                  <input id="bo-price" key={`p-${editing.slug}`} type="number" min="0" step="500" defaultValue={editing.price} />
                </label>
                <label className="field">
                  <span>Stock</span>
                  <input id="bo-stock" key={`s-${editing.slug}`} type="number" min="0" defaultValue={editing.stock} />
                </label>
              </div>
              <div className="field-row">
                <label className="field">
                  <span>Collection</span>
                  <select id="bo-coll" key={`c-${editing.slug}`} defaultValue={editing.collection}>
                    {collections.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Statut</span>
                  <select id="bo-status" key={`st-${editing.slug}`} defaultValue={editing.status}>
                    <option>En ligne</option>
                    <option>Brouillon</option>
                    <option>Rupture</option>
                  </select>
                </label>
              </div>
              <label className="field">
                <span>Tissu et description</span>
                <textarea id="bo-desc" key={`d-${editing.slug}`} rows={3} defaultValue={editing.fabric} />
              </label>
              <div className="bo-form-actions">
                <button className="btn btn-ink" type="submit">
                  Enregistrer
                </button>
                <button className="btn btn-ghost" type="button">
                  Aperçu
                </button>
              </div>
              {saved && <p className="form-note" role="status">Article enregistré (maquette, rien n’est envoyé).</p>}
            </form>
          </section>

          <section className="bo-panel bo-requests">
            <div className="bo-panel-head">
              <h2 className="bo-h">Dernières demandes</h2>
            </div>
            <ul>
              {requests.map((r) => (
                <li key={r.who}>
                  <span>
                    <strong>{r.who}</strong>
                    <small>{r.what}</small>
                  </span>
                  <span className="bo-req-right">
                    <span className={`pill ${r.state === 'Nouvelle' ? 'pill-warn' : r.state === 'Payée' ? 'pill-ok' : 'pill-draft'}`}>{r.state}</span>
                    <small>{r.when}</small>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
