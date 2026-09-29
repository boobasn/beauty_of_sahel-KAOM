import { useEffect, useMemo, useRef, useState } from 'react'
import { admin, ApiError } from '../../api/client'
import {
  categories,
  categoryLabels,
  formatPrice,
  genderLabels,
  motifs,
  tones,
  type Collection,
  type Gender,
  type Product,
  type ProductInput,
} from '../../api/types'
import Visual from '../../components/Visual'
import ConfirmButton from './ConfirmButton'

const emptyInput = (collection: string | null): ProductInput => ({
  name: '',
  slug: '',
  collection,
  category: 'ROBES',
  gender: 'FEMME',
  price: 0,
  oldPrice: null,
  fabric: '',
  description: '',
  motif: 'bazin',
  tone: 'sable',
  badge: '',
  bestseller: false,
  status: 'DRAFT',
  stock: 0,
  sizes: ['S', 'M', 'L'],
  colors: [],
})

const toInput = (p: Product): ProductInput => ({
  name: p.name,
  slug: p.slug,
  collection: p.collection,
  category: p.category,
  gender: p.gender,
  price: p.price,
  oldPrice: p.oldPrice,
  fabric: p.fabric ?? '',
  description: p.description ?? '',
  motif: p.motif,
  tone: p.tone,
  badge: p.badge ?? '',
  bestseller: p.bestseller,
  status: p.status,
  stock: p.stock,
  sizes: p.sizes,
  colors: p.colors,
})

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Unique', 'Sur mesure']

function Editor({
  product,
  collections,
  onSaved,
  onDeleted,
  onClose,
}: {
  product: Product | null
  collections: Collection[]
  onSaved: (p: Product) => void
  onDeleted: (id: number) => void
  onClose: () => void
}) {
  const [input, setInput] = useState<ProductInput>(() => (product ? toInput(product) : emptyInput(collections[0]?.slug ?? null)))
  const [current, setCurrent] = useState<Product | null>(product)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)
  const [fields, setFields] = useState<Record<string, string>>({})
  const [customSize, setCustomSize] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => setInput((i) => ({ ...i, [key]: value }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    setFields({})
    try {
      const body = { ...input, slug: input.slug || undefined, oldPrice: input.oldPrice || null }
      const saved = current ? await admin.updateProduct(current.id, body) : await admin.createProduct(body)
      setCurrent(saved)
      setInput(toInput(saved))
      onSaved(saved)
      setMessage({ kind: 'ok', text: current ? 'Article enregistré.' : 'Article créé. Vous pouvez maintenant ajouter des photos.' })
    } catch (err) {
      if (err instanceof ApiError) {
        setFields(err.fields)
        setMessage({ kind: 'error', text: err.message })
      }
    } finally {
      setSaving(false)
    }
  }

  const upload = async (files: FileList | null) => {
    if (!files || !current) return
    setMessage(null)
    try {
      const saved = await admin.uploadImages(current.id, [...files])
      setCurrent(saved)
      onSaved(saved)
    } catch (err) {
      setMessage({ kind: 'error', text: err instanceof ApiError ? err.message : 'Envoi impossible' })
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const removeImage = async (imageId: number) => {
    if (!current) return
    const saved = await admin.deleteImage(current.id, imageId)
    setCurrent(saved)
    onSaved(saved)
  }

  const toggleSize = (s: string) =>
    set('sizes', input.sizes.includes(s) ? input.sizes.filter((x) => x !== s) : [...input.sizes, s])

  const err = (name: string) => fields[name] && <small className="field-error">{fields[name]}</small>

  return (
    <section className="bo-panel bo-editor" aria-label={current ? `Modifier ${current.name}` : 'Nouvel article'}>
      <div className="bo-panel-head">
        <h2 className="bo-h">{current ? 'Modifier l’article' : 'Nouvel article'}</h2>
        <button className="link-underline" onClick={onClose}>
          Fermer
        </button>
      </div>
      <form className="bo-form" onSubmit={save}>
        <div className="bo-photos">
          <p className="bo-label">Photos</p>
          {current ? (
            <>
              <div className="bo-photo-grid">
                {current.images.map((img) => (
                  <figure key={img.id} className="bo-photo">
                    <Visual src={img.url} motif={input.motif} tone={input.tone} ratio="3 / 4" />
                    <button type="button" className="bo-photo-remove" onClick={() => removeImage(img.id)} aria-label="Retirer la photo">
                      ×
                    </button>
                  </figure>
                ))}
                {current.images.length < 8 && (
                  <label className="bo-photo-add">
                    <input
                      ref={fileRef}
                      id="bo-files"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={(e) => upload(e.target.files)}
                    />
                    <span>+ Ajouter</span>
                  </label>
                )}
              </div>
              <small className="muted">JPG, PNG ou WebP, 8 Mo maximum, 8 photos par article. La première photo est la photo principale.</small>
            </>
          ) : (
            <p className="muted">Enregistrez l’article pour pouvoir ajouter des photos.</p>
          )}
        </div>

        <label className="field">
          <span>Nom</span>
          <input id="p-name" required maxLength={160} value={input.name} onChange={(e) => set('name', e.target.value)} />
          {err('name')}
        </label>

        <div className="field-row">
          <label className="field">
            <span>Prix (FCFA)</span>
            <input id="p-price" type="number" min={0} step={500} required value={input.price} onChange={(e) => set('price', Number(e.target.value))} />
            {err('price')}
          </label>
          <label className="field">
            <span>Prix barré (facultatif)</span>
            <input
              id="p-old"
              type="number"
              min={0}
              step={500}
              value={input.oldPrice ?? ''}
              onChange={(e) => set('oldPrice', e.target.value ? Number(e.target.value) : null)}
            />
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            <span>Stock</span>
            <input id="p-stock" type="number" min={0} value={input.stock} onChange={(e) => set('stock', Number(e.target.value))} />
          </label>
          <label className="field">
            <span>Statut</span>
            <select id="p-status" value={input.status} onChange={(e) => set('status', e.target.value as ProductInput['status'])}>
              <option value="PUBLISHED">En ligne</option>
              <option value="DRAFT">Brouillon (invisible)</option>
            </select>
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            <span>Collection</span>
            <select id="p-coll" value={input.collection ?? ''} onChange={(e) => set('collection', e.target.value || null)}>
              <option value="">Aucune</option>
              {collections.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Catégorie</span>
            <select id="p-cat" value={input.category} onChange={(e) => set('category', e.target.value as ProductInput['category'])}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabels[c]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            <span>Pour</span>
            <select id="p-gender" value={input.gender} onChange={(e) => set('gender', e.target.value as Gender)}>
              {(Object.keys(genderLabels) as Gender[]).map((g) => (
                <option key={g} value={g}>
                  {genderLabels[g]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Étiquette (ex. Nouveau)</span>
            <input id="p-badge" maxLength={40} value={input.badge} onChange={(e) => set('badge', e.target.value)} />
          </label>
        </div>

        <label className="field">
          <span>Tissu</span>
          <input id="p-fabric" maxLength={300} value={input.fabric} onChange={(e) => set('fabric', e.target.value)} />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea id="p-desc" rows={3} maxLength={4000} value={input.description} onChange={(e) => set('description', e.target.value)} />
        </label>

        <div className="field">
          <span>Tailles</span>
          <div className="size-grid">
            {[...new Set([...PRESET_SIZES, ...input.sizes])].map((s) => (
              <button type="button" key={s} className="size-btn" aria-pressed={input.sizes.includes(s)} onClick={() => toggleSize(s)}>
                {s}
              </button>
            ))}
          </div>
          <div className="inline-add">
            <input id="p-size-custom" placeholder="Autre taille (ex. 38)" maxLength={30} value={customSize} onChange={(e) => setCustomSize(e.target.value)} />
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                if (customSize.trim() && !input.sizes.includes(customSize.trim())) set('sizes', [...input.sizes, customSize.trim()])
                setCustomSize('')
              }}
            >
              Ajouter
            </button>
          </div>
        </div>

        <div className="field">
          <span>Couleurs</span>
          {input.colors.map((c, i) => (
            <div key={i} className="color-row">
              <input
                type="color"
                aria-label="Teinte"
                value={c.hex}
                onChange={(e) => set('colors', input.colors.map((x, j) => (j === i ? { ...x, hex: e.target.value.toUpperCase() } : x)))}
              />
              <input
                aria-label="Nom de la couleur"
                value={c.name}
                maxLength={60}
                onChange={(e) => set('colors', input.colors.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
              />
              <button type="button" className="icon-btn" aria-label="Retirer la couleur" onClick={() => set('colors', input.colors.filter((_, j) => j !== i))}>
                ×
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={() => set('colors', [...input.colors, { name: 'Nouvelle couleur', hex: '#27336A' }])}>
            + Ajouter une couleur
          </button>
        </div>

        <details className="bo-advanced">
          <summary>Options avancées</summary>
          <label className="field">
            <span>Adresse de la page (laisser vide pour la créer à partir du nom)</span>
            <input id="p-slug" maxLength={160} value={input.slug} onChange={(e) => set('slug', e.target.value)} />
            {err('slug')}
          </label>
          <div className="field-row">
            <label className="field">
              <span>Motif sans photo</span>
              <select id="p-motif" value={input.motif} onChange={(e) => set('motif', e.target.value as ProductInput['motif'])}>
                {motifs.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Teinte sans photo</span>
              <select id="p-tone" value={input.tone} onChange={(e) => set('tone', e.target.value as ProductInput['tone'])}>
                {tones.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="check">
            <input id="p-best" type="checkbox" checked={input.bestseller} onChange={(e) => set('bestseller', e.target.checked)} />
            <span>Afficher dans « Meilleures ventes »</span>
          </label>
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
            <a className="btn btn-outline" href={`#produit-${current.slug}`} target="_blank" rel="noreferrer">
              Voir sur le site
            </a>
          )}
          {current && (
            <ConfirmButton
              label="Supprimer"
              confirmLabel="Supprimer définitivement"
              onConfirm={() =>
                admin
                  .deleteProduct(current.id)
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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Product | 'new' | null>(null)

  useEffect(() => {
    Promise.all([admin.products(), admin.collections()])
      .then(([p, c]) => {
        setProducts(p)
        setCollections(c)
      })
      .finally(() => setLoading(false))
  }, [])

  const rows = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase().trim())),
    [products, query],
  )

  const onSaved = (p: Product) => {
    setProducts((prev) => (prev.some((x) => x.id === p.id) ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev]))
  }

  return (
    <div className={editing ? 'bo-split' : undefined}>
      <section className="bo-panel">
        <div className="bo-panel-head">
          <h2 className="bo-h">Catalogue ({products.length})</h2>
          <div className="bo-head-actions">
            <label className="bo-search">
              <span className="sr-only">Rechercher un article</span>
              <input id="bo-search" placeholder="Rechercher un article" value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
            <button className="btn btn-dark btn-sm" onClick={() => setEditing('new')}>
              Ajouter un article
            </button>
          </div>
        </div>
        {loading ? (
          <p className="bo-empty">Chargement…</p>
        ) : rows.length === 0 ? (
          <p className="bo-empty">{products.length === 0 ? 'Aucun article. Ajoutez votre première pièce.' : 'Aucun article ne correspond à la recherche.'}</p>
        ) : (
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
                  <tr
                    key={p.id}
                    aria-selected={editing !== 'new' && editing?.id === p.id}
                    tabIndex={0}
                    onClick={() => setEditing(p)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditing(p)}
                  >
                    <td>
                      <span className="bo-item">
                        <span className="bo-thumb">
                          <Visual src={p.images[0]?.url} motif={p.motif} tone={p.tone} category={p.category} ratio="1 / 1" />
                        </span>
                        <span>
                          <strong>{p.name}</strong>
                          <small>{categoryLabels[p.category]}</small>
                        </span>
                      </span>
                    </td>
                    <td>{p.collectionName ?? '—'}</td>
                    <td className="num">{formatPrice(p.price)}</td>
                    <td className="num">{p.stock}</td>
                    <td>
                      <span className={`pill ${p.status === 'DRAFT' ? 'pill-draft' : p.stock === 0 ? 'pill-warn' : 'pill-ok'}`}>
                        {p.status === 'DRAFT' ? 'Brouillon' : p.stock === 0 ? 'Rupture' : 'En ligne'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editing && (
        <Editor
          key={editing === 'new' ? 'new' : editing.id}
          product={editing === 'new' ? null : editing}
          collections={collections}
          onSaved={onSaved}
          onDeleted={(id) => {
            setProducts((prev) => prev.filter((p) => p.id !== id))
            setEditing(null)
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}
