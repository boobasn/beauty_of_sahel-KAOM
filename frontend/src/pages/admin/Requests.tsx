import { useEffect, useState } from 'react'
import { admin } from '../../api/client'
import {
  formatPrice,
  requestStatusLabels,
  requestTypeLabels,
  type CustomerRequest,
  type RequestStatus,
} from '../../api/types'
import { formatDate, whatsappLink } from '../../lib/format'
import ConfirmButton from './ConfirmButton'

const statuses = Object.keys(requestStatusLabels) as RequestStatus[]

export default function Requests() {
  const [list, setList] = useState<CustomerRequest[]>([])
  const [filter, setFilter] = useState<RequestStatus | 'ALL'>('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    admin.requests().then(setList).finally(() => setLoading(false))
  }, [])

  const shown = filter === 'ALL' ? list : list.filter((r) => r.status === filter)
  const update = (id: number, status: RequestStatus) =>
    admin.updateRequest(id, status).then((r) => setList((prev) => prev.map((x) => (x.id === id ? r : x))))

  return (
    <section className="bo-panel">
      <div className="bo-panel-head">
        <h2 className="bo-h">Demandes et commandes</h2>
        <div className="chips" role="group" aria-label="Filtrer par statut">
          {(['ALL', ...statuses] as const).map((s) => (
            <button key={s} className="chip" aria-pressed={filter === s} onClick={() => setFilter(s)}>
              {s === 'ALL' ? 'Toutes' : requestStatusLabels[s]} ({s === 'ALL' ? list.length : list.filter((r) => r.status === s).length})
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <p className="bo-empty">Chargement…</p>
      ) : shown.length === 0 ? (
        <p className="bo-empty">Aucune demande dans cette liste.</p>
      ) : (
        <ul className="bo-requests">
          {shown.map((r) => (
            <li key={r.id} className="bo-request">
              <div className="bo-request-head">
                <div>
                  <p className="bo-request-title">
                    <span className="pill pill-draft">{requestTypeLabels[r.type]}</span> n° {r.id} · <strong>{r.customerName}</strong>
                  </p>
                  <p className="muted">
                    {formatDate(r.createdAt)} · <span className="selectable">{r.phone}</span>
                    {r.email && (
                      <>
                        {' '}
                        · <span className="selectable">{r.email}</span>
                      </>
                    )}
                  </p>
                </div>
                <label className="select">
                  <span className="sr-only">Statut</span>
                  <select id={`st-${r.id}`} value={r.status} onChange={(e) => update(r.id, e.target.value as RequestStatus)}>
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {requestStatusLabels[s]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {r.items && <pre className="bo-request-items">{r.items}</pre>}
              {r.total > 0 && <p className="bo-request-total">Total : {formatPrice(r.total)}</p>}
              {r.message && <p className="bo-request-msg">{r.message}</p>}
              <div className="bo-form-actions">
                <a
                  className="btn btn-dark btn-sm"
                  href={whatsappLink(r.phone, `Bonjour ${r.customerName}, c’est KAOM · Beauty of Sahel au sujet de votre demande n° ${r.id}.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Répondre sur WhatsApp
                </a>
                <ConfirmButton
                  label="Supprimer"
                  confirmLabel="Supprimer la demande"
                  onConfirm={() => admin.deleteRequest(r.id).then(() => setList((prev) => prev.filter((x) => x.id !== r.id)))}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
