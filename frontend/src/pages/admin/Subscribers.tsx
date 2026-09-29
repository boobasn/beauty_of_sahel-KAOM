import { useEffect, useState } from 'react'
import { admin } from '../../api/client'
import { formatDate } from '../../lib/format'

export default function Subscribers() {
  const [list, setList] = useState<{ email: string; createdAt: string }[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    admin.subscribers().then(setList).catch(() => undefined)
  }, [])

  const all = list.map((s) => s.email).join(', ')

  return (
    <section className="bo-panel">
      <div className="bo-panel-head">
        <h2 className="bo-h">Abonnés à la newsletter ({list.length})</h2>
        {list.length > 0 && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() =>
              navigator.clipboard
                .writeText(all)
                .then(() => setCopied(true))
                .catch(() => setCopied(false))
            }
          >
            {copied ? 'Adresses copiées' : 'Copier toutes les adresses'}
          </button>
        )}
      </div>
      {list.length === 0 ? (
        <p className="bo-empty">Aucun abonné pour le moment. Le formulaire est en bas de chaque page du site.</p>
      ) : (
        <ul className="bo-list">
          {list.map((s) => (
            <li key={s.email}>
              <span className="selectable">{s.email}</span>
              <small className="muted">{formatDate(s.createdAt)}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
