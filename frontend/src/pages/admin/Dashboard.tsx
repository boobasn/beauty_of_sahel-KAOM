import { useEffect, useState } from 'react'
import { admin } from '../../api/client'
import { formatPrice, requestStatusLabels, requestTypeLabels, type CustomerRequest, type Dashboard as Stats } from '../../api/types'
import { formatDate } from '../../lib/format'

export default function Dashboard({ go }: { go: (section: 'requests' | 'products') => void }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [latest, setLatest] = useState<CustomerRequest[]>([])

  useEffect(() => {
    admin.dashboard().then(setStats).catch(() => undefined)
    admin.requests().then((r) => setLatest(r.slice(0, 5))).catch(() => undefined)
  }, [])

  return (
    <>
      <div className="bo-stats">
        <button className="bo-stat" onClick={() => go('products')}>
          <span className="bo-stat-label">Articles en ligne</span>
          <span className="bo-stat-value">{stats?.productsPublished ?? '–'}</span>
          <span className="bo-stat-foot">sur {stats?.productsTotal ?? '–'} au catalogue</span>
        </button>
        <button className="bo-stat" onClick={() => go('requests')}>
          <span className="bo-stat-label">Demandes à traiter</span>
          <span className="bo-stat-value">{stats?.requestsNew ?? '–'}</span>
          <span className="bo-stat-foot">{stats?.requestsThisWeek ?? '–'} reçues cette semaine</span>
        </button>
        <button className="bo-stat" onClick={() => go('products')}>
          <span className="bo-stat-label">Stock faible</span>
          <span className="bo-stat-value bo-warn">{stats?.lowStock ?? '–'}</span>
          <span className="bo-stat-foot">articles à 2 pièces ou moins</span>
        </button>
        <div className="bo-stat">
          <span className="bo-stat-label">Abonnés newsletter</span>
          <span className="bo-stat-value">{stats?.subscribers ?? '–'}</span>
          <span className="bo-stat-foot">{stats?.collections ?? '–'} collections</span>
        </div>
      </div>

      <section className="bo-panel">
        <div className="bo-panel-head">
          <h2 className="bo-h">Dernières demandes</h2>
          <button className="link-underline" onClick={() => go('requests')}>
            Tout voir
          </button>
        </div>
        {latest.length === 0 ? (
          <p className="bo-empty">Aucune demande pour le moment. Les commandes et demandes de sur mesure du site arriveront ici.</p>
        ) : (
          <ul className="bo-list">
            {latest.map((r) => (
              <li key={r.id}>
                <span>
                  <strong>{r.customerName}</strong>
                  <small>
                    {requestTypeLabels[r.type]} · {formatDate(r.createdAt)}
                    {r.total > 0 && ` · ${formatPrice(r.total)}`}
                  </small>
                </span>
                <span className={`pill pill-${r.status.toLowerCase()}`}>{requestStatusLabels[r.status]}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
