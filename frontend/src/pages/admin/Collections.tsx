import { useEffect, useState } from 'react'
import { admin, ApiError } from '../../api/client'
import { motifs, tones, type Collection, type CollectionInput } from '../../api/types'
import Visual from '../../components/Visual'
import ConfirmButton from './ConfirmButton'

const toInput = (c: Collection | null, position: number): CollectionInput => ({
  name: c?.name ?? '',
  slug: c?.slug ?? '',
  season: c?.season ?? '',
  tagline: c?.tagline ?? '',
  description: c?.description ?? '',
  motif: c?.motif ?? 'bazin',
  tone: c?.tone ?? 'sable',
  featured: c?.featured ?? false,
  position: c?.position ?? position,
  published: c?.published ?? true,
})

function Editor({ collection, position, onSaved, onDeleted, onClose }: {
  collection: Collection | null
  position: number
  onSaved: (c: Collection) => void
  onDeleted: (id: number) => void
  onClose: () => void
}) {
  const [input, setInput] = useState(() => toInput(collection, position))
  const [current, setCurrent] = useState(collection)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const set = <K extends keyof CollectionInput>(k: K, v: CollectionInput[K]) => setInput((i) => ({ ...i, [k]: v }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const body = { ...input, slug: input.slug || undefined }
      const saved = current ? await admin.updateCollection(current.id, body) : await admin.createCollection(body)
      setCurrent(saved)
      onSaved(saved)
      setMessage({ kind: 'ok', text: 'Collection enregistrée.' })
    } catch (err) {
      setMessage({ kind: 'error', text: err instanceof ApiError ? err.message : 'Enregistrement impossible' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="bo-panel bo-editor">
      <div className="bo-panel-head">
        <h2 className="bo-h">{current ? 'Modifier la collection' : 'Nouvelle collection'}</h2>
        <button className="link-underline" onClick={onClose}>
          Fermer
        </button>
      </div>
      <form className="bo-form" onSubmit={save}>
        <div className="bo-photos">
          <p className="bo-label">Image de couverture</p>
          {current ? (
            <div className="bo-cover">
              <Visual src={current.coverUrl} motif={input.motif} tone={input.tone} ratio="16 / 9" />
              <label className="btn btn-outline btn-sm">
                <input
                  id="c-cover"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    admin
                      .uploadCover(current.id, f)
                      .then((c) => {
                        setCurrent(c)
                        onSaved(c)
                      })
                      .catch((err) => setMessage({ kind: 'error', text: err.message }))
                  }}
                />
                {current.coverUrl ? 'Changer l’image' : 'Choisir une image'}
              </label>
            </div>
          ) : (
            <p className="muted">Enregistrez la collection pour ajouter son image.</p>
          )}
        </div>
        <label className="field">
          <span>Nom</span>
          <input id="c-name" required maxLength={120} value={input.name} onChange={(e) => set('name', e.target.value)} />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Saison (ex. Automne-Hiver 2026)</span>
            <input id="c-season" maxLength={120} value={input.season} onChange={(e) => set('season', e.target.value)} />
          </label>
          <label className="field">
            <span>Ordre d’affichage</span>
            <input id="c-pos" type="number" min={0} value={input.position} onChange={(e) => set('position', Number(e.target.value))} />
          </label>
        </div>
        <label className="field">
          <span>Accroche</span>
          <input id="c-tagline" maxLength={300} value={input.tagline} onChange={(e) => set('tagline', e.target.value)} />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea id="c-desc" rows={3} maxLength={2000} value={input.description} onChange={(e) => set('description', e.target.value)} />
        </label>
        <label className="check">
          <input id="c-pub" type="checkbox" checked={input.published} onChange={(e) => set('published', e.target.checked)} />
          <span>Visible sur le site</span>
        </label>
        <label className="check">
          <input id="c-feat" type="checkbox" checked={input.featured} onChange={(e) => set('featured', e.target.checked)} />
          <span>Collection à la une (utilisée pour « Shop the look »)</span>
        </label>
        <details className="bo-advanced">
          <summary>Options avancées</summary>
          <label className="field">
            <span>Adresse de la page</span>
            <input id="c-slug" maxLength={120} value={input.slug} onChange={(e) => set('slug', e.target.value)} />
          </label>
          <div className="field-row">
            <label className="field">
              <span>Motif sans image</span>
              <select id="c-motif" value={input.motif} onChange={(e) => set('motif', e.target.value as CollectionInput['motif'])}>
                {motifs.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Teinte sans image</span>
              <select id="c-tone" value={input.tone} onChange={(e) => set('tone', e.target.value as CollectionInput['tone'])}>
                {tones.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>
        </details>
        {message && (
          <p className={message.kind === 'ok' ? 'form-note' : 'form-note form-error'} role="status">
            {message.text}
          </p>
        )}
        <div className="bo-form-actions">
          <button className="btn btn-dark" type="submit" disabled={saving}>
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
          {current && (
            <ConfirmButton
              label="Supprimer"
              confirmLabel="Supprimer la collection"
              onConfirm={() =>
                admin
                  .deleteCollection(current.id)
                  .then(() => onDeleted(current.id))
                  .catch((e) => setMessage({ kind: 'error', text: e.message }))
              }
            />
          )}
        </div>
      </form>
    </section>
  )
}

export default function Collections() {
  const [list, setList] = useState<Collection[]>([])
  const [editing, setEditing] = useState<Collection | 'new' | null>(null)

  useEffect(() => {
    admin.collections().then(setList).catch(() => undefined)
  }, [])

  return (
    <div className={editing ? 'bo-split' : undefined}>
      <section className="bo-panel">
        <div className="bo-panel-head">
          <h2 className="bo-h">Collections ({list.length})</h2>
          <button className="btn btn-dark btn-sm" onClick={() => setEditing('new')}>
            Nouvelle collection
          </button>
        </div>
        {list.length === 0 ? (
          <p className="bo-empty">Aucune collection. Créez-en une pour regrouper vos articles.</p>
        ) : (
          <ul className="bo-cards">
            {list.map((c) => (
              <li key={c.id}>
                <button className="bo-card" aria-pressed={editing !== 'new' && editing?.id === c.id} onClick={() => setEditing(c)}>
                  <Visual src={c.coverUrl} motif={c.motif} tone={c.tone} ratio="16 / 9" />
                  <span className="bo-card-body">
                    <strong>{c.name}</strong>
                    <small>
                      {c.season || 'Sans saison'} · {c.productCount} article{c.productCount > 1 ? 's' : ''}
                    </small>
                    <span className="bo-card-pills">
                      <span className={`pill ${c.published ? 'pill-ok' : 'pill-draft'}`}>{c.published ? 'Visible' : 'Masquée'}</span>
                      {c.featured && <span className="pill pill-warn">À la une</span>}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      {editing && (
        <Editor
          key={editing === 'new' ? 'new' : editing.id}
          collection={editing === 'new' ? null : editing}
          position={list.length + 1}
          onSaved={(c) =>
            setList((prev) => {
              const next = prev.some((x) => x.id === c.id) ? prev.map((x) => (x.id === c.id ? c : x)) : [...prev, c]
              return c.featured ? next.map((x) => (x.id === c.id ? x : { ...x, featured: false })) : next
            })
          }
          onDeleted={(id) => {
            setList((prev) => prev.filter((c) => c.id !== id))
            setEditing(null)
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
